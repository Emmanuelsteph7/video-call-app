const ErrorHandler = require("../utils/errorHandler");

// Error middleware
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  if (process.env.NODE_ENV?.toLowerCase() === "production") {
    let error = { ...err };

    // Wrong Mongoose Object ID Error - CastError
    // Cast Error occurs when req.params.id length is either greater or lesser than the id in the database
    if (err.name === "CastError") {
      const msg = `Resource not found. Invalid ${err.path}`;
      error = new ErrorHandler(msg, 400);
    }

    // Handle mongoose validation error - ValidationError
    // Validation error occurs when there is a missing required field in the req.body
    if (err.name === "ValidationError") {
      let errors = err.errors;
      let message = [];
      let displayedMsgs = [];
      for (const msg in errors) {
        message.push(errors[msg]);
      }
      if (message) {
        message.forEach((obj) => {
          displayedMsgs.push(obj.message);
        });
      }

      error = new ErrorHandler(displayedMsgs, 400);
    }

    // This kind of error occurs when there is a duplicate
    // for instance, during registration, when the same username or email is already registered
    // the error code is usually 11000
    // Object.keys(err.keyValue) returns the name of the duplicate value eg, email etc
    if (err.code === 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
      error = new ErrorHandler(message, 400);
    }

    // Handling wrong JWT error
    if (err.name === "JsonWebTokenError") {
      const message = "JSON Web Token is invalid. Try Again!!!";
      error = new ErrorHandler(message, 400);
    }

    // Handling Expired JWT error
    if (err.name === "TokenExpiredError") {
      const message = "JSON Web Token is expired. Try Again!!!";
      error = new ErrorHandler(message, 400);
    }

    res.status(error.statusCode).json({
      success: false,
      errMessage: error.message || err.message || "Internal Server Error",
    });
  }

  if (process.env.NODE_ENV === "DEVELOPMENT") {
    res.status(err.statusCode).json({
      success: false,
      error: err,
      errMessage: err.message,
      stack: err.stack,
    });
  }
};
