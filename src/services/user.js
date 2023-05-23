const db = require("../models");

exports.getUser = async (userId) => {
  try {
    const user = await db.User.findOne({
      where: { id: userId },
      attributes: {
        exclude: ["password", "roleId", "refreshToken"],
      },
      include: [
        { model: db.Role, attributes: ["id", "code", "value"] },
      ],
    });
    return {
      message: user ? "Get successfully" : "User not found",
      userData: user,
    };
  } catch (error) {
    throw new Error(error);
  }
};
