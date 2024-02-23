// responseHelper.js

function successResponse(
  res,
  statusCode,
  data,
  message = "Success: The request was successful."
) {
  res.status(statusCode).json({
    status: "success",
    data,
    message,
  });
}

function errorResponse(
  res,
  errors,
  message = "Bad request. Please check your input"
) {
  res.status(400).json({
    status: "fail",
    errors,
    message,
  });
}

function notfoundResponse(res, message) {
  res.status(404).json({
    status: "fail",
    message,
  });
}

function serverErrorResponse(res, message = "Internal Server Error") {
  res.status(500).json({
    status: "error",
    message,
  });
}

function unauthorizedResponse(res, message = "Unauthorized, Log in first!") {
  res.status(401).json({
    status: "fail",
    message,
  });
}

module.exports = {
  successResponse,
  errorResponse,
  notfoundResponse,
  serverErrorResponse,
  unauthorizedResponse,
};
