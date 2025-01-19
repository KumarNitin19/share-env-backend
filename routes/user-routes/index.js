const express = require("express");
const { Login } = require("../../controller/user-controller");

const router = express.Router();

router.get("/signin", Login);
// router.post("/refresh-token");

module.exports = router;
