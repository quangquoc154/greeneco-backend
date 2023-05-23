const authControllers = require("../controllers/auth");
const express = require("express");

const router = express.Router();

router.post("/register", authControllers.register);

router.post("/login", authControllers.login);

router.post("/refresh-token", authControllers.refreshTokenCrl);

module.exports = router;
