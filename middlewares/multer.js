const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    callback(null, `${Date.now()}_${name}`);
  }
});

const fileFilter = (req, file, callback) => {
  if (
    file.mimetype === 'image/gif' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png'
  ) {
    callback(null, true);
  } else {
    // reject file that is not gif, jpeg or png
    callback({ message: 'Unsupported file format' }, false);
  }
};

module.exports = multer({ storage, fileFilter }).single('image');
// 'image' is the fieldname -- the name attribute on the form data
