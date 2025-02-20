const asyncHandler = require("express-async-handler");

const getAllENVVariables = asyncHandler(async (req, res) => {
  try {
    const { projectId } = req.params; // Extract projectId from the URL

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
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = { getAllENVVariables };
