const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SellerProfile", // who created the product (seller)
      required: true,
    },
    title: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
    },
    stock: {
      type: Number,
      required: [true, "Product stock is required"],
      min: [0, "Stock cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
    },
    subcategory: {
      type: String,
      trim: true,
    },
    brand: {
      type: String,
      default: "Unbranded",
    },
    // array of image url
    image: [
      {
        type: String, // file path or cloud URL
        required: true,
      },
    ],
    status: {
      type: String,
      enum: ["active", "inactive", "discontinued", "out_of_stock"],
      default: "active",
    },
    statusMessage: {
      type: String,
      default: "Product is available and shown to users",
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    // newly created products are pending
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending", // newly created products are pending
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
