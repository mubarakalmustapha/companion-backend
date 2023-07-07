const express = require("express");
const db = require("../connect");
const moment = require("moment");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/", auth, (req, res) => {
  const sql = `SELECT p.*, u.id AS userId, first_name, last_name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId)
                LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId = ? OR p.userId = ?
                ORDER BY p.createdAt DESC`;

  db.query(sql, [req.user.id, req.user.id], (err, data) => {
    if (err) return res.status(500).send(err);
    return res.send(data);
  });
});

router.get("/profile", auth, (req, res) => {
  const userId = req.query.userId;

  const sql = `SELECT p.*, u.id AS userId, first_name, last_name, profilePic FROM posts AS p JOIN users AS u ON 
    (u.id = p.userId) WHERE p.userId = ?  ORDER BY p.createdAt DESC`;

  db.query(sql, [userId], (err, data) => {
    if (err) return res.status(500).send(err);
    return res.send(data);
  });
});

router.get("/:id", (req, res) => {
  const sql = `SELECT p.*, first_name, last_name, profilePic  
      FROM posts AS p JOIN users AS u ON  (u.id = p.userId)  WHERE p.id = ?`;

  db.query(sql, [req.params.id], (err, data) => {
    if (err) return res.status(500).send(err);
    if (data.length === 0) return res.status(404).send("Post was not found");
    res.send(data);
  });
});

router.post("/", auth, (req, res) => {
  const sql =
    "INSERT INTO posts (`desc`, `image`, `userId`, `createdAt`, `title`) VALUES (?)";
  const values = [
    req.body.desc,
    req.body.image,
    req.user.id,
    moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    req.body.title,
  ];

  db.query(sql, [values], (err, data) => {
    if (err) return res.status(500).send(err);
    return res.send("Post have been created");
  });
});

router.delete("/:id", auth, (req, res) => {
  const sql = "DELETE FROM posts WHERE `id` = ? AND `userId`= ?";

  db.query(sql, [req.params.id, req.user.id], (err, data) => {
    if (err) return res.status(500).send(err);
    if (data.affectedRows > 0) return res.send("User was deleted");
    return res.status(403).send("You can't delete this post");
  });
});

module.exports = router;
