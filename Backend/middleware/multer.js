



const multer = require('multer');
const path = require('path');

// Store files in memory to upload to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowed.includes(ext)) {
    return cb(new Error('Only image files are allowed'), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });
module.exports = upload;

















// const multer = require('multer');

// // Store files in memory to upload to Cloudinary
// const storage = multer.memoryStorage();

// const fileFilter = (req, file, cb) => {
//   const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
//   if (!allowedMimeTypes.includes(file.mimetype)) {
//     return cb(new Error('Only image files are allowed'), false);
//   }
//   cb(null, true);
// };

// const upload = multer({ storage, fileFilter });
// module.exports = upload;

