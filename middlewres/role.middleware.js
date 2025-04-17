const jwt = require("jsonwebtoken");
require("dotenv").config();

function authorizeRole(authRole) {
  return (req, res, next) => {
    console.log("🧾 req.user in authorizeRole:", req.user); // <-- Debug here

    if (!req.user || !authRole.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "You don have permmision, to access this page" });
    }
    next();
  };
}

module.exports = authorizeRole;
