const asyncHandler = require("express-async-handler");
const { db } = require("../../firebase");
const { v4: uuidv4 } = require("uuid");

const createENVGroup = asyncHandler(async (req, res) => {
  try {
    const { projectId, variables } = req.body;

    // Validate input
    if (!projectId || !Array.isArray(variables) || variables.length === 0) {
      return res
        .status(400)
        .json({ error: "Project ID and variables array are required." });
    }

    // Generate unique group ID
    const groupId = uuidv4();

    // Create group object
    const groupData = {
      groupId,
      projectId,
      variables,
      createdAt: new Date(),
    };

    // Store group in Firestore
    await db.collection("groups").doc(groupId).set(groupData);

    // Respond with success
    res.status(201).json({
      message: "Group created successfully!",
      group: groupData,
    });
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = { createENVGroup };
