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

const getAllENVGroups = asyncHandler(async (req, res) => {
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

const updateENVGroup = asyncHandler(async (req, res) => {
  try {
    const { groupId } = req.params; // Extract groupId from the URL
    const { groupName, variables } = req.body; // Extract fields to update

    // Validate input
    if (!groupName && (!Array.isArray(variables) || variables.length === 0)) {
      return res.status(400).json({
        error:
          "At least one field (groupName or variables) is required to update.",
      });
    }

    // Reference the group document
    const groupRef = db.collection("groups").doc(groupId);
    const groupDoc = await groupRef.get();

    // Check if the group exists
    if (!groupDoc.exists) {
      return res.status(404).json({ error: "Group not found." });
    }

    // Build update object
    const updatedFields = {};
    if (groupName) updatedFields.groupName = groupName;
    if (Array.isArray(variables) && variables.length > 0)
      updatedFields.variables = variables;
    updatedFields.updatedAt = new Date(); // Add updatedAt timestamp

    // Update the group
    await groupRef.update(updatedFields);

    // Respond with success
    res.status(200).json({
      message: "Group updated successfully!",
      group: { ...updatedFields },
    });
  } catch (error) {
    console.error("Error updating group:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = {
  createENVGroup,
  getAllENVGroups,
  updateENVGroup,
  deleteENVGroup,
};
