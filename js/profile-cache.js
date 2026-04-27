// Caches the student profile in localStorage for 10 minutes.
// Eliminates the profile DB fetch on every page navigation.

const KEY = 'cms_profile_v1';
const TTL = 10 * 60 * 1000;

export function getCachedProfile() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const { profile, ts } = JSON.parse(raw);
    if (Date.now() - ts > TTL) { localStorage.removeItem(KEY); return null; }
    return profile;
  } catch { return null; }
}

export function setCachedProfile(profile) {
  try { localStorage.setItem(KEY, JSON.stringify({ profile, ts: Date.now() })); } catch {}
}

export function clearProfileCache() {
  localStorage.removeItem(KEY);
}
