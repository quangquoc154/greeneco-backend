exports.isAdmin = (req, res, next) => {
  const { roleId } = req.user;
  if (roleId !== 1) {
    return res.status(401).json({
      err: 1,
      message: "Require role admin",
    });
  }
  next();
};

// exports.isUser = (req, res, next) => {
//   const { roleCode } = req.user;
//   if (roleCode !== "R2") {
//     return res.status(401).json({
//       err: 1,
//       message: "Require role user",
//     });
//   }
//   next();
// };
