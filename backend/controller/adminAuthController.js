const User = require("../model/userModel");
const AppError = require("../utils/appError");
const { createSendToken } = require("../utils/authHelper");
const catchAsync = require("../utils/catchAsync");

exports.adminLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const admin = await User.findByEmail(email);

  if (!admin || admin.role !== "admin") {
    return next(new AppError("Invalid admin credentials", 401));
  }

  const isCorrect = await User.correctPassword(password, admin.password);

  if (!isCorrect) {
    return next(new AppError("Invalid admin credentials", 401));
  }

  createSendToken(admin, 200, res, "Admin login successful");
});
