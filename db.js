const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "sql@123",
  database: "fundhive_db"
});

module.exports = db;
