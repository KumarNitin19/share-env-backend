const express = require("express");
const { getAllENVVariables } = require("../../controller/cli-controller");

const router = express.Router();

router.get(
  "/groups/:githubUserName/:projectId/:privateKey",
  getAllENVVariables
);

module.exports = router;
