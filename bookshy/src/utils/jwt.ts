export function getUserIdFromToken(): number | null {
  const token = localStorage.getItem('auth_token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId || payload.sub || payload.id || null;
  } catch (e) {
    console.error('❌ JWT 파싱 실패:', e);
    return null;
  }
}
