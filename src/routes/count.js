const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const chalk = require("chalk");
const hash = require("../hash");
const db = require("../db");

module.exports = express.Router()
  .use(bodyParser.json())
  .use(cors())
  .post("/", hashUrl, saveInstance);

function hashUrl(req, res, next) {
  res.locals.info = [
    {
      version: req.body.api.version,
      id: hash(req.body.api.url),
      type: "api",
      created_on: (new Date()).toISOString()
    },
    {
      version: req.body.app.version,
      id: hash(req.body.app.url),
      type: "app",
      created_on: (new Date()).toISOString()
    }
  ];

  next();
}

function saveInstance(req, res) {
  res.locals.info.forEach(save);
  res.status(200).end();
}

function save(info) {
  db
    .select(["id", "version"])
    .from("instances")
    .where("id", info.id)
    .andWhere("type", info.type)
    .limit(1)
    .then(record => {
      if (record.length === 0) {
        db("instances")
          .insert(info)
          .then(() => console.log(chalk`{green Added} record of type {bold ${info.type}} on version {blue ${info.version}}`))
          .catch(error => {
            console.error(error);
          });
      } else {
        if (record[0].version !== info.version) {
          db("instances")
            .where("id", "=", info.id)
            .update("version", info.version)
            .then(() => console.log(chalk`{magenta Updated} record of type {bold ${info.type}} on version {blue ${info.version}}`))
            .catch(error => {
              console.error(error);
            });
        }
      }
    });
}
