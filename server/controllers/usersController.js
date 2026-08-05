const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { sendError, sendFailure, sendSuccess } = require("../utils/apiResponse");

const registerUser = async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return sendFailure(res, "User already exists", undefined, 200);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    const newUser = new User(req.body);
    await newUser.save();

    sendSuccess(res, "User created successfully");
  } catch (error) {
    sendError(res, error);
  }
};

const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return sendFailure(res, "User does not exist", undefined, 200);
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return sendFailure(res, "Invalid password", undefined, 200);
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    sendSuccess(res, "User logged in successfully", token);
  } catch (error) {
    sendError(res, error);
  }
};

const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    sendSuccess(res, "User info fetched successfully", user);
  } catch (error) {
    sendError(res, error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserInfo,
};
