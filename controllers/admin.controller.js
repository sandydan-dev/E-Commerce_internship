const SellerProfile = require("../models/SellerProfile.model");

const verifySellerProfile = async (req, res) => {
  try {
    const sellerId = req.params.id; // seller id

    // find seller id
    const seller = await SellerProfile.findById(sellerId);

    // if seller id not found
    if (!seller) {
      return res.status(404).json({ message: "seller not found!" });
    }

    // check if seller already verified
    if (seller.verified) {
      return res.status(400).json({ message: "Seller already verified" });
    }

    // if seller found then set to true
    seller.verified = true; // set to true to verify profile by admin

    // save data to db
    await seller.save(); // save to database

    // return success message
    return res
      .status(200)
      .json({ message: "Seller profile verified successfully", seller });
  } catch (error) {
    // if app taking too much time to load it will throw an error
    res
      .status(500)
      .json({ message: "Failed to verify seller", error: error.message });
  }
};

// get profile is seller is not verified
const sellerNotVerifiedList = async (req, res) => {
  try {
    const unVerifySeller = await SellerProfile.find({ verified: false });

    if (unVerifySeller.length === 0) {
      return res.status(404).json({ message: "No unverified seller found" });
    }

    const sellerRecords = [];

    for (let i = 0; i < unVerifySeller.length; i++) {
      sellerRecords.push({
        id: unVerifySeller[i]._id,
        shopname: unVerifySeller[i].shopname,
        verified: unVerifySeller[i].verified,
      });
    }

    return res.status(200).json({
      message: "Unverify sellers data",
      sellerRecords,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while getting seller data if not verified",
      error,
    });
  }
};

// only verified seller data

const sellerVerifiedList = async (req, res) => {
  try {
    const verifiedSeller = await SellerProfile.find({ verified: true });

    if (!verifiedSeller.length === 0) {
      return res.status(404).json({ message: "Verified seller not found" });
    }

    const sellerRecords = [];

    for (let i = 0; i < verifiedSeller.length; i++) {
      sellerRecords.push({
        id: verifiedSeller[i]._id,
        shopname: verifiedSeller[i].shopname,
        verified: verifiedSeller[i].verified,
      });
    }

    return res
      .status(200)
      .json({ message: "Verified seller data", sellerRecords });
  } catch (error) {
    return res.status(500).json({
      message: "Error while getting seller verified data",
      error,
    });
  }
};

module.exports = {
  verifySellerProfile,
  sellerNotVerifiedList,
  sellerVerifiedList,
};
