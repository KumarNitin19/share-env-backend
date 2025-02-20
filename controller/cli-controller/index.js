const asyncHandler = require("express-async-handler");
const { db } = require("../../firebaseAdmin");

const getAllENVVariables = asyncHandler(async (req, res) => {
  try {
    const { githubUserName, projectId } = req.params; // Extract githubUserName & projectId from the URL

    if (!githubUserName) {
      res.status(403).json({
        error:
          "Github acount not found, please login your github account in vscode.",
      });
    }

    if (!projectId) {
      res.status(404).json({
        error: "Project Id not found, make sure you have varVault.json file.",
      });
    }

    const projectRef = db.collection("projects").doc(projectId);
    const projectDoc = await projectRef.get();

    // Check if the project exists
    if (!projectDoc.exists) {
      return res.status(404).json({ error: "Project not found." });
    }

    const projectData = projectDoc.data();

    if (projectData?.projectMembers.includes(githubUserName)) {
      // Query groups where projectId matches
      const groupsSnapshot = await db
        .collection("groups")
        .where("projectId", "==", projectId)
        .get();

      // Check if any groups exist
      if (groupsSnapshot.empty) {
        return res.status(200).json({ projectId, groups: [] });
      }

      // Extract group data
      const groups = groupsSnapshot.docs.map((doc) => ({
        groupId: doc.id,
        ...doc.data(),
      }));

      // Return response
      res.status(200).json({
        projectId,
        groups,
      });
    } else {
      res.status(403).json({
        error: "You're not authorized/collaborator of this project!!",
      });
    }
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = { getAllENVVariables };
