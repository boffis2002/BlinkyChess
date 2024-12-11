const express = require("express");
const router = express.Router();
module.exports = router;

let { model } = require("../model");
router.get("/", async (req, res) => {
  const Games = await model.games_list.getGames();
  res.format({
    html: () => {
      res.render("home.ejs",{Games})
    },
    json: () => {
      res.status(200)
    },
    default: () => {
      res.status(406).send("Not Acceptable");
    },
  });

});
  
router.get("/profile/:username", async (req, res) => {
    try {
        const User = await model.users_list.getUser(req.params.username);
        res.format({
            html: () => {
                res.render("profile.ejs", { User });
            },
            json: () => {
                res.status(200).json(User);
            },
            default: () => {
                res.status(406).send("Not Acceptable");
            },
        });
    } catch (error) {
        res.sendStatus(404);
    }
});
router.get("/game", async (req, res) => {
  try {
    const Games = await model.games_list.getGames();
      res.format({
          html: () => {
              res.render("waiting.ejs",{Games});
          },
          json: () => {
              res.status(200).json();
          },
          default: () => {
              res.status(406).send("Not Acceptable");
          },
      });
  } catch (error) {
      res.sendStatus(404);
  }
});
router.get("/game/all", async (req, res) => {
  try {
    const Games = await model.games_list.getGames();
      res.format({
          html: () => {
          },
          json: () => {
              res.status(200).json(Games);
          },
          default: () => {
              res.status(406).send("Not Acceptable");
          },
      });
  } catch (error) {
      res.sendStatus(404);
  }
});
router.get("/game/:id/:color", async (req, res) => {
  try {
      const Game = await model.games_list.getGame(req.params.id);
      let Board=Game.board;
      let color=req.params.color=='w'?"white":"black";
      let whiteplayer=await model.users_list.getUser(Game.white);
      let blackplayer=await model.users_list.getUser(Game.black);
      let Time=[Game.btime,Game.wtime]
      let Username=[blackplayer,whiteplayer]
      res.format({
          html: () => {
              res.render("game.ejs", { Board,color,Username,Time});
          },
          json: () => {
              res.status(200).json(Id);
          },
          default: () => {
              res.status(406).send("Not Acceptable");
          },
      });
  } catch (error) {
      res.sendStatus(404);
  }
});
router.get("/game/:id", async (req, res) => {
  try {
      const Game = await model.games_list.getGame(req.params.id);
      res.format({
          html: () => {
            res.send(Game)
          },
          json: () => {
              res.status(200).json(Game);
          },
          default: () => {
              res.status(406).send("Not Acceptable");
          },
      });
  } catch (error) {
      res.sendStatus(404);
  }
});
router.post("/game", async (req, res) => {
  try {
    let game_data = {
      white:req.body.white,
      black:req.body.black,
      ranked:req.body.ranked,
      board:req.body.board,
      wtime:req.body.wtime,
      btime:req.body.btime
    };
    if (game_data == undefined) {
      res.sendStatus(400);
      return;
    }
    let game = await model.games_list.addGame(game_data);
    res.format({
      html: () => {
      },
      json: () => {
        res.status(201).json(game);
      },
      default: () => {
        res.status(406).send("Not Acceptable");
      },
    });
  } catch (e) {
    res.sendStatus(e.status);
  }
});
router.delete("/game/:id", async (req, res) => {
  try {
    let game = await model.games_list.getGame(req.params.id);
    if (game == undefined) {
      res.sendStatus(404);
      return;
    }
    await model.games_list.deleteGame(req.params.id);
    res.format({
      html: () => {
        
      },
      json: () => {
        if (game != undefined) {
          res.sendStatus(204);
        } else {
          res.sendStatus(404);
        }
      },
    });
  } catch (e) {
    res.sendStatus(e.status);
  }
});
router.patch("/game/:id", async (req, res) => {
  try {
    let game = await model.games_list.getGame(req.params.id);
    if (game == undefined) {
      res.sendStatus(404);
      return;
    }
    await model.games_list.patchBoard(req.params.id, req.body.board,req.body.wtime,req.body.btime);
    res.format({
      html: () => {
        res.send(req.body)
      },
      json: () => {
        res.status(204).json(req.body); 
      },
      default: () => {
        res.status(406).send("Not Acceptable");
      },
    });
  } catch (e) {
    res.sendStatus(e.status || 500); 
  }
});
router.patch("/game/:id/b", async (req, res) => {
  try {
    let game = await model.games_list.getGame(req.params.id);
    if (game == undefined) {
      res.sendStatus(404);
      return;
    }
    await model.games_list.insertBlack(req.params.id, req.body.black);
    res.format({
      html: () => {
        res.send(req.body.black)
      },
      json: () => {
        res.status(204).json(req.body.black); 
      },
      default: () => {
        res.status(406).send("Not Acceptable");
      },
    });
  } catch (e) {
    res.sendStatus(e.status || 500); 
  }
});
 router.patch("/game", async (req, res) => {
   try {
     await model.users_list.patchAfterGame(req.body.username, req.body.win, req.body.elo, req.body.lasts);
     res.format({
       html: () => {

       },
       json: () => {
         res.status(204); 
       },
       default: () => {
         res.status(406).send("Not Acceptable");
      },
     });
   } catch (e) {
     res.sendStatus(e.status || 500); 
   }
 });


