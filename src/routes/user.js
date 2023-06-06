const userControllers = require("../controllers/user");
const express = require("express");
const verifyToken = require("../middlewares/verify_token");
const { isAdmin } = require("../middlewares/verify_roles");

const router = express.Router();

router.post("/send-contact", userControllers.sendContact);

// PROTECTED ROUTES
router.use(verifyToken);
router.get("/", userControllers.getCurrentUser);
router.put("/edit-profile", userControllers.editCurrentUser);

router.use(isAdmin);
router.put("/edit-user/:userId", userControllers.editUser);
router.get("/users", userControllers.getUsers);
router.delete("/delete-user", userControllers.deleteUser);

module.exports = router;
