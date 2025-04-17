const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

//todo middlewares
const { verifyToken } = require("../middlewres/jwt.middleware");
const authorizeRole = require("../middlewres/role.middleware");

//todo controllers
const {
  register,
  verifyEmail,
  login,
} = require("../controllers/user.controller");

//todo: register new user
//* endpoint : http://localhost:4000/api/v1/user/register
router.post("/register", register);

//todo: verify email route
//* endpoint : http://localhost:4000/verify-email?token=xyz
router.get("/verify-email", verifyEmail);

//todo: login existing user
//* endpoint : http://localhost:4000/api/v1/user/login
router.post("/login", verifyToken, authorizeRole(["customer"]), login);

router.get(
  "/protected",
  verifyToken,
  authorizeRole(["customer"]),
  (req, res) => {
    return res.send("This is protected route");
  }
);

module.exports = router;
