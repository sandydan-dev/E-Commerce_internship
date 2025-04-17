const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/mail.util");
const { generateToken } = require("../middlewres/jwt.middleware");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("name", name);
    console.log("email", email);
    console.log("password", password);

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // check if user already exists in db then return error
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res
        .status(400)
        .json({ message: "User already exists, please login instead" });
    }

    // hashed password before save
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user data
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

   
    // generate the token
    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    }); // your custom token logic

    // set token as cookies
    res.cookie("token", token, {
      httpOnly: true, // can't access from JS
      secure: true, // only over HTTPS (false in dev)
      sameSite: "strict", // CSRF protection
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    });

     // Generate random token
     const emailToken = crypto.randomBytes(32).toString("hex");

    // Attach token and expiry to user
    user.emailToken = emailToken;

    // also set token in headers
    res.setHeader("Authorization", `Bearer ${token}`);

    const verificationLink = `http://localhost:4000/api/v1/user/verify-email?token=${emailToken}`;

    const subject = "Welcome! Please Verify Your Email";

    const html = `
        <h2>Hi ${user.name},</h2>
        <p>Thanks for registering!</p>
        <p>Click below to verify your email:</p>
        <a href="${verificationLink}">Verify Email</a>
        <p>If you did not register, ignore this message.</p>
        <br>
        <p>— The Team</p>
      `;

    console.log("📧 Sending email to:", user.email);

    if (!user.email) {
      throw new Error("Email is missing — can't send email.");
    }

    const recipientEmail = user?.email || email;

    if (!recipientEmail) {
      throw new Error("No email address found for user.");
    }

    // mail details for receiver
    await sendEmail({ to: user.email, subject, html });

    const saveUser = await user.save();

    return res.status(201).json({
      message: "User created successfully",
      user: saveUser,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error while creating new user",
      error: error.message,
    });
  }
};

// verify email

const verifyEmail = async (req, res) => {
  const { token } = req.query;  // extract the token from query

  console.log("Received token:", token);


  // check if token is provided
  if (!token) {
    return res
      .status(400)
      .json({ message: "Verification random token is missing" });
  }

  // find the user token
  const user = await User.findOne({
    emailToken: token,
  });

  console.log("Found user:", user);


  if (!user) {
    return res.status(400).json({ message: "Invalid token, token expiered after verified" });
  }

  // update the user status to verified 
  user.isVerified = true; // mark as verified
  user.emailToken = undefined; // remove the token when successfull verification

  // save status to database
  await user.save();

  return res.send("✅ Email verified successfully! You can now log in.");
};

module.exports = {
  register,
  verifyEmail,
};
