const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
const config = require("../config/config");
const User = require("../models/User");
require("dotenv").config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

const authProcessor = async function (token, tokenSecret, profile, cb) {
  try {
    const user = await User.findOne({ profileId: profile.id });
    if (user) {
      return cb(null, user);
    }

    const newUser = new User({
      profileId: profile.id,
      FullName: profile.displayName,
      profilePicture: profile.photos[0].value,
    });

    await newUser.save();
    return cb(null, newUser);
  } catch (error) {
    return cb(error, null);
  }
};

passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.clientID,
      clientSecret: config.google.clientSecret,
      callbackURL: "/auth/google/callback",
      proxy: true,
    },
    authProcessor
  )
);

passport.use(
  new TwitterStrategy(
    {
      consumerKey: config.twitter.consumerKey,
      consumerSecret: config.twitter.consumerSecret,
      callbackURL: config.twitter.callbackURL,
      includeEmail: true,
    },
    authProcessor
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: config.fb.clientID,
      clientSecret: config.fb.clientSecret,
      callbackURL: config.fb.callbackURL,
      profileFields: ["id", "displayName", "photos", "email"],
    },
    authProcessor
  )
);
