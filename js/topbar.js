// Shared topbar: notification bell + avatar profile dropdown
// Drop-in: <script type="module" src="../js/topbar.js"></script>
// No page changes needed — discovers bell/avatar by class/ID.

(async () => {
  if (document.readyState === 'loading') {
    await new Promise(r => document.addEventListener('DOMContentLoaded', r, { once: true }));
  }

  const { supabase } = await import('./supabase.js');
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', session.user.id).maybeSingle();
  if (!profile) return;

  const role     = profile.role || 'student';
  const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'User';

  // Derive base path from current URL
  const path = location.pathname;
  const inSub = /\/(student|admin|dept-officer|super-admin)\//.test(path);
  const base  = inSub ? '../' : '';

  const settingsMap = {
    student:     `${base}student/student-settings.html`,
    officer:     `${base}dept-officer/officer-settings.html`,
    admin:       `${base}admin/admin-settings.html`,
    super_admin: `${base}super-admin/super-admin-settings.html`,
  };
  const viewAllMap = {
    student: `${base}student/clearance-tracking.html`,
    officer: `${base}dept-officer/officer-requests.html`,
    admin:   `${base}admin/admin-requests.html`,
    super_admin: `${base}admin/admin-requests.html`,
  };
  const roleLabels = {
    student: 'Student', officer: 'Department Officer',
    admin: 'Administrator', super_admin: 'Super Administrator',
  };

  const settingsUrl = settingsMap[role] || '#';
  const viewAllUrl  = viewAllMap[role]  || '#';
  const logoutUrl   = `${base}logout.html`;
  const roleLabel   = roleLabels[role]  || 'User';

  // ── CSS ─────────────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    .tb-panel {
      position: fixed; z-index: 9999;
      background: #fff; border: 1px solid #E2E8F0; border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.13);
      font-family: 'Inter', sans-serif;
      animation: tbFadeIn 0.14s ease;
    }
    .tb-panel.tb-hidden { display: none !important; }
    @keyframes tbFadeIn {
      from { opacity: 0; transform: translateY(-8px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* ── Notification panel ── */
    #tbNotifPanel { width: 330px; display: flex; flex-direction: column; max-height: 420px; }
    .tb-notif-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 0.8rem 1rem; border-bottom: 1px solid #E2E8F0; flex-shrink: 0;
    }
    .tb-notif-header h4 {
      font-size: 0.85rem; font-weight: 700; color: #1A0020; margin: 0;
      display: flex; align-items: center; gap: 6px;
    }
    .tb-notif-header h4 .material-symbols-outlined { font-size: 17px; }
    .tb-mark-read {
      font-size: 0.7rem; font-weight: 600; color: #6B0080;
      background: none; border: none; cursor: pointer; padding: 0;
    }
    .tb-mark-read:hover { text-decoration: underline; }
    .tb-notif-list { overflow-y: auto; flex: 1; }
    .tb-notif-item {
      display: flex; align-items: flex-start; gap: 10px;
      padding: 0.7rem 1rem; border-bottom: 1px solid #F1F5F9;
      transition: background 0.12s; cursor: default;
    }
    .tb-notif-item.tb-unread { background: #FAF5FF; }
    .tb-notif-item:hover { background: #F8FAFC; }
    .tb-notif-icon {
      width: 30px; height: 30px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .tb-notif-icon .material-symbols-outlined {
      font-size: 15px; font-variation-settings: 'FILL' 1;
    }
    .tb-notif-body { flex: 1; min-width: 0; }
    .tb-notif-title { font-size: 0.77rem; font-weight: 600; color: #1A0020; line-height: 1.35; }
    .tb-notif-sub   { font-size: 0.69rem; color: #64748B; margin-top: 2px; }
    .tb-notif-empty {
      padding: 2.25rem 1rem; text-align: center; color: #94A3B8; font-size: 0.8rem;
    }
    .tb-notif-empty .material-symbols-outlined { font-size: 34px; display: block; margin: 0 auto 8px; }
    .tb-notif-footer {
      padding: 0.55rem 1rem; border-top: 1px solid #E2E8F0;
      text-align: center; flex-shrink: 0;
    }
    .tb-notif-footer a {
      font-size: 0.72rem; font-weight: 600; color: #6B0080; text-decoration: none;
    }
    .tb-notif-footer a:hover { text-decoration: underline; }

    /* ── Profile dropdown ── */
    #tbProfileDrop { width: 216px; padding: 0.4rem 0; }
    .tb-profile-head {
      padding: 0.6rem 1rem 0.55rem;
      border-bottom: 1px solid #E2E8F0; margin-bottom: 0.2rem;
    }
    .tb-profile-name {
      font-size: 0.82rem; font-weight: 700; color: #1A0020;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .tb-role-chip {
      display: inline-block; margin-top: 3px;
      font-size: 0.6rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em;
      background: #F0EAF5; color: #6B0080; padding: 2px 8px; border-radius: 100px;
    }
    .tb-drop-item {
      display: flex; align-items: center; gap: 8px;
      padding: 8px 1rem; font-size: 0.79rem; font-weight: 500;
      color: #334155; text-decoration: none;
      transition: background 0.12s; width: 100%; border: none; background: none;
      text-align: left; cursor: pointer;
    }
    .tb-drop-item .material-symbols-outlined { font-size: 17px; color: #64748B; flex-shrink: 0; }
    .tb-drop-item:hover { background: #F8FAFC; color: #1A0020; }
    .tb-drop-item.tb-danger { color: #EF4444; }
    .tb-drop-item.tb-danger .material-symbols-outlined { color: #EF4444; }
    .tb-drop-item.tb-danger:hover { background: #FEF2F2; }
    .tb-hr { border: none; border-top: 1px solid #E2E8F0; margin: 0.2rem 0; }
  `;
  document.head.appendChild(style);

  // ── HTML ────────────────────────────────────────────────────────────────
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div class="tb-panel tb-hidden" id="tbNotifPanel">
      <div class="tb-notif-header">
        <h4>
          <span class="material-symbols-outlined">notifications</span>
          Notifications
        </h4>
        <button class="tb-mark-read" id="tbMarkRead">Mark all read</button>
      </div>
      <div class="tb-notif-list" id="tbNotifList">
        <div class="tb-notif-empty">
          <span class="material-symbols-outlined">hourglass_empty</span>
          Loading…
        </div>
      </div>
      <div class="tb-notif-footer">
        <a href="${viewAllUrl}">View all →</a>
      </div>
    </div>

    <div class="tb-panel tb-hidden" id="tbProfileDrop">
      <div class="tb-profile-head">
        <div class="tb-profile-name">${fullName}</div>
        <span class="tb-role-chip">${roleLabel}</span>
      </div>
      <a class="tb-drop-item" href="${settingsUrl}">
        <span class="material-symbols-outlined">manage_accounts</span>Settings
      </a>
      <hr class="tb-hr">
      <a class="tb-drop-item tb-danger" href="${logoutUrl}">
        <span class="material-symbols-outlined">logout</span>Log out
      </a>
    </div>
  `;
  document.body.appendChild(wrap);

  const notifPanel  = document.getElementById('tbNotifPanel');
  const profileDrop = document.getElementById('tbProfileDrop');

  // ── Find bell button by notifications icon text ───────────────────────
  const bellBtn = Array.from(document.querySelectorAll('.icon-btn')).find(
    btn => btn.querySelector('.material-symbols-outlined')?.textContent?.trim() === 'notifications'
  );

  // ── Find avatar by known IDs ──────────────────────────────────────────
  const avatarEl = document.getElementById('topbarAvatar')
                || document.getElementById('studentAvatarTopbar')
                || document.getElementById('avatarInitial');

  // ── Positioning ───────────────────────────────────────────────────────
  function positionBelow(panel, trigger) {
    const r = trigger.getBoundingClientRect();
    panel.style.top   = (r.bottom + 6) + 'px';
    panel.style.right = Math.max(8, window.innerWidth - r.right) + 'px';
    panel.style.left  = 'auto';
  }

  // ── Toggle helpers ────────────────────────────────────────────────────
  function closeAll() {
    notifPanel.classList.add('tb-hidden');
    profileDrop.classList.add('tb-hidden');
  }

  let notifLoaded = false;

  if (bellBtn) {
    bellBtn.addEventListener('click', e => {
      e.stopPropagation();
      const wasOpen = !notifPanel.classList.contains('tb-hidden');
      closeAll();
      if (!wasOpen) {
        positionBelow(notifPanel, bellBtn);
        notifPanel.classList.remove('tb-hidden');
        if (!notifLoaded) loadNotifications();
      }
    });
  }

  if (avatarEl) {
    avatarEl.style.cursor = 'pointer';
    avatarEl.addEventListener('click', e => {
      e.stopPropagation();
      const wasOpen = !profileDrop.classList.contains('tb-hidden');
      closeAll();
      if (!wasOpen) {
        positionBelow(profileDrop, avatarEl);
        profileDrop.classList.remove('tb-hidden');
      }
    });
  }

  document.addEventListener('click', closeAll);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });

  document.getElementById('tbMarkRead').addEventListener('click', () => {
    document.querySelectorAll('#tbNotifList .tb-notif-item').forEach(el => el.classList.remove('tb-unread'));
    syncDot(0);
  });

  // ── Notif dot sync ────────────────────────────────────────────────────
  function syncDot(count) {
    document.querySelectorAll('.notif-dot').forEach(dot => {
      dot.style.display = count > 0 ? '' : 'none';
    });
  }

  // ── Dept label map ────────────────────────────────────────────────────
  const DEPT_NAMES = {
    bursary:'Bursary', hod:'Head of Department', cedgs:'CEDGS',
    chapel:'Chapel', library:'Library', student_affairs:'Student Affairs',
    sport:'Sports Unit', health:'Health Centre', lab:'Laboratory',
    college:'College Office', hall:'Hall Management', ict:'ICT Unit',
    esm:'ESM Unit', academic:'Academic Affairs (Registrar)',
  };

  const STATUS_STYLE = {
    approved:             { icon:'check_circle',    bg:'#D1FAE5', color:'#10B981', label:'Approved' },
    rejected:             { icon:'cancel',          bg:'#FEE2E2', color:'#EF4444', label:'Rejected' },
    flagged:              { icon:'flag',            bg:'#FFEDD5', color:'#F97316', label:'Flagged — Action Required' },
    pending_review:       { icon:'hourglass_empty', bg:'#FEF3C7', color:'#F59E0B', label:'Pending Review' },
    pending_submission:   { icon:'upload_file',     bg:'#FEF3C7', color:'#F59E0B', label:'Upload Required' },
    awaiting_verification:{ icon:'manage_search',   bg:'#FEF3C7', color:'#F59E0B', label:'Awaiting Verification' },
  };

  // ── Notification fetch ────────────────────────────────────────────────
  async function loadNotifications() {
    notifLoaded = true;
    const listEl = document.getElementById('tbNotifList');
    let items = [];

    try {
      if (role === 'student') {
        const { data: req } = await supabase
          .from('clearance_requests').select('id')
          .eq('student_id', session.user.id)
          .order('submitted_at', { ascending: false })
          .limit(1).maybeSingle();

        if (req) {
          const { data } = await supabase
            .from('clearance_items').select('department_id, status')
            .eq('request_id', req.id)
            .in('status', ['approved', 'flagged', 'rejected']);

          items = (data || []).map(d => {
            const s = STATUS_STYLE[d.status] || {};
            return {
              title:  DEPT_NAMES[d.department_id] || d.department_id,
              sub:    s.label || d.status,
              icon:   s.icon  || 'circle',
              bg:     s.bg    || '#F1F5F9',
              color:  s.color || '#64748B',
              unread: d.status === 'flagged' || d.status === 'rejected',
            };
          });
        }

      } else if (role === 'officer') {
        const { data } = await supabase
          .from('clearance_items')
          .select('id, status, clearance_requests(profiles(first_name, last_name, programme))')
          .eq('department_id', profile.department)
          .in('status', ['pending_review', 'awaiting_verification'])
          .limit(8);

        items = (data || []).map(d => {
          const p    = d.clearance_requests?.profiles;
          const name = p ? [p.first_name, p.last_name].filter(Boolean).join(' ') : 'A student';
          const prog = p?.programme || '';
          return {
            title:  name,
            sub:    prog ? `${prog} · Awaiting your review` : 'Awaiting your review',
            icon:   'person',
            bg:     '#EDE9FE',
            color:  '#7C3AED',
            unread: true,
          };
        });

      } else {
        // admin / super_admin
        const { data } = await supabase
          .from('clearance_items')
          .select('department_id, status, clearance_requests(profiles(first_name, last_name))')
          .in('status', ['flagged', 'rejected'])
          .limit(10);

        items = (data || []).map(d => {
          const p    = d.clearance_requests?.profiles;
          const name = p ? [p.first_name, p.last_name].filter(Boolean).join(' ') : 'Student';
          const s    = STATUS_STYLE[d.status] || {};
          return {
            title:  name,
            sub:    `${DEPT_NAMES[d.department_id] || d.department_id} — ${s.label || d.status}`,
            icon:   s.icon  || 'flag',
            bg:     s.bg    || '#FFEDD5',
            color:  s.color || '#F97316',
            unread: true,
          };
        });
      }
    } catch (_) { /* network or RLS error — fall through to empty */ }

    const unread = items.filter(i => i.unread).length;
    syncDot(unread);

    if (items.length === 0) {
      listEl.innerHTML = `
        <div class="tb-notif-empty">
          <span class="material-symbols-outlined">notifications_none</span>
          No new notifications
        </div>`;
      return;
    }

    listEl.innerHTML = items.map(item => `
      <div class="tb-notif-item ${item.unread ? 'tb-unread' : ''}">
        <div class="tb-notif-icon" style="background:${item.bg};">
          <span class="material-symbols-outlined" style="color:${item.color};">${item.icon}</span>
        </div>
        <div class="tb-notif-body">
          <div class="tb-notif-title">${item.title}</div>
          <div class="tb-notif-sub">${item.sub}</div>
        </div>
      </div>`).join('');
  }
})();
