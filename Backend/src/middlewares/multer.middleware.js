import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp');
  },
  filename: function (req, file, cb) {
    // Safer: add a timestamp to prevent name collision
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});

export const upload = multer({ storage });
