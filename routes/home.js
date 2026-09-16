const express = require("express");
const router = express.Router();
module.exports = router;

let { model } = require("../model");

router.get("/", async (req, res) => {
  const Games = await model.games_list.getGames();
  res.status(200).json(Games);
});

router.get("/profile/:username", async (req, res) => {
  try {
    const User = await model.users_list.getUser(req.params.username);
    res.status(200).json(User);
  } catch (error) {
    res.sendStatus(404);
  }
});

router.get("/game/all", async (req, res) => {
  try {
    const Games = await model.games_list.getGames();
    res.status(200).json(Games);
  } catch (error) {
    res.sendStatus(404);
  }
});

router.get("/game/:id/:color", async (req, res) => {
  try {
    const Game = await model.games_list.getGame(req.params.id);
    let Board = Game.board;
    let color = req.params.color == 'w' ? "white" : "black";
    let whiteplayer = await model.users_list.getUser(Game.white);
    let blackplayer = await model.users_list.getUser(Game.black);
    let Time = [Game.btime, Game.wtime];
    let Username = [blackplayer, whiteplayer];
    res.status(200).json({ Board, color, Username, Time });
  } catch (error) {
    res.sendStatus(404);
  }
});

router.get("/game/:id", async (req, res) => {
  try {
    const Game = await model.games_list.getGame(req.params.id);
    res.status(200).json(Game);
  } catch (error) {
    res.sendStatus(404);
  }
});

router.post("/game", async (req, res) => {
  try {
    let game_data = {
      white: req.body.white,
      black: req.body.black,
      ranked: req.body.ranked,
      board: req.body.board,
      wtime: req.body.wtime,
      btime: req.body.btime
    };
    if (game_data == undefined) {
      res.sendStatus(400);
      return;
    }
    let game = await model.games_list.addGame(game_data);
    res.status(201).json(game);
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
    res.sendStatus(204);
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
    await model.games_list.patchBoard(req.params.id, req.body.board, req.body.wtime, req.body.btime);
    res.status(204).json(req.body);
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
    res.status(204).json(req.body.black);
  } catch (e) {
    res.sendStatus(e.status || 500);
  }
});

router.patch("/game", async (req, res) => {
  try {
    await model.users_list.patchAfterGame(req.body.username, req.body.win, req.body.elo, req.body.lasts);
    res.sendStatus(204);
  } catch (e) {
    res.sendStatus(e.status || 500);
  }
});
