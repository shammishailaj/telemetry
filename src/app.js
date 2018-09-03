const express = require("express");
const axios = require("axios");
const db = require("./db");

module.exports = express()
  .disable("x-powered-by")
  .use("/versions", require("./routes/versions"))
  .use("/track", require("./routes/track"))
  .use("*", notFound);

function notFound(req, res) {
  return res.status(404).end();
}
