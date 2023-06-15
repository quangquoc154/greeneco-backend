const { Op } = require("sequelize");
const db = require("../models");
const bcrypt = require("bcryptjs");
const sendMail = require("../utils/sendMail");

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

exports.editCurrentUser = async (userId, { oldPassword, newPassword, ...body }, res) => {
  try {
    if (oldPassword && newPassword) {
      const user = await db.User.findOne({
        where: { id: userId }
      })
      const isChecked = user && bcrypt.compareSync(oldPassword, user.password);
      if (!isChecked) {
        return res.status(401).json({
          message: "Old Password was incorrect",
        })
      }
      body.password = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(8)); 
    }
    const user = await db.User.update(body, {
      where: { id: userId },
    });
    const status = user[0] === 1 ? 200 : 404;
    return res.status(status).json({
      message: user[0] === 1 ? "Update successfully" : "Has error when update profile",
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
      message: user[0] > 0 ? "Update successfully" : "Has error when update user",
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
      message: user > 0 ? "Delete successfully" : "Has error when delete product",
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

exports.sendContact = async ({ name, email, message }, res) => {
  try {
    const html = `
        <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #f2f2f2; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="text-align: center; color: #7fad39; margin-top: 0;">Email Contact</h2>
        <p style="margin-bottom: 10px;"><strong>Name:</strong> ${name}</p>
        <p style="margin-bottom: 10px;"><strong>Email:</strong> ${email}</p>
        <p style="margin-bottom: 20px;"><strong>Message:</strong> ${message}</p>
        <div style="text-align: right; color: #999999; font-size: 10px;">
          <p style="margin-bottom: 5px; color: #666666;">GreenEco Inc</p>
          <p style="margin-bottom: 5px; color: #666666;">254, Nguyen Van Linh Street,<br/> Thanh Khue District, Da Nang City</p>
          <p style="color: #666666;">Vietnam</p>
        </div>
      </div>
    `
    const rs = await sendMail({
      email: "quangquoc1542002@gmail.com",
      html,
      subject: `Notification: New contact from <${email}>`
    });
    return res.status(200).json({
      message: "Send to email contact successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
};



