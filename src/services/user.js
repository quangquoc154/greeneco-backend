const { Op } = require("sequelize");
const db = require("../models");

exports.getUser = async (userId, res) => {
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
    const status = user ? 200 : 404;
    return res.status(status).json({
      message: user ? "Get successfully" : "User not found",
      userData: user
    })
  } catch (error) {
    throw new Error(error);
  }
};

exports.editUser = async ({ id, ...body }, res) => {
  try {
    const user = await db.User.update(body, {
      where: { id: id },
    });
    const status = user ? 200 : 404;
    return res.status(status).json({
      message: user ? "Update successfully" : "User id not found",
    })
  } catch (error) {
    throw new Error(error);
  }
};

exports.deleteUser = async (id, res) => {
  try {
    const user = await db.User.destroy({
      where: { id: id },
    });
    console.log(user);
    const status = user ? 200 : 404;
    return res.status(status).json({
      message: user ? "Delete successfully" : "User id not found",
    })
  } catch (error) {
    throw new Error(error);
  }
};

exports.getUsers = async ({ page, limit, order, fullName, ...query }, res) => {
  try {
    const queries = {raw: true, nes: true}
    const offset = (!page || +page<=1) ? 0 : (+page - 1)
    if (limit) {
      queries.offset = offset * +limit
      queries.limit = +limit
    }
    if(order) queries.order = [order]
    if(fullName) query.fullName = {[Op.substring]: fullName}

    const users = await db.User.findAll({
      where: query,
      offset: queries.offset,
      limit: queries.limit,
      order: queries.order,
      attributes: {
        exclude: ["password", "roleId", "refreshToken", "createdAt", "updatedAt"],
      },
      include: [
        { model: db.Role, attributes: ["id", "code", "value"] },
      ],
    });
    const status = users ? 200 : 404;
    return res.status(status).json({
      message: users ? "Fetch user successfully" : "No user in database",
      userData: users
    })
  } catch (error) {
    throw new Error(error);
  }
};
