const express = require("express");
const db = require("../connect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/register", (req, res) => {
  const sql = `SELECT * FROM users WHERE email = ?`;

  db.query(sql, [req.body.email], (err, data) => {
    if (err) return res.status(500).send(err);
    if (data.length) return res.status(400).send("User already registered");

    const salt = bcrypt.genSaltSync(10);
    const password = bcrypt.hashSync(req.body.password, salt);

    function generateRandomString(length) {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let randomString = "";

      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
      }

      return randomString;
    }
    const randomString = generateRandomString(16);

    const sql =
      "INSERT INTO users (`first_name`, `last_name`, `email`, `phone`, `city`, `country`, `password`, `pi_id`) VALUES (?)";
    const values = [
      req.body.firstname,
      req.body.lastname,
      req.body.email,
      req.body.phone,
      req.body.city,
      req.body.country,
      password,
      randomString,
    ];

    db.query(sql, [values], (err, data) => {
      if (err) return res.status(500).send(err);
      return res.send("User registered successfully");
    });
  });
});
router.post("/login", (req, res) => {
  const sql = `SELECT * FROM users WHERE email = ?`;

  db.query(sql, [req.body.email], (err, data) => {
    if (err) return res.status(500).send(err);
    if (data.length === 0)
      return res.status(404).send("Invalid user or password");

    const isValidPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );
    if (!isValidPassword)
      return res.status(400).send("Invalid user or password");

    const token = jwt.sign(
      {
        id: data[0].id,
        first_name: data[0].first_name,
        last_name: data[0].last_name,
        phone: data[0].phone,
        email: data[0].email,
        city: data[0].city,
        country: data[0].country,
        profilePic: data[0].profilePic,
        coverPic: data[0].coverPic,
        gender: data[0].gender,
        address: data[0].address,
        age: data[0].age,
        full_name: data[0].full_name,
        username: data[0].username,
        bio: data[0].bio,
        education: data[0].education,
        website: data[0].website,
        birthday: data[0].birthday,
        state: data[0].state,
        hobby: data[0].hobby,
        zip_code: data[0].hobby,
        occupation: data[0].occupation,
      },
      "jwtPrivateKey"
    );
    res.header("x-auth-token", token).send(token);
  });
});

module.exports = router;
