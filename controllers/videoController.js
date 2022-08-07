const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Register new user => api/register
exports.makeVideoCall = catchAsyncErrors(async (req, res, next) => {
  try {
    console.log("video route");

    res.json("hello from video route");
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(error.message, 500));
  }
});
