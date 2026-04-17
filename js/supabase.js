import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL  = 'https://nywyjkfgmfgutgudnbur.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55d3lqa2ZnbWZndXRndWRuYnVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NDA2OTUsImV4cCI6MjA5MjAxNjY5NX0.W-jYGkrBD3XhrzhyTGNsN0RTBzXZfEGZHIUYE_hzY1s';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

// ── Auth helpers ──────────────────────────────────────────────────────────────

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

/** Redirect to login if no active session, or if role doesn't match. */
export async function requireAuth(expectedRole, loginPath = '/login.html') {
  const session = await getSession();
  if (!session) { window.location.href = loginPath; return null; }

  const profile = await getProfile(session.user.id);
  if (expectedRole && profile.role !== expectedRole) {
    window.location.href = loginPath;
    return null;
  }
  return { session, profile };
}

export async function signOut(loginPath = '../login.html') {
  await supabase.auth.signOut();
  window.location.href = loginPath;
}

// ── Audit log helper ──────────────────────────────────────────────────────────

export async function writeAuditLog({ actorId, action, targetId = null, meta = {} }) {
  await supabase.from('audit_logs').insert({
    actor_id:  actorId,
    action,
    target_id: targetId,
    meta,
  });
}
