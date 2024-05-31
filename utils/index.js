const crypto = require("crypto");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const config = require("../config/config");

const generateRandomId = () => {
  return crypto.randomBytes(16).toString("hex"); // 16 bytes = 32 hex characters
};

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

// Configure Multer to use Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "chat_uploads", // Folder name in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "gif"], // Allowable file formats
  },
});

const upload = multer({ storage });

module.exports = { generateRandomId, upload };
