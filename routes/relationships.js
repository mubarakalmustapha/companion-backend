const express = require("express");
const db = require("../connect");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/", (req, res) => {
  const sql =
    "SELECT followedUserId FROM relationships WHERE followerUserId = ?";

  db.query(sql, [req.query.followerUserId], (err, data) => {
    if (err) return res.status(500).send(err);
    return res.send(data.map((relationship) => relationship.followedUserId));
  });
});

router.post("/", auth, (req, res) => {
  const sql =
    "INSERT INTO relationships (`followerUserId`, `followedUserId`) VALUES (?)";
  const values = [req.user.id, req.body.followedUserId];

  db.query(sql, [values], (err, data) => {
    if (err) return res.status(500).send(err);
    return res.send("Following");
  });
});

router.delete("/:id", auth, (req, res) => {
  const sql =
    "DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?";

  db.query(sql, [req.user.id, req.params.id], (err, data) => {
    if (err) return res.status(500).send(err);
    return res.send("Unfollow");
  });
});

module.exports = router;
