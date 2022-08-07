const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");

// Check if user is authenticated or not
// then, stores the user in req.user
exports.isAuthenticatedCookies = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Login to access this resource", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);

  next();
});

// Check if user is authenticated or not
// then, stores the user in req.user
exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { authorization } = req.headers;
  let token;

  if (authorization) {
    token = authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorHandler("Login to access this resource", 401));
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return next(new ErrorHandler("jwt expired", 401));
  }

  try {
    const user = await User.findById(decoded.id);

    if (user) {
      req.user = user;
      next();
    } else {
      return next(new ErrorHandler("User not found", 400));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Handling user roles
// This middleware is used to restrict access based on roles => user or admin
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role (${req.user.role}) is not allowed to access this resource`,
          403
        )
      );
    }

    next();
  };
};
