const express = require("express");
const router = express.Router();
module.exports = router;
let { model } = require("../model");

router.get("/:username", async (req, res) => {
  try {
    let user;
    try {
      user = await model.users_list.getUser(req.params.username);
    }
    catch {
      res.sendStatus(404);
      return;
    }
    res.status(200).json(user);
  } catch (e) {
    res.sendStatus(e.status ?? 500);
  }
});

router.get("/profile/:username", async (req, res) => {
  try {
    let user;
    try {
      user = await model.users_list.getUser(req.params.username);
    }
    catch {
      res.sendStatus(404);
      return;
    }
    let wr = user.won / user.lost;
    let stats = {
      username: user.username,
      wr: wr,
      elo: user.elo,
      wonGames: user.won
    };
    res.status(200).json(stats);
  } catch (e) {
    res.sendStatus(e.status ?? 500);
  }
});
