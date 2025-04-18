const {
  createSellerProfile,
  updateSellerData,
} = require("../controllers/sellerProfile.controller");

function sellerCreateProfileValidation() {}

function sellerUpdateProfileValidation(
  shopname,
  shopaddress,
  contactnumber,
  businessemail,
  shoplogo,
  about
) {
  // shopname validation
  if (!shopname || typeof shopname !== "string") {
    return "shopname is required and should be string";
  }

  // shopaddres validation
  if (!shopaddress || typeof shopaddress !== "string") {
    return "shopaddres is required and should be string";
  }

  // contactnumber validation
  if (!contactnumber || typeof contactnumber !== "string") {
    return "contactnumber is required and should be string";
  }

  // businessemail validation
  if (!businessemail || typeof businessemail !== "string") {
    return "businessemail is required and should be string";
  }

  // shoplogo validation
  if (!shoplogo || typeof shoplogo !== "string") {
    return "shoplogo is required and should be a image";
  }

  // about validation
  if (!about || typeof about !== "string") {
    return "about is required and should be string";
  }

  return null;
}

module.exports = {
//   sellerCreateProfileValidation,
  sellerUpdateProfileValidation,
};
