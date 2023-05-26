const feedbackControllers = require("../controllers/feedback");
const express = require("express");
const verifyToken = require("../middlewares/verify_token");
const { isAdmin } = require("../middlewares/verify_roles");

const router = express.Router();

router.get("/feedbacks", feedbackControllers.getFeedbacks);
// PROTECTED ROUTES
router.use(verifyToken);
router.post("/create-feedback", feedbackControllers.createFeedBack);
router.put("/edit-feedback", feedbackControllers.editFeedback);
router.delete("/delete-feedback", feedbackControllers.deleteFeedback);

module.exports = router;
