const express = require("express");
const authenticateUser = require("../../middleware/privateRoute.middleware");
const { createENVGroup } = require("../../controller/env-group-controller");

const router = express.Router();

router.post("/add-group", authenticateUser, createENVGroup);

module.exports = router;
