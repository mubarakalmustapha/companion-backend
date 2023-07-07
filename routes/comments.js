const express = require("express");
const db = require("../connect");
const moment = require("moment");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/", (req, res) => {
  const sql = `
    SELECT c.*, u.id AS userId, first_name, last_name 
    FROM comments AS c 
    JOIN users AS u 
    ON (u.id = c.userId)
    WHERE c.postId = ?`;

  db.query(sql, [req.query.postId], (err, data) => {
    if (err) return res.status(500).send(err);
    return res.send(data);
  });
});
router.post("/", auth, (req, res) => {
  const sql =
    "INSERT INTO comments (`desc`, `userId`, `postId`, `createdAt`) VALUES (?)";

  const values = [
    req.body.desc,
    req.user.id,
    req.body.postId,
    moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
  ];

  db.query(sql, [values], (err, data) => {
    if (err) return res.status(500).send(err);
    return res.send("Comment have been created");
  });
});

module.exports = router;
