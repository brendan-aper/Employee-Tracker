// Establish connection to mysql and export it.
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "T8Es66@RiVuT",
  database: "employee_db"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Database Connection Secured")
});

module.exports = connection;

