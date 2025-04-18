const express = require("express");
const router = express.Router();
const rateLimiter = require("../middlewres/rateLimit.middleware");

//todo middlewares
const { verifyToken } = require("../middlewres/jwt.middleware");
const authorizeRole = require("../middlewres/role.middleware");

//todo: multer
const {
  upload,
  getMulterFileUpload,
  multerErrorHandler,
} = require("../utils/fileUpload.util");

// controllers
const {
  createProductReview,
  getAllReviewsData,
  updateProductReviews,
  deleteProductReview
} = require("../controllers/review.controller");

// routes
//todo: create new routes
// endpoint : http://localhost:4000/api/v1/reviews/create/68023a04aabab65670c930fc
router.post(
  "/create/:id",
  verifyToken,
  authorizeRole(["customer", "admin"]),
  createProductReview
);

//todo : get all reviews data
// endpoint : http://localhost:4000/api/v1/reviews/data
router.get(
  "/data",
  verifyToken,
  authorizeRole(["customer", "admin"]),
  getAllReviewsData
);

//todo : update reviews data
// endpoint : http://localhost:4000/api/v1/reviews/update/:id
router.patch(
  "/update/:id",
  verifyToken,
  authorizeRole(["customer", "admin"]),
  updateProductReviews
);

//todo : delete reviews data
// endpoint : http://localhost:4000/api/v1/reviews/delete/:id
router.delete(
  "/delete/:id",
  verifyToken,
  authorizeRole(["customer", "admin"]),
  deleteProductReview
);

module.exports = router;
