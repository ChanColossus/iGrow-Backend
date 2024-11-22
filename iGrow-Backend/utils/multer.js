const multer = require("multer");
const path = require("path");

module.exports = multer({
  limits: { fieldSize: 50 * 1024 * 1024 },  // File size limit of 50MB
  storage: multer.diskStorage({}),  // Use default disk storage or customize if needed
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("Unsupported file type!"), false);
      return;
    }
    cb(null, true);
  },
}).array('images');  // Expect multiple files with the field name "images"
