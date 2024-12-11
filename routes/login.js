const express = require("express");
const router = express.Router();
module.exports = router;
let { model } = require("../model");

router.get("/", async (req, res) => {
    res.format({
      html: () => {
        res.render("login.ejs")
      },
      json: () => {
        res.status(200)
      },
      default: () => {
        res.status(406).send("Not Acceptable");
      },
    });
});
router.get("/:username", async (req, res) => {
  try {
    let user;
    try 
    {
      user = await model.users_list.getUser(req.params.username);
    } 
    catch
    {
      res.sendStatus(404);
      return;
    }

    res.format({
      html: () => {

      },
      json: () => {
        res.status(200).json(user);
      },
      default: () => {
        res.status(406).send("Not Acceptable");
      },
    });
  } catch (e) {
    res.sendStatus(e.status ?? 500);
  }
});
router.get("/profile/:username", async (req, res) => {
  try {
    let user;
    try 
    {
      user = await model.users_list.getUser(req.params.username);
    } 
    catch
    {
      res.sendStatus(404);
      return;
    }
    let wr=user.won/user.lost;
    stats={
      username:user.username,
      wr:wr,
      elo:user.elo,
      wonGames:user.won
    }
    res.format({
      html: () => {
        res.render("profile.ejs")
      },
      json: () => {
        res.status(200).json(stats);
      },
      default: () => {
        res.status(406).send("Not Acceptable");
      },
    });
  } catch (e) {
    res.sendStatus(e.status ?? 500);
  }
});


