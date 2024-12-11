function StatusError(status) {
    let messages = {
      404: "Not found",
      400: "Bad request",
      500: "Internal server error",
    };
  
    let err = new Error(messages[status] || "Unknown error");
    err.status = status;
  
    return err;
  }
  const { ObjectId } = require('mongodb');

  let games_list = function (client, db_name, collection_name) {
      const collection = client.db(db_name).collection(collection_name);
      async function getGames() {
            return collection.find({}).toArray();
      }
      async function getGame(id) {
          let found = await collection.findOne({ _id: new ObjectId(id) });
          if (!found) {
            throw new StatusError(404);
          }
          return found;
          
      }
      async function addGame(Game) {
          if (Game != undefined && !(await collection.findOne({ white: Game.white })) && !(await collection.findOne({ black: Game.black }))) {
            await collection.insertOne(Game);
            return Game;
          }
          return false;
      }
      async function deleteGame(id) {
        let found = await getGame(id);
        if (found == undefined) {
          throw new StatusError(404);
        }
        let del = collection.deleteOne({ _id: new ObjectId(id) });
        return del;
      }
      async function patchBoard(id,board,wtime,btime){
        let newgame = await collection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { board: board, wtime: wtime, btime: btime }});
        return newgame;
      }
      async function insertBlack(id,username){
        let newgame = await collection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { black: username } });
        return newgame;
      }
      return{
        getGames,
        getGame,
        addGame,
        deleteGame,
        patchBoard,
        insertBlack
      }
  }
  module.exports = games_list;
  