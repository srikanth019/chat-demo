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
    google: {
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
      callbackURL: process.env.host + "/auth/google/callback",
    },
    cloudinary: {
      cloudName: process.env.cloudName,
      apiKey: process.env.apiKey,
      apiSecret: process.env.apiSecret,
    },
  };
} else {
  module.exports = require("./config.js");
}
