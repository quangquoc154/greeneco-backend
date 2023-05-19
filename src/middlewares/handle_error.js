const createError = require("http-errors");

exports.badRequest = (err, res) => {
  const error = createError.BadRequest(err);
  return res.status(error.status).json({
    err: 1,
    mes: error.message,
  });
};

exports.internalServerError = (res) => {
  const error = createError.InternalServerError();
  return res.status(error.status).json({
    err: -1,
    mes: error.message,
  });
};

exports.notFound = (req, res) => {
  const error = createError.NotFound("This route is not defined");
  return res.status(error.status).json({
    err: 1,
    mes: error.message,
  });
};
