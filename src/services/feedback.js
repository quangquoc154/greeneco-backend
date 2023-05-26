const { Op } = require("sequelize");
const db = require("../models");

const createFeedback = async (user, { rating, comment, prodId }) => {
  try {
    const feedback = await user.createFeedback({
        rating: rating,
        comment: comment,
        prodId: prodId
    })
    return {
        message: feedback ? "Create feedback successfully" : "Has error when create feedback",
    }
  } catch (error) {
    throw new Error(error);
  }
};

const editFeedback = async (user, { rating, comment, prodId }) => {
  try {
    const feedback = await db.Feedback.findOne({
      where: { prodId: prodId, userId: user.id }
    })
    if(feedback) {
      feedback.rating = rating;
      feedback.comment = comment;
    }
    await feedback.save();
    return {
        message: feedback ? "Update feedback successfully" : "Has error when update feedback",
    }
  } catch (error) {
    throw new Error(error);
  }
};

const deleteFeedback = async (user, { prodId }) => {
  try {
    const feedback = await db.Feedback.findOne({
      where: { prodId: prodId, userId: user.id }
    })
    if(feedback) {
      await feedback.destroy();
    }
    return {
        message: feedback ? "Delete feedback successfully" : "Has error when delete feedback",
    }
  } catch (error) {
    throw new Error(error);
  }
};

const getFeedbacks = async ({ page, limit, order, rating, ratingGte, ratingLte, ...query }) => {
  try {
    const queries = {raw: true, nes: true}
    const offset = (!page || +page<=1) ? 0 : (+page - 1)
    const fLimit = +limit || +process.env.LIMIT_PRODUCT
    queries.offset = offset * fLimit
    queries.limit = fLimit
    if(order) queries.order = [order]
    if(rating) query.rating = {[Op.substring]: rating}
    if(ratingGte && ratingLte ) query.rating = {[Op.between]: [ratingGte, ratingLte]}


    const feedback = await db.Feedback.findAndCountAll({
      where: query,
      offset: queries.offset,
      limit: queries.limit,
      order: queries.order,
      attributes: {
        exclude: ["userId", "prodId"],
      },
      include: [
        { model: db.Role, attributes: ["id", "code", "value"] },
      ],
      include: [
        { model: db.User, attributes: ["fullname", "email", "createdAt", "updatedAt"] },
        { model: db.Product, attributes: ["title", "price", "imageUrl", "dateOfManufacture"] },
      ],
    });
    return {
      message: feedback ? "Fetch feedback successfully" : "No feedback in database",
      feedbackData: feedback
    };
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
    createFeedback,
    editFeedback,
    deleteFeedback,
    getFeedbacks
}
