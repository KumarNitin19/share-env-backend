const express = require("express");
const authenticateUser = require("../../middleware/privateRoute.middleware");
const {
  getUserGithubRepos,
  shareProjectWithTeam,
} = require("../../controller/github-controller");

const router = express.Router();

router.get("/github-repos/", authenticateUser, getUserGithubRepos);
router.post("/link-github-repo/", authenticateUser, shareProjectWithTeam);

module.exports = router;
