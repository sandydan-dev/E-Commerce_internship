const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 4000;

// routes-controller...
const userRouter = require("./routes/user.route");

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

// user route
app.use("/api/v1/user", userRouter);

app.listen(PORT, () => {
  console.log(`Listening incomming request on port ${PORT}`);
});
