import { getAdminHeaders } from '../hooks/useAdmin';
import {
  canUseAdminApi,
  canUseStaticAdminLogin,
  verifyStaticAdminPassword,
} from '../utils/staticAdmin';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8081';

function assertAdminApiAvailable(): void {
  if (!canUseAdminApi()) {
    throw new Error('ADMIN_API_UNAVAILABLE');
  }
}

export async function verifyAdminPassword(password: string): Promise<void> {
  if (canUseAdminApi()) {
    const response = await fetch(`${API_BASE}/letters/admin/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (response.status === 401) {
      throw new Error('Invalid admin password');
    }
    if (!response.ok) {
      throw new Error('Admin verification failed');
    }
    return;
  }

  if (canUseStaticAdminLogin()) {
    verifyStaticAdminPassword(password);
    return;
  }

  throw new Error('Admin login is not configured for this deployment');
}

export async function deleteAllLetters(): Promise<number> {
  assertAdminApiAvailable();
  const response = await fetch(`${API_BASE}/letters/admin/all`, {
    method: 'DELETE',
    headers: getAdminHeaders(),
  });

  if (response.status === 401) {
    throw new Error('Admin authentication required');
  }
  if (!response.ok) {
    throw new Error('Failed to delete all letters');
  }

  const data: { deleted: number } = await response.json();
  return data.deleted;
}

export async function changeAdminPassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  assertAdminApiAvailable();
  const response = await fetch(`${API_BASE}/letters/admin/change-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAdminHeaders() },
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
    }),
  });

  if (response.status === 401) {
    throw new Error('Admin authentication required');
  }
  if (response.status === 400) {
    const data = await response.json().catch(() => ({}));
    const detail = typeof data.detail === 'string' ? data.detail : 'Invalid password change request';
    throw new Error(detail);
  }
  if (!response.ok) {
    throw new Error('Failed to change admin password');
  }
}

export async function deleteAllUserLetters(): Promise<number> {
  assertAdminApiAvailable();
  const response = await fetch(`${API_BASE}/letters/admin/users`, {
    method: 'DELETE',
    headers: getAdminHeaders(),
  });

  if (response.status === 401) {
    throw new Error('Admin authentication required');
  }
  if (!response.ok) {
    throw new Error('Failed to delete user-generated letters');
  }

  const data: { deleted: number } = await response.json();
  return data.deleted;
}
