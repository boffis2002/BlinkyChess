const mongodb = require('mongodb');


const local_mongodb_uri = 'mongodb://127.0.0.1:27017/';

const default_mongodb_uri = local_mongodb_uri;
    
const clients = {};
const connections = {};

let model = {};

let connect = function(db_name, mongodb_uri) {

    db_name = db_name ?? 'BlinkyChess';
    mongodb_uri = mongodb_uri ?? default_mongodb_uri;

    let client = clients[mongodb_uri];

    if (client === undefined) {
        client = new mongodb.MongoClient(mongodb_uri);
        clients[mongodb_uri] = client;

        console.log("Connecting to mongodb server");
        connections[mongodb_uri] = client.connect().then(client => {
            console.log("Connected to mongodb server");

            users_list = require("./users-db")(client, db_name, "users");
            games_list = require("./games-db")(client, db_name, "games");

            model.users_list = users_list;
            model.games_list = games_list;


            return { client,
                     users_list,
                     games_list,
                     users: client.db(db_name).collection("users"),
                     games: client.db(db_name).collection("games"),
                   }
        }).catch(err => console.error(err));
    }

    return connections[mongodb_uri];

}

module.exports = { connect, model };