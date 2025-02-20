const express = require("express");
const { getAllENVVariables } = require("../../controller/cli-controller");

const router = express.Router();

router.get("/groups/:projectId", authenticateUser, getAllENVVariables);

module.exports = router;
