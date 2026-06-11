const USER_ID_KEY = 'letter-library-user-id';

export function getUserId(): string {
  let id = localStorage.getItem(USER_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(USER_ID_KEY, id);
  }
  return id;
}

export function getAuthHeaders(): Record<string, string> {
  return { 'X-User-Id': getUserId() };
}
