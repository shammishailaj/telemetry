const express = require("express");
const axios = require("axios");
const db = require("./db");

module.exports = express()
  .use("/versions", require("./routes/versions"));
