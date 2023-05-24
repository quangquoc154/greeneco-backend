const { Op } = require("sequelize");
const db = require("../models");

exports.getUser = async (userId) => {
  try {
    const user = await db.User.findOne({
      where: { id: userId },
      attributes: {
        exclude: ["password", "roleId", "refreshToken", "createdAt", "updatedAt"],
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

exports.editUser = async ({ id, ...body }) => {
  try {
    const user = await db.User.update(body, {
      where: { id: id },
    });
    return {
      message: user ? "Update successfully" : "User id not found",
    };
  } catch (error) {
    throw new Error(error);
  }
};

exports.deleteUser = async (id) => {
  try {
    const user = await db.User.destroy({
      where: { id: id },
    });
    console.log(user);
    return {
      message:
        user > 0 ? "Delete successfully" : "User id not found",
    };
  } catch (error) {
    throw new Error(error);
  }
};

exports.getUsers = async ({ page, limit, order, name, ...query }) => {
  try {
    const queries = {raw: true, nes: true}
    const offset = (!page || +page<=1) ? 0 : (+page - 1)
    const fLimit = +limit || +process.env.LIMIT_PRODUCT
    queries.offset = offset * fLimit
    queries.limit = fLimit
    if(order) queries.order = [order]
    if(name) query.name = {[Op.substring]: name}

    const users = await db.User.findAndCountAll({
      where: query,
      offset: queries.offset,
      limit: queries.limit,
      order: queries.order,
      attributes: {
        exclude: ["password", "roleId", "refreshToken"],
      },
      include: [
        { model: db.Role, attributes: ["id", "code", "value"] },
      ],
    });
    return {
      message: users ? "Fetch user successfully" : "No user in database",
      userData: users
    };
  } catch (error) {
    throw new Error(error);
  }
};
