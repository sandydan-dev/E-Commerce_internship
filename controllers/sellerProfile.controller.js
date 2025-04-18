const User = require("../models/User.model");
const SellerProfile = require("../models/SellerProfile.model");

// validation
const {
  // sellerCreateProfileValidation,
  sellerUpdateProfileValidation,
} = require("../validation/seller.validation");

const createSellerProfile = async (req, res) => {
  try {
    const { shopname, shopaddress, contactnumber, businessemail, about } =
      req.body;

    const userId = req.user.id; // extract the user id from the role base, in headers or cookies

    const shoplogo = req.file?.path; // extract file upload, file image
    // const imagePaths = req.files.map((file) => file.path); // store file paths
    console.log("Request Body:", req.body); // Logs the non-file fields

    // Log the uploaded file to ensure it's handled correctly
    console.log("Uploaded File:", req.file); // debugging

    console.log("Shop Logo Path:", shoplogo); // Logs the path of the uploaded image

    // validate if data is missing
    if (
      !shopname ||
      !shopaddress ||
      !contactnumber ||
      !businessemail ||
      !shoplogo
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check if seller profile already exists
    const existingUser = await SellerProfile.findOne({ user: userId }); // find user id from the token

    // if user already exist return error
    if (existingUser) {
      return res.status(400).json({ message: "Seller already exists" });
    }

    // create new seller data
    const newSeller = await SellerProfile.create({
      user: userId,
      shopname,
      shopaddress,
      contactnumber,
      businessemail,
      shoplogo,
      about,
    });

    return res.status(201).json({
      message: "Seller profile created successfully",
      seller: newSeller,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create seller profile",
      error: error.message,
    });
  }
};

//* seller can update there whole data
const updateSellerData = async (req, res) => {
  const sellerId = req.params.id;

  const { shopname, shopaddress, contactnumber, businessemail, about } =
    req.body;

  console.log("Update body:", req.body);

  const shoplogo = req.file?.path; // get uploaded file path

  // validation input error check
  const error = sellerUpdateProfileValidation(
    shopname,
    shopaddress,
    contactnumber,
    businessemail,
    shoplogo,
    about
  );

  if (error) {
    return res.status(400).json({
      message: "Seller update validation error",
      error: error.message || error,
    });
  }

  try {
    // find the existing seller
    const seller = await SellerProfile.findById(sellerId);

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    // update seller data
    const updateSeller = await SellerProfile.findByIdAndUpdate(
      sellerId,
      {
        shopname,
        shopaddress,
        contactnumber,
        businessemail,
        shoplogo,
        about,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Seller profile updated successfully",
      seller: updateSeller,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating seller profile",
      error: error,
    });
  }
};

module.exports = {
  createSellerProfile,
  updateSellerData,
};
