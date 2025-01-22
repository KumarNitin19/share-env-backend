const asyncHandler = require("express-async-handler");
const { getUserUid } = require("../../utils/userUtils");
const { db } = require("../../firebase");

const createProject = asyncHandler((req, res) => {});

const editProject = asyncHandler((req, res) => {});

const deleteProject = asyncHandler((req, res) => {});

const getAllProjects = asyncHandler(async (req, res) => {
  const uid = await getUserUid(req);
  try {
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
