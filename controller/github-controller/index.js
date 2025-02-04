const asyncHandler = require("express-async-handler");

const shareProjectWithTeam = asyncHandler(async (req, res) => {
  try {
    const { projectId } = req.params; // Extract projectId from URL
    const { emails } = req.body; // Extract emails from request body

    // Validate input
    if (!Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ error: "Emails array is required." });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emails.filter((email) => !emailRegex.test(email));

    if (invalidEmails.length > 0) {
      return res
        .status(400)
        .json({ error: "Invalid email format", invalidEmails });
    }

    // Reference the project document
    const projectRef = db.collection("projects").doc(projectId);
    const projectDoc = await projectRef.get();

    // Check if the project exists
    if (!projectDoc.exists) {
      return res.status(404).json({ error: "Project not found." });
    }

    // Get existing invited emails (if any)
    const projectData = projectDoc.data();
    const existingInvites = projectData.invitedEmails || [];

    // Merge new and existing emails (avoid duplicates)
    const updatedInvites = [...new Set([...existingInvites, ...emails])];

    // Update the project document with invited emails
    await projectRef.update({ invitedEmails: updatedInvites });

    // Respond with success
    res.status(200).json({
      message: "GitHub users invited successfully!",
      invitedEmails: updatedInvites,
    });
  } catch (error) {
    console.error("Error inviting users:", error);
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
      name: repo.name,
      full_name: repo.full_name,
      url: repo.html_url,
    }));

    res.status(200).json(repos);
  } catch (error) {
    console.error("Error fetching repos:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = { shareProjectWithTeam, getUserGithubRepos };
