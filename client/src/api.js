async function validateResponse(res) {
  if (res.status === 204) return;
  let body = null;
  try {
    body = await res.json();
  } catch {
    // no body (e.g. a network-level failure surfaced as non-JSON)
  }
  if (!res.ok) {
    throw new Error((body && body.error) || `request failed (${res.status})`);
  }
  return body;
}

async function fetchJSON(method, url, body) {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }
  const res = await fetch(url, { method, headers, body, credentials: 'include' });
  return validateResponse(res);
}

function register(username, password) {
  return fetchJSON('POST', '/api/auth/register', { username, password });
}

function login(username, password) {
  return fetchJSON('POST', '/api/auth/login', { username, password });
}

function logout() {
  return fetchJSON('POST', '/api/auth/logout');
}

function me() {
  return fetchJSON('GET', '/api/auth/me');
}

function getUser(username) {
  return fetchJSON('GET', '/api/users/' + username);
}

function getGames() {
  return fetchJSON('GET', '/api/games');
}

function getGame(id) {
  return fetchJSON('GET', '/api/games/' + id);
}

function getLeaderboard() {
  return fetchJSON('GET', '/api/leaderboard');
}

function getUserHistory(username) {
  return fetchJSON('GET', '/api/games/history/' + username);
}

function joinQueue({ timeControl, ranked }) {
  return fetchJSON('POST', '/api/queue/join', { timeControl, ranked });
}

function queueStatus(queueEntryId) {
  return fetchJSON('GET', '/api/queue/status?queueEntryId=' + encodeURIComponent(queueEntryId));
}

function leaveQueue(queueEntryId) {
  return fetchJSON('DELETE', '/api/queue/leave', { queueEntryId });
}

function submitMove(gameId, { from, to, promotion }) {
  return fetchJSON('POST', `/api/games/${gameId}/moves`, { from, to, promotion });
}

const api = {
  register,
  login,
  logout,
  me,
  getUser,
  getGames,
  getGame,
  getLeaderboard,
  getUserHistory,
  joinQueue,
  queueStatus,
  leaveQueue,
  submitMove,
};

export default api;
