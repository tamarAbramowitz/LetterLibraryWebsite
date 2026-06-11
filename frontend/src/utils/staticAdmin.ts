const USE_STATIC_DATA = import.meta.env.VITE_USE_STATIC_DATA === 'true';
const STATIC_ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD as string | undefined;
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8081';

export function hasRemoteApi(): boolean {
  return (
    API_BASE.length > 0 &&
    !API_BASE.includes('localhost') &&
    !API_BASE.includes('127.0.0.1')
  );
}

/** Admin API (delete, change password) needs a deployed backend. */
export function canUseAdminApi(): boolean {
  return !USE_STATIC_DATA || hasRemoteApi();
}

/** GitHub Pages: login via build-time password when no backend is available. */
export function canUseStaticAdminLogin(): boolean {
  return Boolean(STATIC_ADMIN_PASSWORD?.length);
}

export function verifyStaticAdminPassword(password: string): void {
  if (!STATIC_ADMIN_PASSWORD) {
    throw new Error('Static admin password is not configured');
  }
  if (password !== STATIC_ADMIN_PASSWORD) {
    throw new Error('Invalid admin password');
  }
}
