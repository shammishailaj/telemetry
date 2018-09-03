const express = require("express");

const db = require("./db");

const app = express();

app.get("/versions", (req, res) => {
  db
    .select("*")
    .from("versions")
    .orderBy("date")
    .then(records => {
      res.send(records);
    })
    .catch(error => {
      console.error(error);
      res.status(500).end();
    });
});

module.exports = app;
