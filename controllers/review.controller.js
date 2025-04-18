const Review = require("../models/Review.model");
const Product = require("../models/Product.model");

const createProductReview = async (req, res) => {
  try {
    const userId = req.user.id; // user id from the url
    const productId = req.params.id; // product it from the url
    const { review, rating } = req.body;

    console.log("user id ", userId);
    console.log("product id ", productId);
    console.log("review", review);
    console.log("rating ", rating);

    // validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 to 5" });
    }

    // check if product exists
    const product = await Product.findById(productId);

    // if product not found
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // if the user already reviews the product
    const existingReview = await Review.findOne({
      product: productId,
      user: userId,
    });

    // if review already exists
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    }

    // create new review
    const newReview = new Review({
      product: productId,
      user: userId,
      rating,
      review,
    });

    await newReview.save(); // save review

    // update the product avg rating
    const reviews = await Review.find({ product: productId });

    // calculate the avarating rating for product which gives by user
    const avgRating =
      reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;

    // update the product of rating in average rating
    await Product.findByIdAndUpdate(productId, { rating: avgRating });

    return res.status(201).json({ message: "Review added", newReview });
  } catch (error) {
    return res.status(500).json({ message: "Failed to add review", error });
  }
};

// get all reivews

const getAllReviewsData = async (req, res) => {
  try {
    const review = await Review.find();

    if (review.length === 0) {
      return res.status(404).json({ message: "No reviews found" });
    }

    return res.status(200).json({ message: "Reviews Data :", reviews: review });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error while getting all reviews", error });
  }
};

// update reviews data

const updateProductReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const reviewId = req.params.id;
    const { review, rating } = req.body;

    // find the user and its review id
    const existingReview = await Review.findOne({
      _id: reviewId,
      user: userId,
    });

    if (!existingReview) {
      return res
        .status(404)
        .json({ message: "Review not found or not authorized" });
    }

    // update the review and rating from the reviews
    existingReview.rating = rating || existingReview.rating;
    existingReview.review = review || existingReview.review;

    // save the review data
    await existingReview.save();

    // update the average rating
    const productId = existingReview.product; // extract the product id from the reivew
    const reviews = await Review.find({ product: productId }); // find the product id

    const avgRating =
      reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length; // up user update the rating it calculte by and update in the product rating

    await Product.findByIdAndUpdate(productId, { rating: avgRating }); // update the rating

    res.status(200).json({ message: "Review updated", review: existingReview });
  } catch (error) {
    res.status(500).json({ message: "Failed to update review", error });
  }
};

const deleteProductReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const reviewId = req.params.id;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review id not found " });
    }

    // user posted the review and rating and only admin can delete it
    if (!review.user.toString() !== userId && req.user.role !== "admin") {
      return res
        .status(401)
        .json({ message: "Not authorize to delete this review" });
    }

    // find the product id
    const productId = review.product;
    //delete the review by admin
    await Review.findByIdAndDelete(review);

    // recalculating the rating
    const reviews = await Review.find({ product: productId }); // find the product id

    //  Recalculate the rating
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length
        : 0;

    // after recalculating the rating , update the update the rating from the product
    await Product.findByIdAndUpdate(productId, { rating: avgRating });

    // return success
    return res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete review", error });
  }
};

module.exports = {
  createProductReview,
  getAllReviewsData,
  updateProductReviews,
  deleteProductReview
};
