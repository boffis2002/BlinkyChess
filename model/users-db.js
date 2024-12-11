const e = require("express");

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
let users_list = function (client, db_name, collection_name) {
    const collection = client.db(db_name).collection(collection_name);
    async function getUser(Username) {
        let found = await collection.findOne({ username: Username });
        if (!found) {
          throw new StatusError(404);
        }
        return found;
        
    }
    async function addUser(User) {
        if (User != undefined && !(await collection.findOne({ username: User.username }))) {
          await collection.insertOne(User);
          return User;
        }
        return false;
    }
    async function patchAfterGame(username, win, elo, lasts) {
      const updateFields = {
        $inc: {},
        $set: { lasts: lasts }
      };
    
      if (elo !== 0) {
        if (win) {
          updateFields.$inc.won = 1;
          updateFields.$inc.elo = elo;
        } else {
          updateFields.$inc.lost = 1;
          updateFields.$inc.elo = -elo;
        }
      } else {
        updateFields.$inc.elo = elo;
      }
    
      await collection.updateOne(
        { username: username },
        updateFields
      );
    
      return true;
    }
    
    return{
      getUser,
      addUser,
      patchAfterGame
    }
}
module.exports = users_list;
