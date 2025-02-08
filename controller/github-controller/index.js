const asyncHandler = require("express-async-handler");
const axios = require("axios");
const { db } = require("../../firebase");
const { fetchCollaborators } = require("../../utils/githubUtil");

const getUserGithubRepos = asyncHandler(async (req, res) => {
  try {
    const { githubAccessToken } = req.query;

    if (!githubAccessToken) {
      return res
        .status(400)
        .json({ error: "GitHub access token is required." });
    }

    const response = await axios.get(
      "https://api.github.com/user/repos?affiliation=owner",
      {
        headers: { Authorization: `Bearer ${githubAccessToken}` },
      }
    );

    const repos = response.data.map((repo) => ({
      repo_name: repo.name,
      full_name: repo.full_name,
      github_url: repo.html_url,
    }));

    res.status(200).json(repos);
  } catch (error) {
    console.error("Error fetching repos:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const shareProjectWithTeam = asyncHandler(async (req, res) => {
  try {
    const { githubAccessToken, projectId } = req.query;
    const { githubUsername, githubRepo } = req.body;

    if (!githubRepo || !githubAccessToken) {
      return res
        .status(400)
        .json({ error: "GitHub repo and access token are required." });
    }

    // Fetch collaborators from GitHub
    const projectMembers = await fetchCollaborators(
      githubAccessToken,
      githubUsername,
      githubRepo
    );

    const projectRef = db.collection("projects").doc(projectId);
    const projectDoc = await projectRef.get();

    // Check if the project exists
    if (!projectDoc.exists) {
      return res.status(404).json({ error: "Project not found." });
    }

    // Prepare update fields
    const updates = {};
    if (projectMembers?.length) updates.projectMembers = projectMembers;

    updates.updatedAt = new Date(); // Track when the update occurred

    // Update the project in Firestore
    await projectRef.update(updates);

    res.status(200).json({
      message: "GitHub repository linked successfully!",
      githubRepo,
      projectMembers,
    });
  } catch (error) {
    console.error("Error linking GitHub repository:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = { shareProjectWithTeam, getUserGithubRepos };
