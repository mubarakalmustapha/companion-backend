const mysql = require("mysql");

const db = mysql.createPool({
  host: "b4mktdzbdbfhbnvk1dkt-mysql.services.clever-cloud.com",
  user: "uhzsbjouzzp4ls8z",
  password: "JNAyWtCwS7NCKcvko6mf",
  database: "b4mktdzbdbfhbnvk1dkt",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.getConnection(function (err) {
  if (err) throw err;
  console.log("Connected to mysql...");
});

module.exports = db;
