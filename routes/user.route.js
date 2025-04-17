const express = require("express");
const router = express.Router();

// middlewares
const { verifyToken } = require("../middlewres/jwt.middleware");
const authorizeRole = require("../middlewres/role.middleware");

// controllers
const { register } = require("../controllers/user.controller");

// endpoint : http://localhost:4000/api/v1/user/register
router.post("/register", register);

router.get(
  "/protected",
  verifyToken,
  authorizeRole(["customer"]),
  (req, res) => {
    return res.send("This is protected route");
  }
);

module.exports = router;
