const express = require("express");
const router = express.Router();
const rateLimiter = require("../middlewres/rateLimit.middleware");

//todo middlewares
const { verifyToken } = require("../middlewres/jwt.middleware");
const authorizeRole = require("../middlewres/role.middleware");

//todo: multer
const { upload, multerErrorHandler } = require("../utils/fileUpload.util");

// controllers
const {
  createSellerProfile,
} = require("../controllers/sellerProfile.controller");

//todo: seller profile creating
//*  upload.single("logo") || or upload.array("images")
// endpoint : http://localhost:4000/api/v1/seller/profile
router.post(
  "/profile",
  verifyToken, // check if user if logged in
  authorizeRole(["seller", "admin"]), // allow only seller and admin
  upload.single("shoplogo"), // upload seller log imgage
  multerErrorHandler, // handle image upload error
  createSellerProfile // controller to create profile
);

module.exports = router;
