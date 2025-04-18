const express = require("express");
const router = express.Router();
const rateLimiter = require("../middlewres/rateLimit.middleware");

//todo middlewares
const { verifyToken } = require("../middlewres/jwt.middleware");
const authorizeRole = require("../middlewres/role.middleware");

// controllers
const { createOrder, getUserOrders, getOrderById } = require("../controllers/order.controller");

// routes
// endpoint : http://localhost:4000/api/v1/order/create
router.post("/create", verifyToken, createOrder);

// endpoint : http://localhost:4000/api/v1/order/data
router.get("/data", verifyToken, getUserOrders);


// endpoint : http://localhost:4000/api/v1/order/data/:6802aeb89b748c902198feae
router.get("/data/:id", verifyToken, getOrderById);

module.exports = router;
