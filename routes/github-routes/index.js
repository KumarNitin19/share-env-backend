const express = require("express");
const authenticateUser = require("../../middleware/privateRoute.middleware");
const { getUserGithubRepos } = require("../../controller/github-controller");

const router = express.Router();

router.get("/github-repos/", authenticateUser, getUserGithubRepos);

module.exports = router;
