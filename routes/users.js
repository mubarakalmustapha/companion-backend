const express = require("express");
const db = require("../connect");
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/find/:id", auth, function getUser(req, res) {
  const sql = `SELECT * FROM users WHERE id = ?`;

  db.query(sql, [req.params.id], (err, data) => {
    if (err) return res.status(500).send(err);
    if (data.length === 0) return res.status(404).send("User was not found");
    const { password, ...info } = data[0];
    return res.send(info);
  });
});

router.get("/search", function getQueryUsers(req, res) {
  const { gender, city, minAge, maxAge, occupation } = req.query;
  const sql = `SELECT first_name, last_name, id, age, gender, address, state FROM users WHERE gender = ? AND city = ? AND age BETWEEN ? AND ? OR occupation = ?`;

  const values = [gender, city, minAge, maxAge, occupation];

  db.query(sql, values, (err, data) => {
    if (err) return res.status(500).send(err);
    res.send(data);
  });
});

router.get("/", function getUsers(req, res) {
  db.query(`SELECT * FROM users`, (err, data) => {
    if (err) return res.status(500).send(err);
    return res.send(data);
  });
});

router.get("/followers/:id", auth, function followedUsers(req, res) {
  const sql = ` SELECT u.id, u.first_name, u.last_name, u.Pi_id, u.address, u.profilePic
  FROM users u
  INNER JOIN relationships f ON u.id = f.followedUserId
  WHERE f.followerUserId = ?`;

  db.query(sql, [req.params.id], (err, data) => {
    if (err) return res.status(500).send(err);
    res.send(data);
  });
});

router.get("/:city", function getUsersByCity(req, res) {
  const sql = `SELECT * FROM users WHERE city = ?`;

  db.query(sql, [req.params.city], (err, data) => {
    if (err) return res.status(500).send(err);
    res.send(data);
  });
});

router.put("/:id", auth, function updateUser(req, res) {
  const id = req.params.id;
  const {
    email,
    phone,
    city,
    profilePic,
    gender,
    address,
    fullname,
    username,
    birthday,
    bio,
    website,
    state,
    hobby,
    zipcode,
    education,
    coverPic,
  } = req.body;

  const sql = `
  UPDATE users 
  SET email = ?, phone = ?,city = ?, profilePic = ?,
  gender = ?,address = ?,full_name = ?, username = ?,
  birthday = ?, bio = ?,website = ?,state = ?,hobby = ?,
  zip_code = ?, education =?, coverPic = ? WHERE id =?`;

  const values = [
    email,
    phone,
    city,
    profilePic,
    gender,
    address,
    fullname,
    username,
    birthday,
    bio,
    website,
    state,
    hobby,
    zipcode,
    education,
    coverPic,
  ];

  db.query(sql, [...values, id], (err, data) => {
    if (err) return res.status(500).send(err);
    return res.send("User have been updated");
  });
});

module.exports = router;
