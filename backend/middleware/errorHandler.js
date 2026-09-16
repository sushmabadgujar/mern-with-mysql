const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({ message: "Email already exists." });
  }

  return res.status(500).json({
    message: "Internal server error."
  });
};

module.exports = errorHandler;
