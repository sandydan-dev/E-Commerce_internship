const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/mail.util");
const { generateToken } = require("../middlewres/jwt.middleware");

//* Register new user
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body; // get data from form body

    // validation before seeding data
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
    const salt = await bcrypt.genSalt(10); // generate random number
    const hashedPassword = await bcrypt.hash(password, salt); // update password into hashed

    const userRole = role || "customer"; // Default to 'customer' if no role is provided

    // create new user data
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: userRole,
    });

    // Generate random token for email verification
    const emailToken = crypto.randomBytes(32).toString("hex");

    // Attach token and expiry to user
    user.emailToken = emailToken; // add random token

    // generate link to email verification
    const verificationLink = `http://localhost:4000/api/v1/user/verify-email?token=${emailToken}`;

    const subject = `Welcome! ${user.name} Please Verify Your Email`;

    const html = `
        <h2>Hi ${user.role} : ${user.name},</h2>
        <p>Thanks for registering!</p>
        <p>Click below to verify your email:</p>
        <a href="${verificationLink}">Verify Email</a>
        <p>If you did not register, ignore this message.</p>
        <br>
        <p>— The Team</p>
      `;

    console.log("📧 Sending email to:", user.email); // debugging to check sending emial

    // if email missing
    if (!user.email) {
      throw new Error("Email is missing — can't send email.");
    }

    const recipientEmail = user?.email || email;

    if (!recipientEmail) {
      throw new Error("No email address found for user.");
    }

    // send email details for receiver
    await sendEmail({ to: user.email, subject, html });

    // save user data to database
    const saveUser = await user.save();

    // return if all things are good
    return res.status(201).json({
      message: "User created successfully",
      user: saveUser,
    });
  } catch (error) {
    console.log(error);
    // if there is an error while seeding data, then return error and register again
    return res.status(500).json({
      message: "Error while creating new user",
      error: error.message,
    });
  }
};

//* verify email
const verifyEmail = async (req, res) => {
  const { token } = req.query; // extract the random token from query

  console.log("Received token:", token); // debugging token

  // check if token is not provided
  if (!token) {
    return res
      .status(400)
      .json({ message: "Verification random token is missing" });
  }

  // find the user token
  const user = await User.findOne({
    emailToken: token,
  });

  console.log("Found user:", user); // debugging user if found

  // if random token not found
  if (!user) {
    return res
      .status(400)
      .json({ message: `Invalid token, token expiered after verified` });
  }

  // update the user status to verified
  user.isVerified = true; // mark as verified
  user.emailToken = undefined; // remove the token from database after successfully verification

  // save status to database
  await user.save();

  // return success
  return res.send(
    `✅ ${user.role} : Email verified successfully!, ${user.name} You can now log in. `
  );
};

// login existing user
const login = async (req, res) => {
  try {
    const { email, password } = req.body; // extract the data from the database if user register

    // validation for both fields
    if (!email || !password) {
      return res.status(400).json({ message: "Both field are required" });
    }

    // find email if exists
    const user = await User.findOne({ email });

    // if user details not found, throw an error and register first
    if (!user) {
      return res
        .status(404)
        .json({ message: "user not found, please register first" });
    }

    // compare the hashed password
    const isMatch = await bcrypt.compare(password, user.password); // this.password check the password from the database

    // if password not matched throw an error
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    // generate the token and extract the neccessary data
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

    // also set token in headers
    res.setHeader("Authorization", `Bearer ${token}`);

    // return success if credentials matched
    return res.status(200).json({
      message: "User logged in success",
      user,
      token,
    });
  } catch (error) {
    // return error if server is down
    return res.status(500).json({ message: "Error while login ", error });
  }
};

// get all user details
const userDetails = async (req, res) => {
  try {
    const user = await User.find();

    if (user.length === 0) {
      return res.status(404).json({ message: "User details not found" });
    }

    return res
      .status(200)
      .json({ message: "List of user details", count: user.length, user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error while getting user details", error });
  }
};

// logout
const logout = async (req, res) => {
  try {
    // Clear the cookie containing the token
    res.clearCookie("token", {
      httpOnly: true, // Prevent access to cookie via JavaScript
    });
    // Send success response
    return res.status(200).json({ message: "Successfully logged out" });
  } catch (error) {
    // If an error occurs, log the error and send a failure response
    console.error("Error while logging out:", error);
    return res.status(500).json({ message: "An error occurred during logout" });
  }
};

// reset request password
const requestResetPassword = async (req, res) => {
  // extract the email from the body
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "user email not found" });
    }

    // generate a reset password token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // store token in the emailToken
    user.emailToken = resetToken;

    // save to database
    await user.save();

    // send password reset link with the token
    const resetLink = `http://localhost/api/v1/user/reset-password?token=${resetToken}`;
    const subject = "Password Reset Request";
    const html = `
                <h1> Hello ${user.name}, </h1>
                <p>You requested a password reset. Please click the link below to reset your password:</p>
                <a href="${resetLink}">Reset Password</a>
                <br>
                <p>If you did not request a password reset, please ignore this email. </p>
                 `;

    await sendEmail({ to: user.email, subject, html });

    return res
      .status(200)
      .json({ message: "Password reset link has been sent to email", token : resetToken });
  } catch (error) {
    console.error("Error in password reset request:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// reset password
const resetPassword = async (req, res) => {
  const { token } = req.query; // extract the token from the query parameter
  const { newPassword } = req.body; // adding new password from the body

  try {
    // is toke is not provided
    if (!token) {
      return res.status(400).json({ message: "Reset token is missing" });
    }

    // find user by email token
    const user = await User.findOne({
      emailToken: token,
    });

    // if user already reset password then return error
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid token, generate new link" });
    }

    // hashed the password before save
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(newPassword, salt);

    user.password = hashPass;
    user.emailToken = undefined; // clear the reset token after change the password

    // save to database
    await user.save();

    return res
      .status(200)
      .json({ message: "Password has been successfully reset" });
  } catch (error) {
    console.error("Error in resetting password:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  register,
  verifyEmail,
  login,
  userDetails,
  logout,
  requestResetPassword, // request for generate link to reset password
  resetPassword, // after link received change the passwords
};
