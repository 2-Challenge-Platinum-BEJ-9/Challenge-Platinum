function methodNotAllowed(req, res, next) {
  res.status(405).json({
    status: "error",
    message: "Method not supported!",
  });
}

module.exports = { methodNotAllowed };
