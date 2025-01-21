const asyncHandler = require("express-async-handler");
const { getUserUid } = require("../../utils/userUtils");
const { db } = require("../../firebase");

const createProject = asyncHandler((req, res) => {});

const editProject = asyncHandler((req, res) => {});

const deleteProject = asyncHandler((req, res) => {});

const getAllProjects = asyncHandler(async (req, res) => {
  const uid = await getUserUid(req);
  const projects = await db.collection("projects").doc(uid).get();
  console.log(projects);
  res.status(200).json({
    message: "No project found",
    data: [],
  });
});

module.exports = { createProject, editProject, deleteProject, getAllProjects };
