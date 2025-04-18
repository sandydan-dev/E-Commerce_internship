const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // set destomation folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique file name
  },
});

// image file filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extName = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true); // accept file
  } else {
    cb(new Error("Only images are allowed (jpeg, jpg, png, webp)")); // reject file
  }
};
// upload multiple images
const getMulterFileUpload = (folder = "uploads") => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, folder);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // unique file name
    },
  });

  // for single image file
  // const sellerUpload = getMulterUploader("uploads/sellers");
  // sellerUpload.single("shoplogo"),

  // for multiple image file
  // const productUpload = getMulterUploader("uploads/products");
  // productUpload.array("images", 5), // up to 5 images

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  });
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // limits of file size under 5MB limit
});

const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err });
  } else if (err) {
    return res.status(500).json({ message: err });
  }
  next();
};

module.exports = { upload, getMulterFileUpload, multerErrorHandler };
