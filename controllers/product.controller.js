const Product = require("../models/Product.model");
const SellerProfile = require("../models/SellerProfile.model");

// create product controller
const createSellerProductData = async (req, res) => {
  try {
    // extract the user id from token
    const userId = req.user.id;

    // find user
    const seller = await SellerProfile.findOne({ user: userId });

    // if not found the user throw the error
    if (!seller) {
      return res.status(404).json({ message: "User not found" });
    }

    // if seller profile is verified then seller can create product if not verified then error occured.
    if (!seller.verified) {
      return res
        .status(403)
        .json({ message: "Seller not verified, to add the product" });
    }

    const { title, description, price, stock, category, subcategory, status } =
      req.body;

    // validation
    if (
      !title ||
      !description ||
      !price ||
      !stock ||
      !category ||
      !subcategory ||
      !status
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // validate image
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one product image is required" });
    }

    // handle multiple image uploads
    const imagePaths = req.files.map((file) => file.path);

    // create new product
    const newProduct = await Product.create({
      seller: seller._id,
      title,
      description,
      price,
      stock,
      category,
      subcategory,
      image: imagePaths,
      status: status || "active",
    });

    await newProduct.save();

    return res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ message: "Failed to create product", error });
  }
};

// get all product data
const getProductData = async (req, res) => {
  try {
    const product = await Product.find().populate("seller", "shopname");

    if (product.length === 0) {
      return res.status(404).json({ message: "Products not found" });
    }

    return res.status(200).json({ message: "Product list", product });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error });
  }
};

// get product by id
const getProductById = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Invalid product ID format" });
    }

    return res.status(200).json({ message: "Product Id", product });
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
  }
};

// update product data by id
const updateProductData = async (req, res) => {
  try {
    const id = req.params.id;
    const productData = req.body;

    console.log("Updating product with data:", productData);

    const product = await Product.findByIdAndUpdate(id, productData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res
      .status(200)
      .json({ message: "Product updated", product: product });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error });
  }
};

// delete product data by id

const deleteProductData = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product id not found" });
    }

    return res.status(200).json({ message: "Product deleted", product });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error while delete product data", error });
  }
};

// find product by category

const findProductByCategory = async (req, res) => {
  try {
    const category = req.query.category;

    const productCatory = await Product.find(category);

    if (productCatory.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this category" });
    }

    return res
      .status(200)
      .json({ message: "Products found", category: productCatory });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching products by category",
      error,
    });
  }
};

// update product by status

const updateProductStatus = async (req, res) => {
  try {
    const status = req.body;
    const productId = req.params.id;

    // find the product and update
    const updateStatus = await Product.findByIdAndUpdate(productId, status, {
      new: true,
      runValidators: true,
    });

    if (!updateStatus) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res
      .status(200)
      .json({ message: "Product status updated", product: updateStatus });
  } catch (error) {
    console.error("Error while updating product status:", error);

    return res
      .status(500)
      .json({ message: "Error while Product status updated", error: error });
  }
};

// advanced filter product

const filterProducts = async (req, res) => {
  try {
    // extract query from the url
    const {
      keyword, // search in product title
      category, // filter by category
      subcategory, // filter by subcategory
      brand, //   filter by brand
      minprice, // minimum price filter
      maxprice, // maximum price filter
      minrating, // minmum rating filter
      instock, // filter instock products only
      status, // product status
      sort, // soring option (price asc/desc, rating, latest)
    } = req.query;

    // create a filter object to store all mongodbd filter
    let filter = {};

    // search product title by keyword (case-insensitive)
    if (keyword) {
      filter.title = { $regex: keyword, $options: "i" }; // Explanation: $regex searches text pattern, "i" makes it case-insensitive
    }

    // filter by category
    if (category) {
      filter.category = category;
    }

    // filter by subcategory
    if (subcategory) {
      filter.subcategory = subcategory;
    }

    // filter by brand
    if (brand) {
      filter.brand = brand;
    }

    // filter by price range (minprice to maxprice)
    if (minprice || maxprice) {
      filter.price = {};
      if (minprice) {
        filter.price.$gte = parseFloat(minprice); // $gte = greater than equal to
      }
      if (maxprice) {
        filter.price.$lte = parseFloat(maxprice); // $lte = less than equal to
      }
    }

    // filter by minrating
    if (minrating) {
      filter.rating = { $gte: parseFloat(minrating) };
    }

    // only show products which is in stock or greater than 0
    if (instock === "true") {
      filter.stock = { $gt: 0 };
    }

    // filter by status
    if (status) {
      filter.status = status;
    }

    // Define sorting options based on user query
    let sortOption = {};

    if (sort === "price_asc") {
      sortOption.price = 1; // Sort price low to high
    } else if (sort === "price_desc") {
      sortOption.price = -1; // Sort price high to low
    } else if (sort === "rating") {
      sortOption.rating = -1; // Highest rated first
    } else if (sort === "latest") {
      sortOption.createdAt = -1; // Newest products first
    }

    // Fetch products using the filter and sorting
    const products = await Product.find(filter).sort(sortOption);

    // Send the filtered product list in response
    return res.status(200).json({
      message: "Filtered products list",
      total: products.length,
      products,
    });
  } catch (error) {
    // Handle unexpected errors
    return res.status(500).json({
      message: "Error while filtering products",
      error,
    });
  }
};

// GET /api/v1/products/search?category=Electronics&minPrice=1000&maxPrice=5000&sort=price_asc


module.exports = {
  createSellerProductData,
  getProductData,
  getProductById,
  updateProductData,
  deleteProductData,
  findProductByCategory,
  updateProductStatus,
  filterProducts
};

// Summary of Product Management Features to Implement Next:
// Product lifecycle management (status, stock tracking). ✅

// Product review and rating system. ✅

// Advanced filtering and search for products. ✅

// Product approval process for admin to moderate content. 📌

// Bulk product management (upload, update).

// Reporting and exporting product data.

// Admin dashboard for monitoring and managing products.

// Third-party integrations for shipping, payment, etc.

// Tracking product changes via audit logs.
