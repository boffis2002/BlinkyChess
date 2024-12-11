api = function () {

    function validateResponse(res) {
        if (res.status == 200 || res.status == 201) {
            return res.json();
        } if (res.status == 204) {
            return;
        } else {
            throw res.status;
        }
    }

    async function fetchJSON(method, url, body, headers) {

        function addHeaders(headers) {
            let newHeaders = { ...headers };
            newHeaders['Accept'] = 'application/json';
            if (method == 'POST' || method == 'PUT' || method == 'PATCH')
                newHeaders['Content-Type'] = 'application/json';
            return newHeaders;
        }

        if (method === 'POST' || method == 'PUT' || method == 'PATCH') {
            body = JSON.stringify(body);
        }

        const res = await fetch(url, { method, headers: addHeaders(headers), body });
        return validateResponse(res);

    }

    async function fetchFORM(method, url, body, headers) {

        function addHeaders(headers) {
            let newHeaders = { ...headers };
            newHeaders['Accept'] = 'application/json';
            return newHeaders;
        }
        const res = await fetch(url, { method, headers: addHeaders(headers), body });
        return validateResponse(res);

    }

    function getHome() {
        return fetchJSON('GET', '/home');
    }

    function getUser(username) {
        return fetchJSON('GET', '/home/login/' + username);
    }

    function addUser(user) {
        return fetchJSON('POST', '/home/login/register',  user);
    }

    function getGames() {
        return fetchJSON('GET', '/home/game/all');
    }

    function getGame(id) {
        return fetchJSON('GET', '/home/game/' + id);
    }

    function addGame(game) {
        return fetchJSON('POST', '/home/game',  game);
    }
    function deleteGame(id) {
        return fetchJSON('DELETE', '/home/game/'+id);
    }
    function patchBoard(id,board,wtime,btime) {
        return fetchJSON('PATCH', '/home/game/'+id, {board:board,wtime:wtime,btime:btime});
    }
    function insertBlack(id,black) {
        return fetchJSON('PATCH', '/home/game/'+id+'/b', black);
    }
    function patchAfterGame(username,win,elo,lasts) {
        return fetchJSON('PATCH', '/home/game', {username:username, win:win, elo:elo, lasts:lasts});
    }
    

    return {
        getHome,
        getUser,
        addUser,
        getGames,
        getGame,
        addGame,
        deleteGame,
        patchBoard,
        insertBlack,
        patchAfterGame
    }

}();