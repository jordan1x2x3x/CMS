import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SmtpClient } from 'https://deno.land/x/smtp@v0.7.0/mod.ts';

const GMAIL_USER   = Deno.env.get('GMAIL_USER')!;
const GMAIL_PASS   = Deno.env.get('GMAIL_PASS')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const DEPT_NAMES: Record<string, string> = {
  hod:            'Head of Department (HOD)',
  cedgs:          'CEDGS',
  lab:            'Lab Instructor',
  college:        'College Officer',
  esm:            'ESM (Music)',
  chapel:         'Chapel',
  health:         'Health Centre',
  sport:          'Sport',
  hall:           'Hall of Residence',
  ict:            'ICT Unit',
  alumni:         'Alumni',
  student_affairs:'Student Affairs',
  library:        'Library',
  bursary:        'Bursary',
  academic:       'Academic Affairs (Registrar)',
};

const TOTAL_DEPTS = 15;

serve(async (req) => {
  try {
    const payload = await req.json();
    console.log('Webhook received:', JSON.stringify(payload));

    const newRecord = payload.record;
    const oldRecord = payload.old_record;

    console.log('New status:', newRecord?.status, '| Old status:', oldRecord?.status);

    const notifiable = ['approved', 'flagged', 'rejected'];
    if (!notifiable.includes(newRecord?.status)) {
      console.log('Status not notifiable, skipping.');
      return new Response('status not notifiable', { status: 200 });
    }

    if (oldRecord && newRecord.status === oldRecord.status) {
      console.log('Status unchanged, skipping.');
      return new Response('no status change', { status: 200 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    const { data: item, error: itemErr } = await supabase
      .from('clearance_items')
      .select(`
        id, department_id, status, reason,
        clearance_requests (
          id, student_id,
          profiles ( first_name, last_name, email )
        )
      `)
      .eq('id', newRecord.id)
      .single();

    if (itemErr || !item) {
      console.error('Failed to fetch item:', itemErr);
      return new Response('item not found', { status: 200 });
    }

    const req_data  = item.clearance_requests as any;
    const profile   = req_data?.profiles as any;
    const requestId = req_data?.id;

    if (!profile?.email) {
      console.error('No student email found.');
      return new Response('no student email', { status: 200 });
    }

    console.log('Sending email to:', profile.email);

    const firstName = profile.first_name || 'Student';
    const deptName  = DEPT_NAMES[item.department_id] || item.department_id;

    // Check if ALL departments are approved
    const { data: allItems } = await supabase
      .from('clearance_items')
      .select('status')
      .eq('request_id', requestId);

    const allApproved =
      allItems &&
      allItems.length === TOTAL_DEPTS &&
      allItems.every((i: any) => i.status === 'approved');

    console.log('All approved?', allApproved, '| Items count:', allItems?.length);

    const subject = allApproved
      ? '🎓 Congratulations! Your MTU Clearance is Complete'
      : statusSubject(newRecord.status, deptName);

    const html = allApproved
      ? completionEmail(firstName)
      : statusEmail(firstName, newRecord.status, deptName, item.reason || '');

    // Send via Gmail SMTP
    const client = new SmtpClient();
    await client.connectTLS({
      hostname: 'smtp.gmail.com',
      port: 465,
      username: GMAIL_USER,
      password: GMAIL_PASS,
    });

    await client.send({
      from: `MTU Clearance Portal <${GMAIL_USER}>`,
      to: profile.email,
      subject,
      content: 'Please view this email in an HTML-compatible client.',
      html,
    });

    await client.close();
    console.log('Email sent successfully to:', profile.email);

    return new Response(JSON.stringify({ success: true, to: profile.email }), { status: 200 });

  } catch (err) {
    console.error('Unhandled error:', String(err));
    return new Response(String(err), { status: 500 });
  }
});

// ── Email templates ───────────────────────────────────────────

function statusSubject(status: string, dept: string): string {
  if (status === 'approved') return `✅ ${dept} Clearance Approved — MTU Portal`;
  if (status === 'flagged')  return `⚠️ Action Required: ${dept} Clearance Flagged`;
  if (status === 'rejected') return `❌ ${dept} Clearance Rejected — MTU Portal`;
  return `MTU Clearance Update — ${dept}`;
}

function statusEmail(name: string, status: string, dept: string, reason: string): string {
  const configs: Record<string, { color: string; icon: string; heading: string; body: string }> = {
    approved: {
      color:   '#10B981',
      icon:    '✅',
      heading: `Your ${dept} clearance has been approved!`,
      body:    `Great news! The ${dept} officer has reviewed and approved your clearance request. You are one step closer to completing your graduation clearance.`,
    },
    flagged: {
      color:   '#F97316',
      icon:    '⚠️',
      heading: `Your ${dept} clearance needs attention`,
      body:    `The ${dept} officer has flagged your clearance request and requires you to take action.${reason ? `<br/><br/><strong>Reason:</strong> ${reason}` : ''} Please log in to the portal to view the details and resolve this issue.`,
    },
    rejected: {
      color:   '#EF4444',
      icon:    '❌',
      heading: `Your ${dept} clearance was rejected`,
      body:    `Unfortunately, the ${dept} officer has rejected your clearance request.${reason ? `<br/><br/><strong>Reason:</strong> ${reason}` : ''} Please log in to the portal to review the feedback and contact the department if necessary.`,
    },
  };

  const c = configs[status] || configs['flagged'];

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#F4F6F9;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F9;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#4A0058,#6B0080);padding:32px 40px;">
            <div style="font-size:20px;font-weight:700;color:#ffffff;font-family:Georgia,serif;">MTU Clearance Portal</div>
            <div style="font-size:12px;color:rgba(255,255,255,0.6);margin-top:2px;">Mountain Top University</div>
          </td>
        </tr>
        <tr>
          <td style="background:${c.color};padding:16px 40px;">
            <span style="color:#ffffff;font-size:15px;font-weight:700;">${c.icon} ${c.heading}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px;">
            <p style="font-size:15px;color:#1A0020;margin:0 0 12px;">Dear <strong>${name}</strong>,</p>
            <p style="font-size:14px;color:#374151;line-height:1.7;margin:0 0 24px;">${c.body}</p>
            <a href="https://jordan1x2x3x.github.io/CMS/student/clearance-tracking.html"
               style="display:inline-block;background:#6B0080;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:13px;font-weight:700;">
              View Clearance Status →
            </a>
          </td>
        </tr>
        <tr>
          <td style="background:#F9FAFB;padding:20px 40px;border-top:1px solid #E5E7EB;">
            <p style="font-size:11px;color:#9CA3AF;margin:0;">Automated notification from MTU Clearance Portal. Contact <a href="mailto:registrar@mtu.edu.ng" style="color:#6B0080;">registrar@mtu.edu.ng</a> for support.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function completionEmail(name: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#F4F6F9;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F9;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#4A0058,#6B0080);padding:32px 40px;">
            <div style="font-size:20px;font-weight:700;color:#ffffff;font-family:Georgia,serif;">MTU Clearance Portal</div>
            <div style="font-size:12px;color:rgba(255,255,255,0.6);margin-top:2px;">Mountain Top University</div>
          </td>
        </tr>
        <tr>
          <td style="background:#10B981;padding:16px 40px;">
            <span style="color:#ffffff;font-size:15px;font-weight:700;">🎉 Clearance Complete — All 15 Departments Approved!</span>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px;">
            <p style="font-size:15px;color:#1A0020;margin:0 0 12px;">Dear <strong>${name}</strong>,</p>
            <p style="font-size:14px;color:#374151;line-height:1.7;margin:0 0 16px;">
              Congratulations! 🎊 You have successfully completed your graduation clearance. All <strong>15 departments</strong> have approved your request.
            </p>
            <p style="font-size:14px;color:#374151;line-height:1.7;margin:0 0 24px;">You may now download your official <strong>Clearance Certificate</strong>.</p>
            <a href="https://jordan1x2x3x.github.io/CMS/student/final-certificate.html"
               style="display:inline-block;background:#76B82A;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:13px;font-weight:700;">
              Download Certificate →
            </a>
          </td>
        </tr>
        <tr>
          <td style="background:#F9FAFB;padding:20px 40px;border-top:1px solid #E5E7EB;">
            <p style="font-size:11px;color:#9CA3AF;margin:0;">Automated notification from MTU Clearance Portal. Contact <a href="mailto:registrar@mtu.edu.ng" style="color:#6B0080;">registrar@mtu.edu.ng</a> for support.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
