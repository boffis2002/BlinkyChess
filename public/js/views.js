//EJS Compiled Views - This file was automatically generated on Wed Dec 11 2024 16:54:04 GMT+0100 (Central European Standard Time)
 ejs.views_include = function(locals) {
     
     return function(path, d) {
         console.log("ejs.views_include",path,d);
         return ejs["views_"+path.replace(/\//g,"_").replace(/-/g,"_")]({...d,...locals}, null, ejs.views_include(locals));
     }
 };
 ejs.views_game = function(locals, escapeFn, include = ejs.views_include(locals), rethrow
) {
rethrow = rethrow || function rethrow(err, str, flnm, lineno, esc) {
  var lines = str.split('\n');
  var start = Math.max(lineno - 3, 0);
  var end = Math.min(lines.length, lineno + 3);
  var filename = esc(flnm);
  // Error context
  var context = lines.slice(start, end).map(function (line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;

  throw err;
};
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
var __line = 1
  , __lines = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <link rel=\"stylesheet\" href=\"../../../css/general.css\">\n    <link rel=\"stylesheet\" href=\"../../../css/game.css\">\n    \n    <title>Match</title>\n</head>\n<body>\n    <header id=\"header-index\">\n        <div id=\"header-right\">\n            <a class=\"logo\" href=\"#\"><img src=\"../../../images/logo.png\" alt=\"\"></a>\n        </div>\n    </header>\n    <main class=\"main-index\">\n        <div class=\"popup\">\n            <div id=\"popup-message\"></div>\n            <button class=\"home-button\">Home</button>\n        </div>\n        <div class=\"popup2\">\n            <div id=\"popup-message2\">\n                <label for=\"promotion\">Choose what the pawn becomes: </label>\n                <select id=\"promotion\">\n                    <option value=\"s\">Select a piece</option>\n                    <option value=\"Q\">Queen</option>\n                    <option value=\"R\">Rook</option>\n                    <option value=\"B\">Bishop</option>\n                    <option value=\"N\">Knight</option>\n                </select>\n            </div>\n            \n        </div>\n        <div>\n            <% if (color != 'white') { Username.reverse();Time.reverse() } %>\n            <div class=\"player-info\">\n                <div class=\"username\"><%= Username[0].username %></div>\n                <br>    \n                <div>ELO: <%= Username[0].elo %></div>\n                <%  var won=parseInt(Username[0].won);\n                    var lost=parseInt(Username[0].lost);\n                    var wr;\n                    lost==0 ? wr=\"100%\": wr=((won/(won+lost)).toString()); \n                %>\n                <div>WR: <%= wr!=\"100%\"?(wr*100).toFixed(2):\"100\" %>%</div>\n                <div class=\"timeHis\">Time left: <%=Math.floor(Time[0]/60).toString()+\":\"+String(Time[0]%60).padStart(2, '0');%></div>\n            </div>\n            \n            <div class=\"chessboard\">\n                <% let i = 0, row = 0; %>\n                <% if (color != 'white') { Board = Board.split(\" \")[0].split(\"\").reverse().join(\"\") } %>\n                <% if (color == 'white') { Board = Board.split(\" \")[0] } %>\n                <% while (Board[i] != undefined) { %>\n                    <div class=\"row\">\n                        <% let j = 0; %>\n                        <% while (Board[i] != \"/\") { %>\n                            <% let piece = Board[i]; %>\n                            <% if (piece == undefined) break; %>\n                            <% if (!isNaN(piece)) { \n                                for (let s = 0; s < Board[i]; s++) { %>\n                                    <% let cellColorClass = (row + j) % 2 === 0 ? 'whitecell' : 'browncell'; %>\n                                    <div class=\"<%= cellColorClass %>\">\n                                        <img id=\"<%= color != 'white' ? row.toString() + ((7 - j).toString()) : ((7 - row).toString()) + (j.toString()) %>\">\n                                    </div>\n                                <% j++; } j--; %>\n                            <% } else { %>\n                                <% let cellColorClass = (row + j) % 2 === 0 ? 'whitecell' : 'browncell'; %>\n                                <div class=\"<%= cellColorClass %>\">\n                                    <img class=\"pedina\" alt=\"nothing\" id=\"<%= color != 'white' ? row.toString() + ((7 - j).toString()) : ((7 - row).toString()) + j.toString() %>\" src=\"<%= '../../../images/' + (piece === piece.toUpperCase() ? 'whites/' : 'blacks/') + piece.toLowerCase() + '.png' %>\">\n                                </div>\n                            <% } %>\n                        <% i++; j++; } %>\n                        <% if (Board[i] == undefined) break; %>\n                    </div>\n                <% row++; i++; } %>\n                \n            </div>\n            \n        </div>\n        <div class=\"player-info\">\n            <div class=\"username\"><%= Username[1].username %></div>\n            <br>    \n            <div>ELO: <%= Username[1].elo %></div>\n            <%  var won=parseInt(Username[1].won);\n                var lost=parseInt(Username[1].lost);\n                var wr;\n                lost==0 ? wr=\"100%\": wr=((won/(won+lost)).toString()); \n            %>\n            <div>WR: <%= wr!=\"100%\"?(wr*100).toFixed(2):\"100\" %>%</div>\n            <div class=\"timeMine\">Time left: <%=Math.floor(Time[1]/60).toString()+\":\"+String(Time[1]%60).padStart(2, '0');%></div>\n        </div>\n        \n    </main>\n    <footer>\n        <p>Made By Sergio Boffi ©</p>\n        <p>For any need, contact me at → boffis@usi.ch</p>\n    </footer>\n    <script src=\"../../../js/api.js\"></script>\n    <script src=\"../../../js/routes.js\"></script>\n    <script src=\"../../../js/ejs.min.js\"></script>\n    <script src=\"../../../js/views.js\"></script>\n    <script type=\"module\" src=\"../../../js/game.js\"></script>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.js\"></script>\n    <script src=\"/socket.io/socket.io.js\"></script>\n\n\n</body>\n</html>"
  , __filename = undefined;
try {
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  with (locals || {}) {
    ; __append("<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <link rel=\"stylesheet\" href=\"../../../css/general.css\">\n    <link rel=\"stylesheet\" href=\"../../../css/game.css\">\n    \n    <title>Match</title>\n</head>\n<body>\n    <header id=\"header-index\">\n        <div id=\"header-right\">\n            <a class=\"logo\" href=\"#\"><img src=\"../../../images/logo.png\" alt=\"\"></a>\n        </div>\n    </header>\n    <main class=\"main-index\">\n        <div class=\"popup\">\n            <div id=\"popup-message\"></div>\n            <button class=\"home-button\">Home</button>\n        </div>\n        <div class=\"popup2\">\n            <div id=\"popup-message2\">\n                <label for=\"promotion\">Choose what the pawn becomes: </label>\n                <select id=\"promotion\">\n                    <option value=\"s\">Select a piece</option>\n                    <option value=\"Q\">Queen</option>\n                    <option value=\"R\">Rook</option>\n                    <option value=\"B\">Bishop</option>\n                    <option value=\"N\">Knight</option>\n                </select>\n            </div>\n            \n        </div>\n        <div>\n            ")
    ; __line = 36
    ;  if (color != 'white') { Username.reverse();Time.reverse() } 
    ; __append("\n            <div class=\"player-info\">\n                <div class=\"username\">")
    ; __line = 38
    ; __append(escapeFn( Username[0].username ))
    ; __append("</div>\n                <br>    \n                <div>ELO: ")
    ; __line = 40
    ; __append(escapeFn( Username[0].elo ))
    ; __append("</div>\n                ")
    ; __line = 41
    ;   var won=parseInt(Username[0].won);
                    var lost=parseInt(Username[0].lost);
                    var wr;
                    lost==0 ? wr="100%": wr=((won/(won+lost)).toString()); 
                
    ; __line = 45
    ; __append("\n                <div>WR: ")
    ; __line = 46
    ; __append(escapeFn( wr!="100%"?(wr*100).toFixed(2):"100" ))
    ; __append("%</div>\n                <div class=\"timeHis\">Time left: ")
    ; __line = 47
    ; __append(escapeFn(Math.floor(Time[0]/60).toString()+":"+String(Time[0]%60).padStart(2, '0')))
    ; __append("</div>\n            </div>\n            \n            <div class=\"chessboard\">\n                ")
    ; __line = 51
    ;  let i = 0, row = 0; 
    ; __append("\n                ")
    ; __line = 52
    ;  if (color != 'white') { Board = Board.split(" ")[0].split("").reverse().join("") } 
    ; __append("\n                ")
    ; __line = 53
    ;  if (color == 'white') { Board = Board.split(" ")[0] } 
    ; __append("\n                ")
    ; __line = 54
    ;  while (Board[i] != undefined) { 
    ; __append("\n                    <div class=\"row\">\n                        ")
    ; __line = 56
    ;  let j = 0; 
    ; __append("\n                        ")
    ; __line = 57
    ;  while (Board[i] != "/") { 
    ; __append("\n                            ")
    ; __line = 58
    ;  let piece = Board[i]; 
    ; __append("\n                            ")
    ; __line = 59
    ;  if (piece == undefined) break; 
    ; __append("\n                            ")
    ; __line = 60
    ;  if (!isNaN(piece)) { 
                                for (let s = 0; s < Board[i]; s++) { 
    ; __line = 61
    ; __append("\n                                    ")
    ; __line = 62
    ;  let cellColorClass = (row + j) % 2 === 0 ? 'whitecell' : 'browncell'; 
    ; __append("\n                                    <div class=\"")
    ; __line = 63
    ; __append(escapeFn( cellColorClass ))
    ; __append("\">\n                                        <img id=\"")
    ; __line = 64
    ; __append(escapeFn( color != 'white' ? row.toString() + ((7 - j).toString()) : ((7 - row).toString()) + (j.toString()) ))
    ; __append("\">\n                                    </div>\n                                ")
    ; __line = 66
    ;  j++; } j--; 
    ; __append("\n                            ")
    ; __line = 67
    ;  } else { 
    ; __append("\n                                ")
    ; __line = 68
    ;  let cellColorClass = (row + j) % 2 === 0 ? 'whitecell' : 'browncell'; 
    ; __append("\n                                <div class=\"")
    ; __line = 69
    ; __append(escapeFn( cellColorClass ))
    ; __append("\">\n                                    <img class=\"pedina\" alt=\"nothing\" id=\"")
    ; __line = 70
    ; __append(escapeFn( color != 'white' ? row.toString() + ((7 - j).toString()) : ((7 - row).toString()) + j.toString() ))
    ; __append("\" src=\"")
    ; __append(escapeFn( '../../../images/' + (piece === piece.toUpperCase() ? 'whites/' : 'blacks/') + piece.toLowerCase() + '.png' ))
    ; __append("\">\n                                </div>\n                            ")
    ; __line = 72
    ;  } 
    ; __append("\n                        ")
    ; __line = 73
    ;  i++; j++; } 
    ; __append("\n                        ")
    ; __line = 74
    ;  if (Board[i] == undefined) break; 
    ; __append("\n                    </div>\n                ")
    ; __line = 76
    ;  row++; i++; } 
    ; __append("\n                \n            </div>\n            \n        </div>\n        <div class=\"player-info\">\n            <div class=\"username\">")
    ; __line = 82
    ; __append(escapeFn( Username[1].username ))
    ; __append("</div>\n            <br>    \n            <div>ELO: ")
    ; __line = 84
    ; __append(escapeFn( Username[1].elo ))
    ; __append("</div>\n            ")
    ; __line = 85
    ;   var won=parseInt(Username[1].won);
                var lost=parseInt(Username[1].lost);
                var wr;
                lost==0 ? wr="100%": wr=((won/(won+lost)).toString()); 
            
    ; __line = 89
    ; __append("\n            <div>WR: ")
    ; __line = 90
    ; __append(escapeFn( wr!="100%"?(wr*100).toFixed(2):"100" ))
    ; __append("%</div>\n            <div class=\"timeMine\">Time left: ")
    ; __line = 91
    ; __append(escapeFn(Math.floor(Time[1]/60).toString()+":"+String(Time[1]%60).padStart(2, '0')))
    ; __append("</div>\n        </div>\n        \n    </main>\n    <footer>\n        <p>Made By Sergio Boffi ©</p>\n        <p>For any need, contact me at → boffis@usi.ch</p>\n    </footer>\n    <script src=\"../../../js/api.js\"></script>\n    <script src=\"../../../js/routes.js\"></script>\n    <script src=\"../../../js/ejs.min.js\"></script>\n    <script src=\"../../../js/views.js\"></script>\n    <script type=\"module\" src=\"../../../js/game.js\"></script>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.js\"></script>\n    <script src=\"/socket.io/socket.io.js\"></script>\n\n\n</body>\n</html>")
    ; __line = 109
  }
  return __output;
} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}

}
ejs.views_home = function(locals, escapeFn, include = ejs.views_include(locals), rethrow
) {
rethrow = rethrow || function rethrow(err, str, flnm, lineno, esc) {
  var lines = str.split('\n');
  var start = Math.max(lineno - 3, 0);
  var end = Math.min(lines.length, lineno + 3);
  var filename = esc(flnm);
  // Error context
  var context = lines.slice(start, end).map(function (line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;

  throw err;
};
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
var __line = 1
  , __lines = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <link rel=\"stylesheet\" href=\"../css/general.css\">\n    <title>Home</title>\n</head>\n<body onload=\"checkStorage()\">\n    <header id=\"header-index\">\n        <h1 class=\"titolo\">BlinkyChess</h1>\n        <div id=\"header-right\">\n            <a class=\"icon\" href=\"/home\"><img src=\"../images/casabianca.png\" alt=\"\"></a>\n            <div class=\"dropdown\">\n                <a class=\"icon\"><img src=\"../images/account.png\" ></a>\n                <div class=\"dropdown-content\">\n                    <a id=\"profile-link\">Profile</a>\n                    <a href=\"/home/login\">Logout</a>\n                </div>\n            </div>\n        </div>\n\n    </header>\n    <main class=\"main-index\">\n        <button class=\"button-container\" onclick=\"renderGamePref()\"><b>Look for a game</b></button>\n        <div class=\"table-container\">\n            <table>\n                <tr>\n                    <th>Spectate </th>\n                    <th>Black</th>\n                    <th>White</th>\n                </tr>\n                <% for (let i = 0; i < Games.length; i++) { %>\n                    <tr>\n                        <%if(Games[i]){%>\n                        <td><a href= \"<%= 'home/game/'+Games[i]._id+'/w' %>\" ><button id=\"spectate\">Spectate</button></a></td>\n                        <td><%= Games[i].black %></td>\n                        <td><%= Games[i].white %></td>\n                        <%}else{%>\n                        <td></td>\n                        <td></td>\n                        <td></td>\n                        <%}%>\n                    </tr>\n                <% } %>\n            </table>\n        </div>\n        <div class=\"choose-match\">\n            <div class=\"divTitle\">\n                <div></div>\n                <h1>Match Options</h1>\n                <button  onclick=\"closePopUp()\"><img src=\"../images/close.png\"></button>\n            </div>\n            \n            <div id=\"match-row1\">\n                <button class=\"btnChooseactive\">5 Minutes</button>\n                <button class=\"btnChoose\">10 Minutes</button>\n                <button class=\"btnChoose\">30 Minutes</button>\n            </div>\n            <div id=\"match-row2\">\n                <button class=\"btnChooseactive\">Ranked</button>\n                <button class=\"btnChoose\">Unranked</button>\n\n            </div>\n            <button  id=\"match-row3\"class=\"btnChoose\"><b>PLAY</b></button>\n    \n        </div>\n    </main>\n    <footer>\n        <p>Made By Sergio Boffi ©</p>\n        <p>For any need, contact me at → boffis@usi.ch</p>\n    </footer>\n    <script src=\"js/api.js\"></script>\n    <script src=\"js/login.js\"></script>\n    <script src=\"js/routes.js\"></script>\n    <script src=\"js/ejs.min.js\"></script>\n    <script src=\"js/views.js\"></script>\n    <script src=\"js/lookingFor.js\"></script>\n\n</body>\n</html>"
  , __filename = undefined;
try {
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  with (locals || {}) {
    ; __append("<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <link rel=\"stylesheet\" href=\"../css/general.css\">\n    <title>Home</title>\n</head>\n<body onload=\"checkStorage()\">\n    <header id=\"header-index\">\n        <h1 class=\"titolo\">BlinkyChess</h1>\n        <div id=\"header-right\">\n            <a class=\"icon\" href=\"/home\"><img src=\"../images/casabianca.png\" alt=\"\"></a>\n            <div class=\"dropdown\">\n                <a class=\"icon\"><img src=\"../images/account.png\" ></a>\n                <div class=\"dropdown-content\">\n                    <a id=\"profile-link\">Profile</a>\n                    <a href=\"/home/login\">Logout</a>\n                </div>\n            </div>\n        </div>\n\n    </header>\n    <main class=\"main-index\">\n        <button class=\"button-container\" onclick=\"renderGamePref()\"><b>Look for a game</b></button>\n        <div class=\"table-container\">\n            <table>\n                <tr>\n                    <th>Spectate </th>\n                    <th>Black</th>\n                    <th>White</th>\n                </tr>\n                ")
    ; __line = 33
    ;  for (let i = 0; i < Games.length; i++) { 
    ; __append("\n                    <tr>\n                        ")
    ; __line = 35
    ; if(Games[i]){
    ; __append("\n                        <td><a href= \"")
    ; __line = 36
    ; __append(escapeFn( 'home/game/'+Games[i]._id+'/w' ))
    ; __append("\" ><button id=\"spectate\">Spectate</button></a></td>\n                        <td>")
    ; __line = 37
    ; __append(escapeFn( Games[i].black ))
    ; __append("</td>\n                        <td>")
    ; __line = 38
    ; __append(escapeFn( Games[i].white ))
    ; __append("</td>\n                        ")
    ; __line = 39
    ; }else{
    ; __append("\n                        <td></td>\n                        <td></td>\n                        <td></td>\n                        ")
    ; __line = 43
    ; }
    ; __append("\n                    </tr>\n                ")
    ; __line = 45
    ;  } 
    ; __append("\n            </table>\n        </div>\n        <div class=\"choose-match\">\n            <div class=\"divTitle\">\n                <div></div>\n                <h1>Match Options</h1>\n                <button  onclick=\"closePopUp()\"><img src=\"../images/close.png\"></button>\n            </div>\n            \n            <div id=\"match-row1\">\n                <button class=\"btnChooseactive\">5 Minutes</button>\n                <button class=\"btnChoose\">10 Minutes</button>\n                <button class=\"btnChoose\">30 Minutes</button>\n            </div>\n            <div id=\"match-row2\">\n                <button class=\"btnChooseactive\">Ranked</button>\n                <button class=\"btnChoose\">Unranked</button>\n\n            </div>\n            <button  id=\"match-row3\"class=\"btnChoose\"><b>PLAY</b></button>\n    \n        </div>\n    </main>\n    <footer>\n        <p>Made By Sergio Boffi ©</p>\n        <p>For any need, contact me at → boffis@usi.ch</p>\n    </footer>\n    <script src=\"js/api.js\"></script>\n    <script src=\"js/login.js\"></script>\n    <script src=\"js/routes.js\"></script>\n    <script src=\"js/ejs.min.js\"></script>\n    <script src=\"js/views.js\"></script>\n    <script src=\"js/lookingFor.js\"></script>\n\n</body>\n</html>")
    ; __line = 81
  }
  return __output;
} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}

}
ejs.views_login = function(locals, escapeFn, include = ejs.views_include(locals), rethrow
) {
rethrow = rethrow || function rethrow(err, str, flnm, lineno, esc) {
  var lines = str.split('\n');
  var start = Math.max(lineno - 3, 0);
  var end = Math.min(lines.length, lineno + 3);
  var filename = esc(flnm);
  // Error context
  var context = lines.slice(start, end).map(function (line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;

  throw err;
};
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
var __line = 1
  , __lines = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <link rel=\"stylesheet\" href=\"../css/general.css\">\n    <link rel=\"stylesheet\" href=\"../css/login.css\">\n\n    <title>Login</title>\n</head>\n<body onload=\"sessionStorage.clear()\">\n    <main class=\"main-account\">\n        <div class=\"div-login\">\n                <h1>Login</h1>\n                <div class=\"inputbox\">\n                    <input id=\"username\" class=\"user-log\"  placeholder=\"Username\" required>\n                </div>\n                <div class=\"inputbox\">\n                    <input id=\"password\" class=\"psw-log\"  type=\"password\" placeholder=\"Password\" required>\n                </div>\n                <button type=\"submit\" class=\"login-submit\" onclick=\"tryLogin()\">Login</button>\n                <div class=\"register-link1\">\n                    <p>Don't you have an account yet? <a href=\"login/register\">Register</a></p>\n                    \n                </div>\n        </div>\n    </main>\n    <script src=\"../js/api.js\"></script>\n    <script src=\"../js/login.js\"></script>\n    <script src=\"../js/routes.js\"></script>\n    <script src=\"../js/ejs.min.js\"></script>\n    <script src=\"../js/views.js\"></script>\n\n</body>\n</html>"
  , __filename = undefined;
try {
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  with (locals || {}) {
    ; __append("<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <link rel=\"stylesheet\" href=\"../css/general.css\">\n    <link rel=\"stylesheet\" href=\"../css/login.css\">\n\n    <title>Login</title>\n</head>\n<body onload=\"sessionStorage.clear()\">\n    <main class=\"main-account\">\n        <div class=\"div-login\">\n                <h1>Login</h1>\n                <div class=\"inputbox\">\n                    <input id=\"username\" class=\"user-log\"  placeholder=\"Username\" required>\n                </div>\n                <div class=\"inputbox\">\n                    <input id=\"password\" class=\"psw-log\"  type=\"password\" placeholder=\"Password\" required>\n                </div>\n                <button type=\"submit\" class=\"login-submit\" onclick=\"tryLogin()\">Login</button>\n                <div class=\"register-link1\">\n                    <p>Don't you have an account yet? <a href=\"login/register\">Register</a></p>\n                    \n                </div>\n        </div>\n    </main>\n    <script src=\"../js/api.js\"></script>\n    <script src=\"../js/login.js\"></script>\n    <script src=\"../js/routes.js\"></script>\n    <script src=\"../js/ejs.min.js\"></script>\n    <script src=\"../js/views.js\"></script>\n\n</body>\n</html>")
    ; __line = 35
  }
  return __output;
} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}

}
ejs.views_profile = function(locals, escapeFn, include = ejs.views_include(locals), rethrow
) {
rethrow = rethrow || function rethrow(err, str, flnm, lineno, esc) {
  var lines = str.split('\n');
  var start = Math.max(lineno - 3, 0);
  var end = Math.min(lines.length, lineno + 3);
  var filename = esc(flnm);
  // Error context
  var context = lines.slice(start, end).map(function (line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;

  throw err;
};
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
var __line = 1
  , __lines = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <link rel=\"stylesheet\" href=\"../../css/general.css\">\n    <link rel=\"stylesheet\" href=\"../../css/login.css\">\n\n    <title>Profile View</title>\n</head>\n<body onload=\"checkStorage()\">\n    <header id=\"header-index\">\n        <h1 class=\"titolo\">BlinkyChess</h1>\n        <div id=\"header-right\">\n            <a class=\"icon\" href=\"/home\"><img src=\"../../images/casa.png\" alt=\"Home\"></a>\n            <div class=\"dropdown\">\n                <a class=\"icon\" href=\"#\"><img src=\"../../images/accountbianco.png\" alt=\"Account\"></a>\n                <div class=\"dropdown-content\">\n                    <a href=\"/home/profile/<%= User.username %>\">Profile</a>\n                    <a href=\"/home/login\">Logout</a>\n                </div>\n            </div>\n        </div>\n    </header>\n    <main class=\"main-index\">\n        <div id=\"profile-view\">\n            <h2 id=\"username-title\"><%= User.username %></h2>\n            <%  var won=parseInt(User.won);\n                var lost=parseInt(User.lost);\n                var wr;\n                lost==0 ? wr=\"100%\": wr=((won/(won+lost)).toString()); \n            %>\n            <p><strong>Win Rate:</strong> <span id=\"win-rate\"><%= wr!=\"100%\"?(wr*100).toFixed(2):\"100\" %>%</span></p>\n            <p><strong>ELO:</strong> <span id=\"elo\"><%= User.elo %></span></p>\n            <p><strong>Won Games:</strong> <span id=\"won-games\"><%= User.won %></span></p>\n            <h3>Score of Last 10 Games</h3>\n            <div id=\"last-10-games\">\n                <% for(let i=0;i < 10; i++){let game=User.lasts[i] %>\n                    <div class=\"game-result\">\n                        <% if (game == 'w') { %>\n                            <img src=\"../../images/vittoria.png\" alt=\"Win\" />\n                        <% } else if ( game == 'l') { %>\n                            <img src=\"../../images/sconfitta.png\" alt=\"Loss\" />\n                        <% } else if ( game == 'd') {%>\n                            <img src=\"../../images/bilancia.png\" alt=\"Draw\" />\n                        <% } else { %>\n                            <img src=\"../../images/notplayed.png\" alt=\"Notp\" />\n                        <% } %>\n                    </div>\n                <% }; %>\n            </div>\n        </div>\n    </main>\n    <footer>\n        <p>Made By Sergio Boffi ©</p>\n        <p>For any need, contact me at → boffis@usi.ch</p>\n    </footer>\n    <script src=\"../../js/api.js\"></script>\n    <script src=\"../../js/login.js\"></script>\n    <script src=\"../../js/routes.js\"></script>\n    <script src=\"../../js/ejs.min.js\"></script>\n    <script src=\"../../js/views.js\"></script>\n</body>\n</html>\n"
  , __filename = undefined;
try {
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  with (locals || {}) {
    ; __append("<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <link rel=\"stylesheet\" href=\"../../css/general.css\">\n    <link rel=\"stylesheet\" href=\"../../css/login.css\">\n\n    <title>Profile View</title>\n</head>\n<body onload=\"checkStorage()\">\n    <header id=\"header-index\">\n        <h1 class=\"titolo\">BlinkyChess</h1>\n        <div id=\"header-right\">\n            <a class=\"icon\" href=\"/home\"><img src=\"../../images/casa.png\" alt=\"Home\"></a>\n            <div class=\"dropdown\">\n                <a class=\"icon\" href=\"#\"><img src=\"../../images/accountbianco.png\" alt=\"Account\"></a>\n                <div class=\"dropdown-content\">\n                    <a href=\"/home/profile/")
    ; __line = 19
    ; __append(escapeFn( User.username ))
    ; __append("\">Profile</a>\n                    <a href=\"/home/login\">Logout</a>\n                </div>\n            </div>\n        </div>\n    </header>\n    <main class=\"main-index\">\n        <div id=\"profile-view\">\n            <h2 id=\"username-title\">")
    ; __line = 27
    ; __append(escapeFn( User.username ))
    ; __append("</h2>\n            ")
    ; __line = 28
    ;   var won=parseInt(User.won);
                var lost=parseInt(User.lost);
                var wr;
                lost==0 ? wr="100%": wr=((won/(won+lost)).toString()); 
            
    ; __line = 32
    ; __append("\n            <p><strong>Win Rate:</strong> <span id=\"win-rate\">")
    ; __line = 33
    ; __append(escapeFn( wr!="100%"?(wr*100).toFixed(2):"100" ))
    ; __append("%</span></p>\n            <p><strong>ELO:</strong> <span id=\"elo\">")
    ; __line = 34
    ; __append(escapeFn( User.elo ))
    ; __append("</span></p>\n            <p><strong>Won Games:</strong> <span id=\"won-games\">")
    ; __line = 35
    ; __append(escapeFn( User.won ))
    ; __append("</span></p>\n            <h3>Score of Last 10 Games</h3>\n            <div id=\"last-10-games\">\n                ")
    ; __line = 38
    ;  for(let i=0;i < 10; i++){let game=User.lasts[i] 
    ; __append("\n                    <div class=\"game-result\">\n                        ")
    ; __line = 40
    ;  if (game == 'w') { 
    ; __append("\n                            <img src=\"../../images/vittoria.png\" alt=\"Win\" />\n                        ")
    ; __line = 42
    ;  } else if ( game == 'l') { 
    ; __append("\n                            <img src=\"../../images/sconfitta.png\" alt=\"Loss\" />\n                        ")
    ; __line = 44
    ;  } else if ( game == 'd') {
    ; __append("\n                            <img src=\"../../images/bilancia.png\" alt=\"Draw\" />\n                        ")
    ; __line = 46
    ;  } else { 
    ; __append("\n                            <img src=\"../../images/notplayed.png\" alt=\"Notp\" />\n                        ")
    ; __line = 48
    ;  } 
    ; __append("\n                    </div>\n                ")
    ; __line = 50
    ;  }; 
    ; __append("\n            </div>\n        </div>\n    </main>\n    <footer>\n        <p>Made By Sergio Boffi ©</p>\n        <p>For any need, contact me at → boffis@usi.ch</p>\n    </footer>\n    <script src=\"../../js/api.js\"></script>\n    <script src=\"../../js/login.js\"></script>\n    <script src=\"../../js/routes.js\"></script>\n    <script src=\"../../js/ejs.min.js\"></script>\n    <script src=\"../../js/views.js\"></script>\n</body>\n</html>\n")
    ; __line = 65
  }
  return __output;
} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}

}
ejs.views_register = function(locals, escapeFn, include = ejs.views_include(locals), rethrow
) {
rethrow = rethrow || function rethrow(err, str, flnm, lineno, esc) {
  var lines = str.split('\n');
  var start = Math.max(lineno - 3, 0);
  var end = Math.min(lines.length, lineno + 3);
  var filename = esc(flnm);
  // Error context
  var context = lines.slice(start, end).map(function (line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;

  throw err;
};
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
var __line = 1
  , __lines = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <link rel=\"stylesheet\" href=\"../../css/general.css\">\n    <link rel=\"stylesheet\" href=\"../../css/login.css\">\n\n    <title>Register</title>\n</head>\n<body>\n    <main class=\"main-account\">\n        <div class=\"div-login\">\n            <h1>Register</h1>\n            <div class=\"inputbox\">\n                <input id=\"username\" class=\"user-log\" placeholder=\"Username\" required>\n            </div>\n            <div class=\"inputbox\">\n                <input id=\"password\" class=\"psw-log\" type=\"password\" placeholder=\"Password\" required>\n            </div>\n            <div class=\"inputbox\">\n                <input id=\"confirm-password\" class=\"psw-log\" type=\"password\" placeholder=\"Confirm password\" required>\n            </div>\n            <button type=\"submit\" class=\"login-submit\" onclick=\"tryRegister()\">Register</button>\n            <div class=\"register-link\">\n                <p>Do you have an account yet? <a href=\"../login\">Login</a></p>\n                <div class=\"showPSW\"><input type=\"checkbox\" id=\"showpsw\" on><label for=\"showpsw\">Show password</label></div>\n            </div>\n        </div>\n    </main>\n    <script src=\"../../js/api.js\"></script>\n    <script src=\"../../js/login.js\"></script>\n    <script src=\"../../js/routes.js\"></script>\n    <script src=\"../../js/ejs.min.js\"></script>\n    <script src=\"../../js/views.js\"></script>\n\n</body>\n</html>"
  , __filename = undefined;
try {
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  with (locals || {}) {
    ; __append("<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <link rel=\"stylesheet\" href=\"../../css/general.css\">\n    <link rel=\"stylesheet\" href=\"../../css/login.css\">\n\n    <title>Register</title>\n</head>\n<body>\n    <main class=\"main-account\">\n        <div class=\"div-login\">\n            <h1>Register</h1>\n            <div class=\"inputbox\">\n                <input id=\"username\" class=\"user-log\" placeholder=\"Username\" required>\n            </div>\n            <div class=\"inputbox\">\n                <input id=\"password\" class=\"psw-log\" type=\"password\" placeholder=\"Password\" required>\n            </div>\n            <div class=\"inputbox\">\n                <input id=\"confirm-password\" class=\"psw-log\" type=\"password\" placeholder=\"Confirm password\" required>\n            </div>\n            <button type=\"submit\" class=\"login-submit\" onclick=\"tryRegister()\">Register</button>\n            <div class=\"register-link\">\n                <p>Do you have an account yet? <a href=\"../login\">Login</a></p>\n                <div class=\"showPSW\"><input type=\"checkbox\" id=\"showpsw\" on><label for=\"showpsw\">Show password</label></div>\n            </div>\n        </div>\n    </main>\n    <script src=\"../../js/api.js\"></script>\n    <script src=\"../../js/login.js\"></script>\n    <script src=\"../../js/routes.js\"></script>\n    <script src=\"../../js/ejs.min.js\"></script>\n    <script src=\"../../js/views.js\"></script>\n\n</body>\n</html>")
    ; __line = 38
  }
  return __output;
} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}

}
ejs.views_waiting = function(locals, escapeFn, include = ejs.views_include(locals), rethrow
) {
rethrow = rethrow || function rethrow(err, str, flnm, lineno, esc) {
  var lines = str.split('\n');
  var start = Math.max(lineno - 3, 0);
  var end = Math.min(lines.length, lineno + 3);
  var filename = esc(flnm);
  // Error context
  var context = lines.slice(start, end).map(function (line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;

  throw err;
};
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
var __line = 1
  , __lines = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <link rel=\"stylesheet\" href=\"../../css/general.css\">\n    <title>Home</title>\n</head>\n<body>\n    <header id=\"header-index\">\n        <div id=\"header-right\">\n            <a class=\"logo\"><img src=\"../../images/logo.png\" alt=\"\"></a>\n        </div>\n\n    </header>\n    <main class=\"main-index\">\n        <div class=\"loader\"></div>\n    </main>\n    <footer>\n        <p>Made By Sergio Boffi ©</p>\n        <p>For any need, contact me at → boffis@usi.ch</p>\n    </footer>\n    <script src=\"../js/api.js\"></script>\n    <script src=\"../js/login.js\"></script>\n    <script src=\"../js/routes.js\"></script>\n    <script src=\"../js/ejs.min.js\"></script>\n    <script src=\"../js/views.js\"></script>\n    <script src=\"../js/waiting.js\"></script>\n\n</body>\n</html>"
  , __filename = undefined;
try {
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  with (locals || {}) {
    ; __append("<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <link rel=\"stylesheet\" href=\"../../css/general.css\">\n    <title>Home</title>\n</head>\n<body>\n    <header id=\"header-index\">\n        <div id=\"header-right\">\n            <a class=\"logo\"><img src=\"../../images/logo.png\" alt=\"\"></a>\n        </div>\n\n    </header>\n    <main class=\"main-index\">\n        <div class=\"loader\"></div>\n    </main>\n    <footer>\n        <p>Made By Sergio Boffi ©</p>\n        <p>For any need, contact me at → boffis@usi.ch</p>\n    </footer>\n    <script src=\"../js/api.js\"></script>\n    <script src=\"../js/login.js\"></script>\n    <script src=\"../js/routes.js\"></script>\n    <script src=\"../js/ejs.min.js\"></script>\n    <script src=\"../js/views.js\"></script>\n    <script src=\"../js/waiting.js\"></script>\n\n</body>\n</html>")
    ; __line = 31
  }
  return __output;
} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}

}
ejs.views_game = function(locals, escapeFn, include = ejs.views_include(locals), rethrow
) {
rethrow = rethrow || function rethrow(err, str, flnm, lineno, esc) {
  var lines = str.split('\n');
  var start = Math.max(lineno - 3, 0);
  var end = Math.min(lines.length, lineno + 3);
  var filename = esc(flnm);
  // Error context
  var context = lines.slice(start, end).map(function (line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;

  throw err;
};
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
var __line = 1
  , __lines = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <link rel=\"stylesheet\" href=\"../../../css/general.css\">\n    <link rel=\"stylesheet\" href=\"../../../css/game.css\">\n    \n    <title>Match</title>\n</head>\n<body>\n    <header id=\"header-index\">\n        <div id=\"header-right\">\n            <a class=\"logo\" href=\"#\"><img src=\"../../../images/logo.png\" alt=\"\"></a>\n        </div>\n    </header>\n    <main class=\"main-index\">\n        <div class=\"popup\">\n            <div id=\"popup-message\"></div>\n            <button class=\"home-button\">Home</button>\n        </div>\n        <div class=\"popup2\">\n            <div id=\"popup-message2\">\n                <label for=\"promotion\">Choose what the pawn becomes: </label>\n                <select id=\"promotion\">\n                    <option value=\"s\">Select a piece</option>\n                    <option value=\"Q\">Queen</option>\n                    <option value=\"R\">Rook</option>\n                    <option value=\"B\">Bishop</option>\n                    <option value=\"N\">Knight</option>\n                </select>\n            </div>\n            \n        </div>\n        <div>\n            <% if (color != 'white') { Username.reverse();Time.reverse() } %>\n            <div class=\"player-info\">\n                <div class=\"username\"><%= Username[0].username %></div>\n                <br>    \n                <div>ELO: <%= Username[0].elo %></div>\n                <%  var won=parseInt(Username[0].won);\n                    var lost=parseInt(Username[0].lost);\n                    var wr;\n                    lost==0 ? wr=\"100%\": wr=((won/(won+lost)).toString()); \n                %>\n                <div>WR: <%= wr!=\"100%\"?(wr*100).toFixed(2):\"100\" %>%</div>\n                <div class=\"timeHis\">Time left: <%=Math.floor(Time[0]/60).toString()+\":\"+String(Time[0]%60).padStart(2, '0');%></div>\n            </div>\n            \n            <div class=\"chessboard\">\n                <% let i = 0, row = 0; %>\n                <% if (color != 'white') { Board = Board.split(\" \")[0].split(\"\").reverse().join(\"\") } %>\n                <% if (color == 'white') { Board = Board.split(\" \")[0] } %>\n                <% while (Board[i] != undefined) { %>\n                    <div class=\"row\">\n                        <% let j = 0; %>\n                        <% while (Board[i] != \"/\") { %>\n                            <% let piece = Board[i]; %>\n                            <% if (piece == undefined) break; %>\n                            <% if (!isNaN(piece)) { \n                                for (let s = 0; s < Board[i]; s++) { %>\n                                    <% let cellColorClass = (row + j) % 2 === 0 ? 'whitecell' : 'browncell'; %>\n                                    <div class=\"<%= cellColorClass %>\">\n                                        <img id=\"<%= color != 'white' ? row.toString() + ((7 - j).toString()) : ((7 - row).toString()) + (j.toString()) %>\">\n                                    </div>\n                                <% j++; } j--; %>\n                            <% } else { %>\n                                <% let cellColorClass = (row + j) % 2 === 0 ? 'whitecell' : 'browncell'; %>\n                                <div class=\"<%= cellColorClass %>\">\n                                    <img class=\"pedina\" alt=\"nothing\" id=\"<%= color != 'white' ? row.toString() + ((7 - j).toString()) : ((7 - row).toString()) + j.toString() %>\" src=\"<%= '../../../images/' + (piece === piece.toUpperCase() ? 'whites/' : 'blacks/') + piece.toLowerCase() + '.png' %>\">\n                                </div>\n                            <% } %>\n                        <% i++; j++; } %>\n                        <% if (Board[i] == undefined) break; %>\n                    </div>\n                <% row++; i++; } %>\n                \n            </div>\n            \n        </div>\n        <div class=\"player-info\">\n            <div class=\"username\"><%= Username[1].username %></div>\n            <br>    \n            <div>ELO: <%= Username[1].elo %></div>\n            <%  var won=parseInt(Username[1].won);\n                var lost=parseInt(Username[1].lost);\n                var wr;\n                lost==0 ? wr=\"100%\": wr=((won/(won+lost)).toString()); \n            %>\n            <div>WR: <%= wr!=\"100%\"?(wr*100).toFixed(2):\"100\" %>%</div>\n            <div class=\"timeMine\">Time left: <%=Math.floor(Time[1]/60).toString()+\":\"+String(Time[1]%60).padStart(2, '0');%></div>\n        </div>\n        \n    </main>\n    <footer>\n        <p>Made By Sergio Boffi ©</p>\n        <p>For any need, contact me at → boffis@usi.ch</p>\n    </footer>\n    <script src=\"../../../js/api.js\"></script>\n    <script src=\"../../../js/routes.js\"></script>\n    <script src=\"../../../js/ejs.min.js\"></script>\n    <script src=\"../../../js/views.js\"></script>\n    <script type=\"module\" src=\"../../../js/game.js\"></script>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.js\"></script>\n    <script src=\"/socket.io/socket.io.js\"></script>\n\n\n</body>\n</html>"
  , __filename = undefined;
try {
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  with (locals || {}) {
    ; __append("<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <link rel=\"stylesheet\" href=\"../../../css/general.css\">\n    <link rel=\"stylesheet\" href=\"../../../css/game.css\">\n    \n    <title>Match</title>\n</head>\n<body>\n    <header id=\"header-index\">\n        <div id=\"header-right\">\n            <a class=\"logo\" href=\"#\"><img src=\"../../../images/logo.png\" alt=\"\"></a>\n        </div>\n    </header>\n    <main class=\"main-index\">\n        <div class=\"popup\">\n            <div id=\"popup-message\"></div>\n            <button class=\"home-button\">Home</button>\n        </div>\n        <div class=\"popup2\">\n            <div id=\"popup-message2\">\n                <label for=\"promotion\">Choose what the pawn becomes: </label>\n                <select id=\"promotion\">\n                    <option value=\"s\">Select a piece</option>\n                    <option value=\"Q\">Queen</option>\n                    <option value=\"R\">Rook</option>\n                    <option value=\"B\">Bishop</option>\n                    <option value=\"N\">Knight</option>\n                </select>\n            </div>\n            \n        </div>\n        <div>\n            ")
    ; __line = 36
    ;  if (color != 'white') { Username.reverse();Time.reverse() } 
    ; __append("\n            <div class=\"player-info\">\n                <div class=\"username\">")
    ; __line = 38
    ; __append(escapeFn( Username[0].username ))
    ; __append("</div>\n                <br>    \n                <div>ELO: ")
    ; __line = 40
    ; __append(escapeFn( Username[0].elo ))
    ; __append("</div>\n                ")
    ; __line = 41
    ;   var won=parseInt(Username[0].won);
                    var lost=parseInt(Username[0].lost);
                    var wr;
                    lost==0 ? wr="100%": wr=((won/(won+lost)).toString()); 
                
    ; __line = 45
    ; __append("\n                <div>WR: ")
    ; __line = 46
    ; __append(escapeFn( wr!="100%"?(wr*100).toFixed(2):"100" ))
    ; __append("%</div>\n                <div class=\"timeHis\">Time left: ")
    ; __line = 47
    ; __append(escapeFn(Math.floor(Time[0]/60).toString()+":"+String(Time[0]%60).padStart(2, '0')))
    ; __append("</div>\n            </div>\n            \n            <div class=\"chessboard\">\n                ")
    ; __line = 51
    ;  let i = 0, row = 0; 
    ; __append("\n                ")
    ; __line = 52
    ;  if (color != 'white') { Board = Board.split(" ")[0].split("").reverse().join("") } 
    ; __append("\n                ")
    ; __line = 53
    ;  if (color == 'white') { Board = Board.split(" ")[0] } 
    ; __append("\n                ")
    ; __line = 54
    ;  while (Board[i] != undefined) { 
    ; __append("\n                    <div class=\"row\">\n                        ")
    ; __line = 56
    ;  let j = 0; 
    ; __append("\n                        ")
    ; __line = 57
    ;  while (Board[i] != "/") { 
    ; __append("\n                            ")
    ; __line = 58
    ;  let piece = Board[i]; 
    ; __append("\n                            ")
    ; __line = 59
    ;  if (piece == undefined) break; 
    ; __append("\n                            ")
    ; __line = 60
    ;  if (!isNaN(piece)) { 
                                for (let s = 0; s < Board[i]; s++) { 
    ; __line = 61
    ; __append("\n                                    ")
    ; __line = 62
    ;  let cellColorClass = (row + j) % 2 === 0 ? 'whitecell' : 'browncell'; 
    ; __append("\n                                    <div class=\"")
    ; __line = 63
    ; __append(escapeFn( cellColorClass ))
    ; __append("\">\n                                        <img id=\"")
    ; __line = 64
    ; __append(escapeFn( color != 'white' ? row.toString() + ((7 - j).toString()) : ((7 - row).toString()) + (j.toString()) ))
    ; __append("\">\n                                    </div>\n                                ")
    ; __line = 66
    ;  j++; } j--; 
    ; __append("\n                            ")
    ; __line = 67
    ;  } else { 
    ; __append("\n                                ")
    ; __line = 68
    ;  let cellColorClass = (row + j) % 2 === 0 ? 'whitecell' : 'browncell'; 
    ; __append("\n                                <div class=\"")
    ; __line = 69
    ; __append(escapeFn( cellColorClass ))
    ; __append("\">\n                                    <img class=\"pedina\" alt=\"nothing\" id=\"")
    ; __line = 70
    ; __append(escapeFn( color != 'white' ? row.toString() + ((7 - j).toString()) : ((7 - row).toString()) + j.toString() ))
    ; __append("\" src=\"")
    ; __append(escapeFn( '../../../images/' + (piece === piece.toUpperCase() ? 'whites/' : 'blacks/') + piece.toLowerCase() + '.png' ))
    ; __append("\">\n                                </div>\n                            ")
    ; __line = 72
    ;  } 
    ; __append("\n                        ")
    ; __line = 73
    ;  i++; j++; } 
    ; __append("\n                        ")
    ; __line = 74
    ;  if (Board[i] == undefined) break; 
    ; __append("\n                    </div>\n                ")
    ; __line = 76
    ;  row++; i++; } 
    ; __append("\n                \n            </div>\n            \n        </div>\n        <div class=\"player-info\">\n            <div class=\"username\">")
    ; __line = 82
    ; __append(escapeFn( Username[1].username ))
    ; __append("</div>\n            <br>    \n            <div>ELO: ")
    ; __line = 84
    ; __append(escapeFn( Username[1].elo ))
    ; __append("</div>\n            ")
    ; __line = 85
    ;   var won=parseInt(Username[1].won);
                var lost=parseInt(Username[1].lost);
                var wr;
                lost==0 ? wr="100%": wr=((won/(won+lost)).toString()); 
            
    ; __line = 89
    ; __append("\n            <div>WR: ")
    ; __line = 90
    ; __append(escapeFn( wr!="100%"?(wr*100).toFixed(2):"100" ))
    ; __append("%</div>\n            <div class=\"timeMine\">Time left: ")
    ; __line = 91
    ; __append(escapeFn(Math.floor(Time[1]/60).toString()+":"+String(Time[1]%60).padStart(2, '0')))
    ; __append("</div>\n        </div>\n        \n    </main>\n    <footer>\n        <p>Made By Sergio Boffi ©</p>\n        <p>For any need, contact me at → boffis@usi.ch</p>\n    </footer>\n    <script src=\"../../../js/api.js\"></script>\n    <script src=\"../../../js/routes.js\"></script>\n    <script src=\"../../../js/ejs.min.js\"></script>\n    <script src=\"../../../js/views.js\"></script>\n    <script type=\"module\" src=\"../../../js/game.js\"></script>\n    <script src=\"https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.js\"></script>\n    <script src=\"/socket.io/socket.io.js\"></script>\n\n\n</body>\n</html>")
    ; __line = 109
  }
  return __output;
} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}

}
ejs.views_home = function(locals, escapeFn, include = ejs.views_include(locals), rethrow
) {
rethrow = rethrow || function rethrow(err, str, flnm, lineno, esc) {
  var lines = str.split('\n');
  var start = Math.max(lineno - 3, 0);
  var end = Math.min(lines.length, lineno + 3);
  var filename = esc(flnm);
  // Error context
  var context = lines.slice(start, end).map(function (line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;

  throw err;
};
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
var __line = 1
  , __lines = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <link rel=\"stylesheet\" href=\"../css/general.css\">\n    <title>Home</title>\n</head>\n<body onload=\"checkStorage()\">\n    <header id=\"header-index\">\n        <h1 class=\"titolo\">BlinkyChess</h1>\n        <div id=\"header-right\">\n            <a class=\"icon\" href=\"/home\"><img src=\"../images/casabianca.png\" alt=\"\"></a>\n            <div class=\"dropdown\">\n                <a class=\"icon\"><img src=\"../images/account.png\" ></a>\n                <div class=\"dropdown-content\">\n                    <a id=\"profile-link\">Profile</a>\n                    <a href=\"/home/login\">Logout</a>\n                </div>\n            </div>\n        </div>\n\n    </header>\n    <main class=\"main-index\">\n        <button class=\"button-container\" onclick=\"renderGamePref()\"><b>Look for a game</b></button>\n        <div class=\"table-container\">\n            <table>\n                <tr>\n                    <th>Spectate </th>\n                    <th>Black</th>\n                    <th>White</th>\n                </tr>\n                <% for (let i = 0; i < Games.length; i++) { %>\n                    <tr>\n                        <%if(Games[i]){%>\n                        <td><a href= \"<%= 'home/game/'+Games[i]._id+'/w' %>\" ><button id=\"spectate\">Spectate</button></a></td>\n                        <td><%= Games[i].black %></td>\n                        <td><%= Games[i].white %></td>\n                        <%}else{%>\n                        <td></td>\n                        <td></td>\n                        <td></td>\n                        <%}%>\n                    </tr>\n                <% } %>\n            </table>\n        </div>\n        <div class=\"choose-match\">\n            <div class=\"divTitle\">\n                <div></div>\n                <h1>Match Options</h1>\n                <button  onclick=\"closePopUp()\"><img src=\"../images/close.png\"></button>\n            </div>\n            \n            <div id=\"match-row1\">\n                <button class=\"btnChooseactive\">5 Minutes</button>\n                <button class=\"btnChoose\">10 Minutes</button>\n                <button class=\"btnChoose\">30 Minutes</button>\n            </div>\n            <div id=\"match-row2\">\n                <button class=\"btnChooseactive\">Ranked</button>\n                <button class=\"btnChoose\">Unranked</button>\n\n            </div>\n            <button  id=\"match-row3\"class=\"btnChoose\"><b>PLAY</b></button>\n    \n        </div>\n    </main>\n    <footer>\n        <p>Made By Sergio Boffi ©</p>\n        <p>For any need, contact me at → boffis@usi.ch</p>\n    </footer>\n    <script src=\"js/api.js\"></script>\n    <script src=\"js/login.js\"></script>\n    <script src=\"js/routes.js\"></script>\n    <script src=\"js/ejs.min.js\"></script>\n    <script src=\"js/views.js\"></script>\n    <script src=\"js/lookingFor.js\"></script>\n\n</body>\n</html>"
  , __filename = undefined;
try {
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  with (locals || {}) {
    ; __append("<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <link rel=\"stylesheet\" href=\"../css/general.css\">\n    <title>Home</title>\n</head>\n<body onload=\"checkStorage()\">\n    <header id=\"header-index\">\n        <h1 class=\"titolo\">BlinkyChess</h1>\n        <div id=\"header-right\">\n            <a class=\"icon\" href=\"/home\"><img src=\"../images/casabianca.png\" alt=\"\"></a>\n            <div class=\"dropdown\">\n                <a class=\"icon\"><img src=\"../images/account.png\" ></a>\n                <div class=\"dropdown-content\">\n                    <a id=\"profile-link\">Profile</a>\n                    <a href=\"/home/login\">Logout</a>\n                </div>\n            </div>\n        </div>\n\n    </header>\n    <main class=\"main-index\">\n        <button class=\"button-container\" onclick=\"renderGamePref()\"><b>Look for a game</b></button>\n        <div class=\"table-container\">\n            <table>\n                <tr>\n                    <th>Spectate </th>\n                    <th>Black</th>\n                    <th>White</th>\n                </tr>\n                ")
    ; __line = 33
    ;  for (let i = 0; i < Games.length; i++) { 
    ; __append("\n                    <tr>\n                        ")
    ; __line = 35
    ; if(Games[i]){
    ; __append("\n                        <td><a href= \"")
    ; __line = 36
    ; __append(escapeFn( 'home/game/'+Games[i]._id+'/w' ))
    ; __append("\" ><button id=\"spectate\">Spectate</button></a></td>\n                        <td>")
    ; __line = 37
    ; __append(escapeFn( Games[i].black ))
    ; __append("</td>\n                        <td>")
    ; __line = 38
    ; __append(escapeFn( Games[i].white ))
    ; __append("</td>\n                        ")
    ; __line = 39
    ; }else{
    ; __append("\n                        <td></td>\n                        <td></td>\n                        <td></td>\n                        ")
    ; __line = 43
    ; }
    ; __append("\n                    </tr>\n                ")
    ; __line = 45
    ;  } 
    ; __append("\n            </table>\n        </div>\n        <div class=\"choose-match\">\n            <div class=\"divTitle\">\n                <div></div>\n                <h1>Match Options</h1>\n                <button  onclick=\"closePopUp()\"><img src=\"../images/close.png\"></button>\n            </div>\n            \n            <div id=\"match-row1\">\n                <button class=\"btnChooseactive\">5 Minutes</button>\n                <button class=\"btnChoose\">10 Minutes</button>\n                <button class=\"btnChoose\">30 Minutes</button>\n            </div>\n            <div id=\"match-row2\">\n                <button class=\"btnChooseactive\">Ranked</button>\n                <button class=\"btnChoose\">Unranked</button>\n\n            </div>\n            <button  id=\"match-row3\"class=\"btnChoose\"><b>PLAY</b></button>\n    \n        </div>\n    </main>\n    <footer>\n        <p>Made By Sergio Boffi ©</p>\n        <p>For any need, contact me at → boffis@usi.ch</p>\n    </footer>\n    <script src=\"js/api.js\"></script>\n    <script src=\"js/login.js\"></script>\n    <script src=\"js/routes.js\"></script>\n    <script src=\"js/ejs.min.js\"></script>\n    <script src=\"js/views.js\"></script>\n    <script src=\"js/lookingFor.js\"></script>\n\n</body>\n</html>")
    ; __line = 81
  }
  return __output;
} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}

}
ejs.views_login = function(locals, escapeFn, include = ejs.views_include(locals), rethrow
) {
rethrow = rethrow || function rethrow(err, str, flnm, lineno, esc) {
  var lines = str.split('\n');
  var start = Math.max(lineno - 3, 0);
  var end = Math.min(lines.length, lineno + 3);
  var filename = esc(flnm);
  // Error context
  var context = lines.slice(start, end).map(function (line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;

  throw err;
};
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
var __line = 1
  , __lines = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <link rel=\"stylesheet\" href=\"../css/general.css\">\n    <link rel=\"stylesheet\" href=\"../css/login.css\">\n\n    <title>Login</title>\n</head>\n<body onload=\"sessionStorage.clear()\">\n    <main class=\"main-account\">\n        <div class=\"div-login\">\n                <h1>Login</h1>\n                <div class=\"inputbox\">\n                    <input id=\"username\" class=\"user-log\"  placeholder=\"Username\" required>\n                </div>\n                <div class=\"inputbox\">\n                    <input id=\"password\" class=\"psw-log\"  type=\"password\" placeholder=\"Password\" required>\n                </div>\n                <button type=\"submit\" class=\"login-submit\" onclick=\"tryLogin()\">Login</button>\n                <div class=\"register-link1\">\n                    <p>Don't you have an account yet? <a href=\"login/register\">Register</a></p>\n                    \n                </div>\n        </div>\n    </main>\n    <script src=\"../js/api.js\"></script>\n    <script src=\"../js/login.js\"></script>\n    <script src=\"../js/routes.js\"></script>\n    <script src=\"../js/ejs.min.js\"></script>\n    <script src=\"../js/views.js\"></script>\n\n</body>\n</html>"
  , __filename = undefined;
try {
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  with (locals || {}) {
    ; __append("<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <link rel=\"stylesheet\" href=\"../css/general.css\">\n    <link rel=\"stylesheet\" href=\"../css/login.css\">\n\n    <title>Login</title>\n</head>\n<body onload=\"sessionStorage.clear()\">\n    <main class=\"main-account\">\n        <div class=\"div-login\">\n                <h1>Login</h1>\n                <div class=\"inputbox\">\n                    <input id=\"username\" class=\"user-log\"  placeholder=\"Username\" required>\n                </div>\n                <div class=\"inputbox\">\n                    <input id=\"password\" class=\"psw-log\"  type=\"password\" placeholder=\"Password\" required>\n                </div>\n                <button type=\"submit\" class=\"login-submit\" onclick=\"tryLogin()\">Login</button>\n                <div class=\"register-link1\">\n                    <p>Don't you have an account yet? <a href=\"login/register\">Register</a></p>\n                    \n                </div>\n        </div>\n    </main>\n    <script src=\"../js/api.js\"></script>\n    <script src=\"../js/login.js\"></script>\n    <script src=\"../js/routes.js\"></script>\n    <script src=\"../js/ejs.min.js\"></script>\n    <script src=\"../js/views.js\"></script>\n\n</body>\n</html>")
    ; __line = 35
  }
  return __output;
} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}

}
ejs.views_profile = function(locals, escapeFn, include = ejs.views_include(locals), rethrow
) {
rethrow = rethrow || function rethrow(err, str, flnm, lineno, esc) {
  var lines = str.split('\n');
  var start = Math.max(lineno - 3, 0);
  var end = Math.min(lines.length, lineno + 3);
  var filename = esc(flnm);
  // Error context
  var context = lines.slice(start, end).map(function (line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;

  throw err;
};
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
var __line = 1
  , __lines = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <link rel=\"stylesheet\" href=\"../../css/general.css\">\n    <link rel=\"stylesheet\" href=\"../../css/login.css\">\n\n    <title>Profile View</title>\n</head>\n<body onload=\"checkStorage()\">\n    <header id=\"header-index\">\n        <h1 class=\"titolo\">BlinkyChess</h1>\n        <div id=\"header-right\">\n            <a class=\"icon\" href=\"/home\"><img src=\"../../images/casa.png\" alt=\"Home\"></a>\n            <div class=\"dropdown\">\n                <a class=\"icon\" href=\"#\"><img src=\"../../images/accountbianco.png\" alt=\"Account\"></a>\n                <div class=\"dropdown-content\">\n                    <a href=\"/home/profile/<%= User.username %>\">Profile</a>\n                    <a href=\"/home/login\">Logout</a>\n                </div>\n            </div>\n        </div>\n    </header>\n    <main class=\"main-index\">\n        <div id=\"profile-view\">\n            <h2 id=\"username-title\"><%= User.username %></h2>\n            <%  var won=parseInt(User.won);\n                var lost=parseInt(User.lost);\n                var wr;\n                lost==0 ? wr=\"100%\": wr=((won/(won+lost)).toString()); \n            %>\n            <p><strong>Win Rate:</strong> <span id=\"win-rate\"><%= wr!=\"100%\"?(wr*100).toFixed(2):\"100\" %>%</span></p>\n            <p><strong>ELO:</strong> <span id=\"elo\"><%= User.elo %></span></p>\n            <p><strong>Won Games:</strong> <span id=\"won-games\"><%= User.won %></span></p>\n            <h3>Score of Last 10 Games</h3>\n            <div id=\"last-10-games\">\n                <% for(let i=0;i < 10; i++){let game=User.lasts[i] %>\n                    <div class=\"game-result\">\n                        <% if (game == 'w') { %>\n                            <img src=\"../../images/vittoria.png\" alt=\"Win\" />\n                        <% } else if ( game == 'l') { %>\n                            <img src=\"../../images/sconfitta.png\" alt=\"Loss\" />\n                        <% } else if ( game == 'd') {%>\n                            <img src=\"../../images/bilancia.png\" alt=\"Draw\" />\n                        <% } else { %>\n                            <img src=\"../../images/notplayed.png\" alt=\"Notp\" />\n                        <% } %>\n                    </div>\n                <% }; %>\n            </div>\n        </div>\n    </main>\n    <footer>\n        <p>Made By Sergio Boffi ©</p>\n        <p>For any need, contact me at → boffis@usi.ch</p>\n    </footer>\n    <script src=\"../../js/api.js\"></script>\n    <script src=\"../../js/login.js\"></script>\n    <script src=\"../../js/routes.js\"></script>\n    <script src=\"../../js/ejs.min.js\"></script>\n    <script src=\"../../js/views.js\"></script>\n</body>\n</html>\n"
  , __filename = undefined;
try {
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  with (locals || {}) {
    ; __append("<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <link rel=\"stylesheet\" href=\"../../css/general.css\">\n    <link rel=\"stylesheet\" href=\"../../css/login.css\">\n\n    <title>Profile View</title>\n</head>\n<body onload=\"checkStorage()\">\n    <header id=\"header-index\">\n        <h1 class=\"titolo\">BlinkyChess</h1>\n        <div id=\"header-right\">\n            <a class=\"icon\" href=\"/home\"><img src=\"../../images/casa.png\" alt=\"Home\"></a>\n            <div class=\"dropdown\">\n                <a class=\"icon\" href=\"#\"><img src=\"../../images/accountbianco.png\" alt=\"Account\"></a>\n                <div class=\"dropdown-content\">\n                    <a href=\"/home/profile/")
    ; __line = 19
    ; __append(escapeFn( User.username ))
    ; __append("\">Profile</a>\n                    <a href=\"/home/login\">Logout</a>\n                </div>\n            </div>\n        </div>\n    </header>\n    <main class=\"main-index\">\n        <div id=\"profile-view\">\n            <h2 id=\"username-title\">")
    ; __line = 27
    ; __append(escapeFn( User.username ))
    ; __append("</h2>\n            ")
    ; __line = 28
    ;   var won=parseInt(User.won);
                var lost=parseInt(User.lost);
                var wr;
                lost==0 ? wr="100%": wr=((won/(won+lost)).toString()); 
            
    ; __line = 32
    ; __append("\n            <p><strong>Win Rate:</strong> <span id=\"win-rate\">")
    ; __line = 33
    ; __append(escapeFn( wr!="100%"?(wr*100).toFixed(2):"100" ))
    ; __append("%</span></p>\n            <p><strong>ELO:</strong> <span id=\"elo\">")
    ; __line = 34
    ; __append(escapeFn( User.elo ))
    ; __append("</span></p>\n            <p><strong>Won Games:</strong> <span id=\"won-games\">")
    ; __line = 35
    ; __append(escapeFn( User.won ))
    ; __append("</span></p>\n            <h3>Score of Last 10 Games</h3>\n            <div id=\"last-10-games\">\n                ")
    ; __line = 38
    ;  for(let i=0;i < 10; i++){let game=User.lasts[i] 
    ; __append("\n                    <div class=\"game-result\">\n                        ")
    ; __line = 40
    ;  if (game == 'w') { 
    ; __append("\n                            <img src=\"../../images/vittoria.png\" alt=\"Win\" />\n                        ")
    ; __line = 42
    ;  } else if ( game == 'l') { 
    ; __append("\n                            <img src=\"../../images/sconfitta.png\" alt=\"Loss\" />\n                        ")
    ; __line = 44
    ;  } else if ( game == 'd') {
    ; __append("\n                            <img src=\"../../images/bilancia.png\" alt=\"Draw\" />\n                        ")
    ; __line = 46
    ;  } else { 
    ; __append("\n                            <img src=\"../../images/notplayed.png\" alt=\"Notp\" />\n                        ")
    ; __line = 48
    ;  } 
    ; __append("\n                    </div>\n                ")
    ; __line = 50
    ;  }; 
    ; __append("\n            </div>\n        </div>\n    </main>\n    <footer>\n        <p>Made By Sergio Boffi ©</p>\n        <p>For any need, contact me at → boffis@usi.ch</p>\n    </footer>\n    <script src=\"../../js/api.js\"></script>\n    <script src=\"../../js/login.js\"></script>\n    <script src=\"../../js/routes.js\"></script>\n    <script src=\"../../js/ejs.min.js\"></script>\n    <script src=\"../../js/views.js\"></script>\n</body>\n</html>\n")
    ; __line = 65
  }
  return __output;
} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}

}
ejs.views_register = function(locals, escapeFn, include = ejs.views_include(locals), rethrow
) {
rethrow = rethrow || function rethrow(err, str, flnm, lineno, esc) {
  var lines = str.split('\n');
  var start = Math.max(lineno - 3, 0);
  var end = Math.min(lines.length, lineno + 3);
  var filename = esc(flnm);
  // Error context
  var context = lines.slice(start, end).map(function (line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;

  throw err;
};
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
var __line = 1
  , __lines = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <link rel=\"stylesheet\" href=\"../../css/general.css\">\n    <link rel=\"stylesheet\" href=\"../../css/login.css\">\n\n    <title>Register</title>\n</head>\n<body>\n    <main class=\"main-account\">\n        <div class=\"div-login\">\n            <h1>Register</h1>\n            <div class=\"inputbox\">\n                <input id=\"username\" class=\"user-log\" placeholder=\"Username\" required>\n            </div>\n            <div class=\"inputbox\">\n                <input id=\"password\" class=\"psw-log\" type=\"password\" placeholder=\"Password\" required>\n            </div>\n            <div class=\"inputbox\">\n                <input id=\"confirm-password\" class=\"psw-log\" type=\"password\" placeholder=\"Confirm password\" required>\n            </div>\n            <button type=\"submit\" class=\"login-submit\" onclick=\"tryRegister()\">Register</button>\n            <div class=\"register-link\">\n                <p>Do you have an account yet? <a href=\"../login\">Login</a></p>\n                <div class=\"showPSW\"><input type=\"checkbox\" id=\"showpsw\" on><label for=\"showpsw\">Show password</label></div>\n            </div>\n        </div>\n    </main>\n    <script src=\"../../js/api.js\"></script>\n    <script src=\"../../js/login.js\"></script>\n    <script src=\"../../js/routes.js\"></script>\n    <script src=\"../../js/ejs.min.js\"></script>\n    <script src=\"../../js/views.js\"></script>\n\n</body>\n</html>"
  , __filename = undefined;
try {
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  with (locals || {}) {
    ; __append("<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <link rel=\"stylesheet\" href=\"../../css/general.css\">\n    <link rel=\"stylesheet\" href=\"../../css/login.css\">\n\n    <title>Register</title>\n</head>\n<body>\n    <main class=\"main-account\">\n        <div class=\"div-login\">\n            <h1>Register</h1>\n            <div class=\"inputbox\">\n                <input id=\"username\" class=\"user-log\" placeholder=\"Username\" required>\n            </div>\n            <div class=\"inputbox\">\n                <input id=\"password\" class=\"psw-log\" type=\"password\" placeholder=\"Password\" required>\n            </div>\n            <div class=\"inputbox\">\n                <input id=\"confirm-password\" class=\"psw-log\" type=\"password\" placeholder=\"Confirm password\" required>\n            </div>\n            <button type=\"submit\" class=\"login-submit\" onclick=\"tryRegister()\">Register</button>\n            <div class=\"register-link\">\n                <p>Do you have an account yet? <a href=\"../login\">Login</a></p>\n                <div class=\"showPSW\"><input type=\"checkbox\" id=\"showpsw\" on><label for=\"showpsw\">Show password</label></div>\n            </div>\n        </div>\n    </main>\n    <script src=\"../../js/api.js\"></script>\n    <script src=\"../../js/login.js\"></script>\n    <script src=\"../../js/routes.js\"></script>\n    <script src=\"../../js/ejs.min.js\"></script>\n    <script src=\"../../js/views.js\"></script>\n\n</body>\n</html>")
    ; __line = 38
  }
  return __output;
} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}

}
ejs.views_waiting = function(locals, escapeFn, include = ejs.views_include(locals), rethrow
) {
rethrow = rethrow || function rethrow(err, str, flnm, lineno, esc) {
  var lines = str.split('\n');
  var start = Math.max(lineno - 3, 0);
  var end = Math.min(lines.length, lineno + 3);
  var filename = esc(flnm);
  // Error context
  var context = lines.slice(start, end).map(function (line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;

  throw err;
};
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
var __line = 1
  , __lines = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <link rel=\"stylesheet\" href=\"../../css/general.css\">\n    <title>Home</title>\n</head>\n<body>\n    <header id=\"header-index\">\n        <div id=\"header-right\">\n            <a class=\"logo\"><img src=\"../../images/logo.png\" alt=\"\"></a>\n        </div>\n\n    </header>\n    <main class=\"main-index\">\n        <div class=\"loader\"></div>\n    </main>\n    <footer>\n        <p>Made By Sergio Boffi ©</p>\n        <p>For any need, contact me at → boffis@usi.ch</p>\n    </footer>\n    <script src=\"../js/api.js\"></script>\n    <script src=\"../js/login.js\"></script>\n    <script src=\"../js/routes.js\"></script>\n    <script src=\"../js/ejs.min.js\"></script>\n    <script src=\"../js/views.js\"></script>\n    <script src=\"../js/waiting.js\"></script>\n\n</body>\n</html>"
  , __filename = undefined;
try {
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  with (locals || {}) {
    ; __append("<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <link rel=\"stylesheet\" href=\"../../css/general.css\">\n    <title>Home</title>\n</head>\n<body>\n    <header id=\"header-index\">\n        <div id=\"header-right\">\n            <a class=\"logo\"><img src=\"../../images/logo.png\" alt=\"\"></a>\n        </div>\n\n    </header>\n    <main class=\"main-index\">\n        <div class=\"loader\"></div>\n    </main>\n    <footer>\n        <p>Made By Sergio Boffi ©</p>\n        <p>For any need, contact me at → boffis@usi.ch</p>\n    </footer>\n    <script src=\"../js/api.js\"></script>\n    <script src=\"../js/login.js\"></script>\n    <script src=\"../js/routes.js\"></script>\n    <script src=\"../js/ejs.min.js\"></script>\n    <script src=\"../js/views.js\"></script>\n    <script src=\"../js/waiting.js\"></script>\n\n</body>\n</html>")
    ; __line = 31
  }
  return __output;
} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}

}