const asyncHandler = require("express-async-handler");
const axios = require("axios");

const shareProjectWithTeam = asyncHandler(async (req, res) => {
  try {
    const { projectId } = req.params;
    const { githubRepo, githubAccessToken } = req.body;

    if (!githubRepo || !githubAccessToken) {
      return res
        .status(400)
        .json({ error: "GitHub repo and access token are required." });
    }

    // Fetch collaborators from GitHub
    const collaboratorsResponse = await axios.get(
      `https://api.github.com/repos/${githubRepo}/collaborators`,
      { headers: { Authorization: `Bearer ${githubAccessToken}` } }
    );

    // Extract emails (GitHub hides emails by default, so we assume usernames)
    const members = collaboratorsResponse.data.map((user) => ({
      username: user.login,
      email: user.email || null, // GitHub API may not return email
      role: user.permissions.admin ? "admin" : "collaborator",
    }));

    // Update Firestore
    const projectRef = db.collection("projects").doc(projectId);
    await projectRef.update({ githubRepo, projectMembers: members });

    res.status(200).json({
      message: "GitHub repository linked successfully!",
      githubRepo,
      members,
    });
  } catch (error) {
    console.error("Error linking GitHub repository:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const getUserGithubRepos = asyncHandler(async (req, res) => {
  try {
    const { githubAccessToken } = req.query;

    if (!githubAccessToken) {
      return res
        .status(400)
        .json({ error: "GitHub access token is required." });
    }

    const response = await axios.get("https://api.github.com/user/repos", {
      headers: { Authorization: `Bearer ${githubAccessToken}` },
    });

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

module.exports = { shareProjectWithTeam, getUserGithubRepos };
