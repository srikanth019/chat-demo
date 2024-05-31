require("dotenv").config();
const path = require("path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const connectDb = require("./db/index.js");

require("./auth");

const app = express();

const router = require("./routes/index.js");
const { ioServer } = require("./socket/index.js");

const port = process.env.PORT || 3000;

// Session setup
const sessionMiddleware = session({
  secret: "mySecretKey", // replace with your secret
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
});

// Use session middleware for express
app.use(sessionMiddleware);

app.set("view engine", "ejs");

// Set up the static files middleware
app.use(express.static(path.join(__dirname, "public")));

app.use(passport.initialize());
app.use(passport.session());
app.use(cors({ credentials: true }));

app.use("/", router);
app.get("*", (req, res) => {
  res.render("404");
});

// Use the ioServer function to set up the server and socket.io
const server = ioServer(app, sessionMiddleware);
server.listen(port, () => {
  connectDb();
  console.log(`Server is up on port http://localhost:${port}`);
});

// /req.session/ Session {
//   cookie: {
//     path: '/',
//     _expires: 2024-05-31T07:31:40.030Z,
//     originalMaxAge: 86400000,
//     httpOnly: true
//   },
//   passport: { user: '6655b1db9f86df7889f8351e' }
// }
