const express = require("express");
const router = express.Router();
module.exports = router;
let { model } = require("../model");

router.post("/", async (req, res) => {
  try {
    let user_data = {
      username: req.body.username,
      password: req.body.password,
      lost: 0,
      won: 0,
      elo: 1200,
      lasts: "nnnnnnnnnn"
    };
    if (user_data == undefined) {
      res.sendStatus(400);
      return;
    }
    let u = await model.users_list.addUser(user_data);
    res.status(201).json(u);
  } catch (e) {
    res.sendStatus(e.status);
  }
});
