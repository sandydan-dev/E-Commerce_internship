const rateLimit = require("express-rate-limit");

const rateLimiter = rateLimit({
  window: 15 * 60 * 1000, // 15 minutes,max : 10,
  max: 5,
  message: {
    status: 429,
    error: "Too many request",
    message: "You have exceeded the rate limite, please try after some time",
  },
  // customer error
  handler: (req, res, next, options) => {
    res.status(options.message.status).json({
      error: options.message.error,
      message: options.message.message,
      retryAfter: "15 minuts",
    });
  },
});

module.exports = rateLimiter;
