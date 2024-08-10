const responseHandler = (res, statusCode, message, data = null) => {
  res.status(statusCode).json({
    message,
    data
  });
};

module.exports = responseHandler;
