const Product = require("../models/Product.model.js");
const Order = require("../models/Order.model.js");

const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { products, shippingaddress, paymentmethod } = req.body;

    let totalAmount = 0;
    let updatedProducts = [];

    for (const item of products) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (!item.quantity || typeof item.quantity !== "number") {
        return res
          .status(400)
          .json({ message: "Quantity must be a valid number" });
      }

      if (typeof product.price !== "number") {
        return res.status(500).json({ message: "Product price is invalid" });
      }

      console.log("Price:", product.price, "Quantity:", item.quantity);

      const subtotal = product.price * item.quantity;

      totalAmount += subtotal;

      updatedProducts.push({
        product: item.product,
        quantity: item.quantity,
      });
    }

    console.log("Final Total Amount:", totalAmount); // <- Check this shows a number like 399.98

    const newOrder = new Order({
      customer: userId,
      products: updatedProducts,
      shippingaddress,
      paymentmethod,
      totalAmount, // <== Fix here
    });

    await newOrder.save();

    return res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Error while creating order:", error); // logs actual error in your terminal
    return res.status(500).json({
      message: "Order creation failed",
      error: error.message || "Something went wrong",
    });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ customer: userId })
      .populate("products.product", "title price image") // optional
      .sort({ createdAt: -1 });

    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({ message: "Failed to get orders", error });
  }
};

const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId)
      .populate("products.product", "title price image")
      .populate("customer", "name email"); // optional

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({ order });
  } catch (error) {
    return res.status(500).json({ message: "Failed to get order", error });
  }
};

module.exports = {
  createOrder,
  getUserOrders,getOrderById
};
