/** Returns a stable session ID for anonymous tracking (views/likes) */
export function getSessionId(): string {
  const key = "app_session_id";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}
