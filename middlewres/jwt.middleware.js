const jwt = require("jsonwebtoken");

require("dotenv").config();

function generateToken(payload) {
  try {
    if (!payload) {
      throw new Error("Payload are required");
    }

    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "1y",
    });
  } catch (error) {
    return { message: "Error while generating token", error: error };
  }
}

function verifyToken(req, res, next) {
  const token =
    req.cookies.token || // <- from cookie
    req.headers.authorization?.split(" ")[1]; // <- from "Bearer <token>" if using headers

  // Debugging log: Check received token
  console.log("Received Token:", token);

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Debugging log: Check decoded token
    console.log("Decoded Token:", decoded);

    req.user = decoded;

    next();
  } catch (error) {
    console.error("Token Verification Error:", error); // Debugging log
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(500).json({ error: "Error while verifying token" });
  }
}

module.exports = {
  generateToken,
  verifyToken,
};
