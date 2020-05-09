const path = require("path");

const SERVER_URL = process.env.ROOT_URL || "http://127.0.0.1";
const PORT = process.env.PORT || 3000;

const dbFilename = path.resolve(__dirname, "db", "db.json");

module.exports = {
  SERVER_URL,
  PORT,

  dbFilePath: dbFilename,
};
