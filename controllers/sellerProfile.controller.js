const User = require("../models/User.model");
const SellerProfile = require("../models/SellerProfile.model");

const createSellerProfile = async (req, res) => {
  try {
    const { shopname, shopaddress, contactnumber, businessemail, about } =
      req.body;

    const userId = req.user.id; // extract the user id from the role base, in headers or cookies

    const shoplogo = req.file?.path; // extract file upload, file image
    // const imagePaths = req.files.map((file) => file.path); // store file paths
    console.log("Request Body:", req.body); // Logs the non-file fields

    // Log the uploaded file to ensure it's handled correctly
    console.log("Uploaded File:", req.file);

    console.log("Shop Logo Path:", shoplogo); // Logs the path of the uploaded image


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

module.exports = {
  createSellerProfile,
};
