const methodNotAllowed = (req, res, next) => {
  try {
    throw new Error("Method not supported!");
  } catch (error) {
    res.status(405).json(error.message);
  }
};

// const internalServerError = (err, req, res, next) => {
//   res.status(500).json({ error: err.message });
// };

module.exports = { methodNotAllowed };
