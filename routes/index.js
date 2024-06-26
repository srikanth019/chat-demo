const router = require("express").Router();
const passport = require("passport");
const { isAuthenticated } = require("../middleware/auth");
const config = require("../config/config");
const { upload } = require("../utils");

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/rooms",
    failureRedirect: "/",
  })
);

router.get("/auth/facebook", passport.authenticate("facebook"));

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/rooms",
    failureRedirect: "/",
  })
);

router.get("/auth/twitter", passport.authenticate("twitter"));

router.get(
  "/auth/twitter/callback",
  passport.authenticate("twitter", {
    successRedirect: "/rooms",
    failureRedirect: "/",
  })
);

router.get("/", (req, res) => {
  res.render("login", {
    pageHeading: "Welcome to Chat-Cat",
  });
});

router.get("/rooms", isAuthenticated, (req, res) => {
  res.render("rooms", {
    user: req.user,
    host: config.host,
  });
});

router.get("/chat/:id", isAuthenticated, (req, res) => {
  //find the chatroom by id
  const room = req.app.locals.chatRooms.find(
    (room) => room.roomId === req.params.id
  );
  if (!room) {
    return res.render("404");
  }

  res.render("chatroom", {
    user: req.user,
    host: config.host,
    room: room.roomName,
    roomId: room.roomId,
  });
});
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// Handle file upload
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }
  res.json({ success: true, imageUrl: req.file.path });
});

module.exports = router;
