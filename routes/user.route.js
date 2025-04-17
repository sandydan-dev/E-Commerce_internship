const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// middlewares
const { verifyToken } = require("../middlewres/jwt.middleware");
const authorizeRole = require("../middlewres/role.middleware");

// controllers
const { register, verifyEmail } = require("../controllers/user.controller");

// endpoint : http://localhost:4000/api/v1/user/register
router.post("/register", register);

//* verify email route
//* endpoint http://localhost:4000/verify-email?token=xyz

router.get("/verify-email", verifyEmail);

router.get(
  "/protected",
  verifyToken,
  authorizeRole(["customer"]),
  (req, res) => {
    return res.send("This is protected route");
  }
);

module.exports = router;
