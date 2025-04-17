const mongoose = require("mongoose");

const sellerProfileSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    shopname: {
      type: String,
      required: true,
    },
    shopaddress: {
      type: String,
      required: true,
    },
    contactnumber: {
      type: String,
      required: true,
    },
    businessemail: {
      type: String,
      required: true,
    },
    shoplogo: {
      type: String,
      default: "No image provide",
    },
    about: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false, // admin will approved
    },
  },
  { timestamps: true }
);

const SellerProfile = mongoose.model("SellerProfile", sellerProfileSchema);

module.exports = SellerProfile;

// if (!sellerProfile.verified) {
//   return res
//     .status(403)
//     .json({ message: "Your seller profile is not yet verified." });
// }
