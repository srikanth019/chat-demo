const crypto = require("crypto");
const generateRandomId = () => {
  return crypto.randomBytes(16).toString("hex"); // 16 bytes = 32 hex characters
};

module.exports = { generateRandomId };
