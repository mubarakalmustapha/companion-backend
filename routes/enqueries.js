const express = require("express");
const db = require("../connect");
const auth = require("../middleware/auth");
const moment = require("moment");
const router = express.Router();

router.post("/", auth, (req, res) => {
  const sql =
    "INSERT INTO enqueries (`userId`, `first_name`, `surname`, `email`, `subject`, `message`, `createdAt`) VALUES (?)";
  const values = [
    req.user.id,
    req.body.first_name,
    req.body.surname,
    req.body.email,
    req.body.subject,
    req.body.message,
    moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
  ];

  db.query(sql, [values], (err, data) => {
    if (err) return res.status(500).send(err);
    res.send("Your message have been sent successfully");
  });
});

module.exports = router;
