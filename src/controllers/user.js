const userServices = require("../services/user");

const getCurrentUser = async (req, res) => {
  try {
    const { id } = req.user;
    const response = await userServices.getUser(id);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      err: -1,
      mes: "Internal Server Error",
    });
  }
};

module.exports = {
  getCurrentUser,
};
