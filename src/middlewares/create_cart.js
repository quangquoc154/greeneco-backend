const db = require("../models");

const createCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userCart = await db.Cart.findOne({
      where: { userId: userId },
    });
    if (!userCart) {
      await req.user.createCart();
    }
  } catch (error) {
    console.log(error);
  }
  next();
};

module.exports = createCart;
