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

// products controllers
const {
  createSellerProductData,
  getProductData,
  getProductById,
  updateProductData,
  deleteProductData,
  findProductByCategory,
  updateProductStatus,
  filterProducts,
} = require("../controllers/product.controller");

//todo: multple image upload
const sellerProductImg = getMulterFileUpload("uploads/sellerProduct");

//todo: product routes

//* create product
// endpoint : http://localhost:4000/api/v1/products/create
router.post(
  "/create",
  verifyToken, // check if user if logged in
  authorizeRole(["seller", "admin"]), // allow only seller and admin
  sellerProductImg.array("image", 3), // upload seller log imgage
  multerErrorHandler, // handle image upload error
  createSellerProductData // controller to create product
);

//* all product
// endpoint : http://localhost:4000/api/v1/products/data
router.get(
  "/data",
  verifyToken, // check if user if logged in
  authorizeRole(["seller", "admin"]), // allow only seller and admin
  getProductData // controller to create product
);

//* get product id
// endpoint : http://localhost:4000/api/v1/products/data
router.get(
  "/data/:id",
  verifyToken, // check if user if logged in
  authorizeRole(["seller", "admin"]), // allow only seller and admin
  getProductById // controller to get product id
);

// endpoint : http://localhost:4000/api/v1/products/update
router.patch(
  "/update/:id",
  verifyToken, // check if user if logged in
  authorizeRole(["seller", "admin"]), // allow only seller and admin
  sellerProductImg.array("image", 3), // upload seller log imgage
  updateProductData // controller to update product id
);

// delete product data by id
// endpoint : http://localhost:4000/api/v1/products/data
router.delete(
  "/delete/:id",
  verifyToken, // check if user if logged in
  authorizeRole(["seller", "admin"]), // allow only seller and admin
  deleteProductData // controller to create product
);

// find product by category
// endpoint : http://localhost:4000/api/v1/products/category?category?=
router.get(
  "/category",
  verifyToken, // check if user if logged in
  authorizeRole(["seller", "admin"]), // allow only seller and admin
  findProductByCategory // controller to create product
);

// update status for product
// endpoint : http://localhost:4000/api/v1/products/update-status/:id
router.patch(
  "/update-status/:id",
  verifyToken, // check if user if logged in
  authorizeRole(["seller", "admin"]), // allow only seller and admin
  updateProductStatus // controller to create product
);

// endpoint : http://localhost:4000/api/v1/products/search?category=Electronics&minPrice=1000&maxPrice=5000&sort=price_asc
router.get(
  "/update-status/:id",
  verifyToken, // check if user if logged in
  authorizeRole(["seller", "admin"]), // allow only seller and admin
  filterProducts // controller to filter product
);

module.exports = router;
