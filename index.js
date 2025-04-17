const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 4000;

// routes-controller...
const userRouter = require("./routes/user.route"); // user
const sellerRouter = require("./routes/seller.route"); // seller
const adminRouter = require("./routes/admin.route");

// connection
const connectDB = require("./config/db.connect");
connectDB();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// routes

app.get("/home", (req, res) => {
  res.send("Test routes");
});

// file upload
app.use("/uploads", express.static("uploads")); // display uploaded images on frontend, preview product images

// user route
app.use("/api/v1/user", userRouter); //todo: user auth

// seller profile route
app.use("/api/v1/seller", sellerRouter); //todo: seller profile

app.use("/api/v1/admin", adminRouter);

app.listen(PORT, () => {
  console.log(`Listening incomming request on port ${PORT}`);
});
