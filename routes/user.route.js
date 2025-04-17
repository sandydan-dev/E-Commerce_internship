const express = require("express");
const router = express.Router();
const rateLimiter = require("../middlewres/rateLimit.middleware");

//todo middlewares
const { verifyToken } = require("../middlewres/jwt.middleware");
const authorizeRole = require("../middlewres/role.middleware");

//todo controllers
const {
  register,
  verifyEmail,
  login,
  userDetails,
  logout,
  requestResetPassword,
  resetPassword,
} = require("../controllers/user.controller");

//todo: register new user
//* endpoint : http://localhost:4000/api/v1/user/register
router.post("/register", register);

//todo: verify email route
//* endpoint : http://localhost:4000/verify-email?token=xyz
router.get("/verify-email", verifyEmail);

//todo: login existing user
//* endpoint : http://localhost:4000/api/v1/user/login
router.post("/login", login);

//todo: get all user details, only admin can see users
//* endpoint : http://localhost:4000/api/v1/user/data
router.get(
  "/data",
  rateLimiter,
  verifyToken,
  authorizeRole(["admin"]),
  userDetails
);

//todo: Log Out Route
router.post("/logout", logout);

//todo: Request Password Reset Route
//* endpoint : http://localhost:4000/api/v1/user/forgot-password
router.post("/forgot-password", requestResetPassword);

//todo: after reset link received change  Password, Route
//* endpoint : http://localhost:4000/api/v1/user/reset-password
router.post("/reset-password", resetPassword);

//todo: testing route to check protection
router.get(
  "/protected",
  verifyToken,
  authorizeRole(["customer"]),
  (req, res) => {
    return res.send("This is protected route");
  }
);

module.exports = router;
