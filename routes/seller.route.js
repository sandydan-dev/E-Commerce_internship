const express = require("express");
const router = express.Router();
const rateLimiter = require("../middlewres/rateLimit.middleware");


//todo middlewares
const { verifyToken } = require("../middlewres/jwt.middleware");
const authorizeRole = require("../middlewres/role.middleware");

//todo: multer
const { upload, multerErrorHandler, getMulterFileUpload } = require("../utils/fileUpload.util");

// controllers
const {
  createSellerProfile,
  updateSellerData
} = require("../controllers/sellerProfile.controller");

//todo: seller profile creating
//*  upload.single("logo") || or upload.array("images")
// multer file upload
const sellerLogImg = getMulterFileUpload("uploads/sellerLogo")
// endpoint : http://localhost:4000/api/v1/seller/profile
router.post(
  "/profile",
  verifyToken, // check if user if logged in
  authorizeRole(["seller", "admin"]), // allow only seller and admin
  sellerLogImg.single("shoplogo"), // upload seller log imgage
  multerErrorHandler, // handle image upload error
  createSellerProfile // controller to create profile
);


//todo: update seller profile creating
//*  upload.single("logo") || or upload.array("images")
// endpoint : http://localhost:4000/api/v1/seller/update/680165164dd743375d71bf8f
router.put(
  "/update/:id",
  verifyToken, // check if user if logged in
  authorizeRole(["seller", "admin"]), // allow only seller and admin
  sellerLogImg.single("shoplogo"), // upload seller log imgage
  multerErrorHandler, // handle image upload error
  updateSellerData // controller to update profile
);

module.exports = router;
