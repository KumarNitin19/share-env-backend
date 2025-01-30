const asyncHandler = require("express-async-handler");
const { db } = require("../../firebase");
const { v4: uuidv4 } = require("uuid");

const createENVGroup = asyncHandler(async (req, res) => {
  try {
    const { projectId, variables, groupName } = req.body;

    // Validate input
    if (
      !projectId ||
      !groupName ||
      !Array.isArray(variables) ||
      variables.length === 0
    ) {
      return res.status(400).json({
        error: "Project ID, group name and variables array are required.",
      });
    }

    // Generate unique group ID
    const groupId = uuidv4();

    // Create group object
    const groupData = {
      groupId,
      groupName,
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

const getENVGroups = asyncHandler(async (req, res) => {
  try {
    const { projectId } = req.params; // Extract projectId from the URL

    // Query groups where projectId matches
    const groupsSnapshot = await db
      .collection("groups")
      .where("projectId", "==", projectId)
      .get();

    // Check if any groups exist
    if (groupsSnapshot.empty) {
      return res
        .status(404)
        .json({ error: "No groups found for this project." });
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

const deleteENVGroup = asyncHandler(async (req, res) => {
  try {
    const { groupId } = req.params; // Extract groupId from URL

    // Reference the group document
    const groupRef = db.collection("groups").doc(groupId);
    const groupDoc = await groupRef.get();

    // Check if the group exists
    if (!groupDoc.exists) {
      return res.status(404).json({ error: "Group not found." });
    }

    // Delete the group
    await groupRef.delete();

    // Respond with success
    res.status(200).json({ message: "Group deleted successfully!" });
  } catch (error) {
    console.error("Error deleting group:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = { createENVGroup, getENVGroups, deleteENVGroup };
