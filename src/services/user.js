const db = require("../models");

exports.getUser = async (userId) => {
  try {
    const user = await db.User.findOne({
      where: { id: userId },
      attributes: {
        exclude: ["password", "role_code"],
      },
      include: [
        { model: db.Role, as: "roleData", attributes: ["id", "code", "value"] },
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
