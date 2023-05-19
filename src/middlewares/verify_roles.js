exports.isAdmin = (req, res, next) => {
  const { roleCode } = req.user;
  if (roleCode !== "R1") {
    return res.status(401).json({
      err: 1,
      mes: "Require role admin",
    });
  }
  next();
};

// exports.isUser = (req, res, next) => {
//   const { roleCode } = req.user;
//   if (roleCode !== "R2") {
//     return res.status(401).json({
//       err: 1,
//       mes: "Require role user",
//     });
//   }
//   next();
// };
