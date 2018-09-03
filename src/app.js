const express = require("express");
const axios = require("axios");

const db = require("./db");

const app = express();

let lastFetch = null;

app.get("/versions", fetchVersionsIfNeeded, getRecords);

function fetchVersionsIfNeeded(req, res, next) {
  if (lastFetch === null || dateDiffInDays > 2) {
    axios.get("https://api.github.com/repos/directus/app/releases")
      .then(res => res.data)
      .then(records => records.map(({ name, published_at, body }) => ({
        version: name,
        date: published_at,
        info: body
      })))
      .then(records => {
        db
          .delete()
          .from("versions")
          .then(() => {
            db("versions").insert(records).then(() => next());
          });
      })
      .catch(error => {
        console.error(error);
        res.status(500).end();
      });
  }

  return next();
}

function dateDiffInDays(a, b) {
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / 1000 * 60 * 60 * 24);
}

function getRecords(req, res) {
  db
    .select("*")
    .from("versions")
    .orderBy("date", "desc")
    .then(records => {
      res.send(records);
    })
    .catch(error => {
      console.error(error);
      res.status(500).end();
    });
}

module.exports = app;
