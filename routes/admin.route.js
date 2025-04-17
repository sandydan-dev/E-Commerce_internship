const express = require("express");
const router = express.Router();

// middleware
const { verifyToken } = require("../middlewres/jwt.middleware");
const authorizeRole = require("../middlewres/role.middleware");

// admin controller
const {
  verifySellerProfile,
  sellerNotVerifiedList,
  sellerVerifiedList,
} = require("../controllers/admin.controller");

// //todo: verify profile for seller and set to true and get seller by id
// Only admin can verify seller profile
// endpoint : http://localhost:4000/api/v1/admin/verify-seller/:xyzID
router.put(
  "/verify-seller/:id",
  verifyToken,
  authorizeRole(["admin"]),
  verifySellerProfile
);

// endpoint : http://localhost:4000/api/v1/admin/seller-not-verified
router.get(
  "/seller-not-verified",
  verifyToken,
  authorizeRole(["admin"]),
  sellerNotVerifiedList
);

// endpoint : http://localhost:4000/api/v1/admin/seller-verified
router.get(
  "/seller-verified",
  verifyToken,
  authorizeRole(["admin"]),
  sellerVerifiedList
);

module.exports = router;
