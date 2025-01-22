const asyncHandler = require("express-async-handler");
const { getUserUid } = require("../../utils/userUtils");
const { v4: uuidv4 } = require("uuid");
const { db } = require("../../firebase");

const createProject = asyncHandler(async (req, res) => {
  try {
    const uid = await getUserUid(req);
    const { projectName, projectDescription } = req.body;

    // Validate the request body
    if (!projectName || !projectDescription) {
      return res.status(400).json({
        error: "projectName, and projectDescription are required.",
      });
    }

    // Check if the user exists
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res
        .status(404)
        .json({ error: "User not found. Please create the user first." });
    }

    const projectId = uuidv4();
    // Add the project to the "projects" collection
    const projectsRef = db.collection("projects");
    const newProject = await projectsRef.doc(projectId).set({
      uid, // Associate the project with the user
      id: projectId,
      projectName,
      projectDescription,
      createdAt: new Date(),
    });

    // Respond with success
    res.status(201).json({
      message: "Project created successfully!",
      projectId: projectId,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const editProject = asyncHandler((req, res) => {});

const deleteProject = asyncHandler((req, res) => {});

const getAllProjects = asyncHandler(async (req, res) => {
  try {
    const uid = await getUserUid(req);
    const projectsRef = db.collection("projects");
    const querySnapshot = await projectsRef.where("uid", "==", uid).get();

    if (querySnapshot.empty) {
      return res
        .status(404)
        .json({ error: "No projects found for this user." });
    }

    const projects = querySnapshot.docs.map((doc) => ({
      projectId: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = { createProject, editProject, deleteProject, getAllProjects };
