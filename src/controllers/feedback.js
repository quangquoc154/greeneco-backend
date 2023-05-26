const feedbackService = require('../services/feedback')

const createFeedBack = async (req, res) => {
  try {
    const { rating, comment, prodId } = req.body;
    if (!rating || !comment || !prodId) {
      return res.status(400).json({
        message: "Missing input",
      });
    }
    const response = await feedbackService.createFeedback(req.user, req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const editFeedback = async (req, res) => {
  try {
    const { rating, comment, prodId } = req.body;
    if (!rating || !comment || !prodId) {
      return res.status(400).json({
        message: "Missing input",
      });
    }
    const response = await feedbackService.editFeedback(req.user, req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const deleteFeedback = async (req, res) => {
  try {
    const { prodId } = req.body;
    if (!prodId) {
      return res.status(400).json({
        message: "Missing input",
      });
    }
    const response = await feedbackService.deleteFeedback(req.user, req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getFeedbacks = async (req, res) => {
  try {
    const response = await feedbackService.getFeedbacks(req.query);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
    createFeedBack,
    editFeedback,
    deleteFeedback,
    getFeedbacks
}
