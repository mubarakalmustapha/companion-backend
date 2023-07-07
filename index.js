const express = require("express");
const cors = require("cors");
const auth = require("./routes/auth");
const users = require("./routes/users");
const posts = require("./routes/posts");
const comments = require("./routes/comments");
const likes = require("./routes/likes");
const relationships = require("./routes/relationships");
const enqueries = require("./routes/enqueries");
const messages = require("./routes/messages");
const multer = require("multer");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["PUT, GET, POST, DELETE"],
  })
);
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../frontend/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.json(file.filename);
});

app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/comments", comments);
app.use("/api/likes", likes);
app.use("/api/relationships", relationships);
app.use("/api/enqueries", enqueries);
app.use("/api/messages", messages);

app.listen(5000, () => console.log(`Listening on port ${5000}...`));
