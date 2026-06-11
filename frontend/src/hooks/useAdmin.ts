import { useCallback, useState } from 'react';

const ADMIN_SESSION_KEY = 'letter-library-admin';
const ADMIN_PASSWORD_KEY = 'letter-library-admin-password';

function loadIsAdmin(): boolean {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
}

export function getAdminPassword(): string | null {
  return sessionStorage.getItem(ADMIN_PASSWORD_KEY);
}

export function getAdminHeaders(): Record<string, string> {
  const password = getAdminPassword();
  return password ? { 'X-Admin-Password': password } : {};
}

export function updateStoredAdminPassword(password: string): void {
  sessionStorage.setItem(ADMIN_PASSWORD_KEY, password);
}

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(loadIsAdmin);

  const login = useCallback(() => {
    sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
    setIsAdmin(true);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    sessionStorage.removeItem(ADMIN_PASSWORD_KEY);
    setIsAdmin(false);
  }, []);

  return { isAdmin, login, logout };
}
