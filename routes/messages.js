const express = require("express");
const db = require("../connect");
const auth = require("../middleware/auth");
const moment = require("moment");
const router = express.Router();

router.post("/", auth, function addMessage(req, res) {
  const sql =
    "INSERT INTO messages (`sender_id`,`receiver_id`,`message`, `sender`, `file`, `file_type`, `createdAt`) VALUES (?)";
  const values = [
    req.body.sender_id,
    req.body.receiver_id,
    req.body.message,
    req.body.sender,
    req.body.file,
    req.body.file_type,
    moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
  ];

  db.query(sql, [values], (err, data) => {
    if (err) return res.status(500).send(err);
    res.send("Message have been sent successfully");
  });
});

router.get("/", function deleteMessage(req, res) {
  const sql = `SELECT m.id, m.createdAt, u.profilePic, m.sender_id, m.receiver_id, m.message, m.sender, m.file, m.file_type, u.username FROM messages m JOIN users u ON m.sender_id = u.id WHERE m.receiver_id = '${req.query.curentUserId}' AND  m.sender_id =
    '${req.query.friendId}' OR m.sender_id = '${req.query.curentUserId}' AND m.receiver_id = '${req.query.friendId}' `;

  db.query(sql, (err, data) => {
    if (err) return res.status(500).send(err);
    res.send([data]);
  });
});

module.exports = router;
