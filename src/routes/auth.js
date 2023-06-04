const authControllers = require("../controllers/auth");
const express = require("express");

const router = express.Router();

router.post("/register", authControllers.register);

router.post("/login", authControllers.login);

router.post("/forgot-password", authControllers.forgotPassword);

router.post("/reset-password", authControllers.resetPassword);

router.post("/refresh-token", authControllers.refreshTokenCrl);

router.post("/logout", authControllers.logout);

module.exports = router;
