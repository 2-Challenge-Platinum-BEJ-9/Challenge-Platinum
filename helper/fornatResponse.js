// responseHelper.js

function successResponse(
  res,
  data,
  message = "Success: The request was successful."
) {
  res.status(200).json({
    status: "success",
    data,
    message,
  });
}

function successCreatedResponse(
  res,
  data,
  message = "Success: The request was created successful."
) {
  res.status(201).json({
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

module.exports = {
  successResponse,
  successCreatedResponse,
  errorResponse,
  notfoundResponse,
  serverErrorResponse,
};
