const { Op } = require("sequelize");
const db = require("../models");
const bcrypt = require("bcryptjs");

exports.getCurrentUser = async (userId, res) => {
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

exports.editCurrentUser = async (userId, { olePassword, newPassword, ...body }, res) => {
  try {
    if (olePassword && newPassword) {
      const user = await db.User.findOne({
        where: { id: userId }
      })
      const isChecked = user && bcrypt.compareSync(olePassword, user.password);
      if (!isChecked) {
        return res.status(401).json({
          message: "Ole Password was incorrect",
        })
      }
      body.password = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(8)); 
    }
    const user = await db.User.update(body, {
      where: { id: userId },
    });
    const status = user[0] === 1 ? 200 : 404;
    return res.status(status).json({
      message: user[0] === 1 ? "Update successfully" : "User id not found",
    })
  } catch (error) {
    throw new Error(error);
  }
};

exports.editUser = async (userId, body, res) => {
  try {
    const user = await db.User.update(body, {
      where: { id: userId },
    });
    const status = user[0] > 0 ? 200 : 404;
    return res.status(status).json({
      message: user[0] > 0 ? "Update successfully" : "User id not found",
    })
  } catch (error) {
    throw new Error(error);
  }
};

exports.deleteUser = async (userId, res) => {
  try {
    const user = await db.User.destroy({
      where: { id: userId },
    });
    console.log(user);
    const status = user > 0 ? 200 : 404;
    return res.status(status).json({
      message: user > 0 ? "Delete successfully" : "User id not found",
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
    if(fullName) query.fullName = {[Op.iLike]: `${fullName}%`}

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
