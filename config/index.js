if (process.env.NODE_ENV === "production") {
  module.exports = {
    host: process.env.host || "",
    dbURI: process.env.dbURI,
    fb: {
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
      callbackURL: process.env.host + "/auth/facebook/callback",
    },
    twitter: {
      consumerKey: process.env.consumerKey,
      consumerSecret: process.env.consumerSecret,
      callbackURL: process.env.host + "/auth/twitter/callback",
      profileFields: ["id", "displayName", "photos", "email"],
    },
  };
} else {
  module.exports = require("./config.js");
}
