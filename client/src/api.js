async function validateResponse(res) {
  if (res.status === 200 || res.status === 201) {
    return res.json();
  }
  if (res.status === 204) {
    return;
  }
  throw res.status;
}

async function fetchJSON(method, url, body) {
  const headers = { Accept: 'application/json' };
  if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }
  const res = await fetch(url, { method, headers, body });
  return validateResponse(res);
}

function getUser(username) {
  return fetchJSON('GET', '/home/login/' + username);
}

function addUser(user) {
  return fetchJSON('POST', '/home/login/register', user);
}

function getGames() {
  return fetchJSON('GET', '/home/game/all');
}

function getGame(id) {
  return fetchJSON('GET', '/home/game/' + id);
}

function addGame(game) {
  return fetchJSON('POST', '/home/game', game);
}

function deleteGame(id) {
  return fetchJSON('DELETE', '/home/game/' + id);
}

function patchBoard(id, board, wtime, btime) {
  return fetchJSON('PATCH', '/home/game/' + id, { board, wtime, btime });
}

function insertBlack(id, black) {
  return fetchJSON('PATCH', '/home/game/' + id + '/b', black);
}

function patchAfterGame(username, win, elo, lasts) {
  return fetchJSON('PATCH', '/home/game', { username, win, elo, lasts });
}

const api = {
  getUser,
  addUser,
  getGames,
  getGame,
  addGame,
  deleteGame,
  patchBoard,
  insertBlack,
  patchAfterGame,
};

export default api;
