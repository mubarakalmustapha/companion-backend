const express = require("express");
const db = require("../connect");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/", function getLikes(req, res) {
  const sql = `
  SELECT userId 
  FROM likes 
  WHERE postId = ?`;

  db.query(sql, [req.query.postId], (err, data) => {
    if (err) return res.status(500).send(err);
    return res.send(data.map((like) => like.userId));
  });
});

router.post("/", auth, function addLike(req, res) {
  const sql = "INSERT INTO likes (`userId`, `postId`) VALUES (?)";
  const values = [req.user.id, req.body.postId];
  console.log(values);
  db.query(sql, [values], (err, data) => {
    if (err) return res.status(500).send(err);
    return res.send("Post was liked ");
  });
});

router.delete("/", auth, function deleteLike(req, res) {
  const sql = "DELETE FROM likes WHERE `userId` = ? AND `postId` = ?";

  db.query(sql, [req.user.id, req.query.postId], (err, data) => {
    if (err) return res.status(500).send(err);
    return res.send("Post was disLiked");
  });
});

module.exports = router;
