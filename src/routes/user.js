const userControllers = require("../controllers/user");
const express = require("express");
const verifyToken = require("../middlewares/verify_token");
const { isAdmin } = require("../middlewares/verify_roles");

const router = express.Router();

// PROTECTED ROUTES
router.use(verifyToken);
router.get("/", userControllers.getCurrentUser);
router.put("/edit-user", userControllers.editUser);

router.use(isAdmin);
router.get("/users", userControllers.getUsers);
router.delete("/delete-user", userControllers.deleteUser);

module.exports = router;
