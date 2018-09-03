const { host, user, password, database } = process.env;

const db = require("knex")({
  client: "mysql",
  connection: {
    host,
    user,
    password,
    database
  }
});

module.exports = db;
