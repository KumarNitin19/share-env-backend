const asyncHandler = require("express-async-handler");

const createProject = asyncHandler((req, res) => {});

const editProject = asyncHandler((req, res) => {});

const deleteProject = asyncHandler((req, res) => {});

const getAllProjects = asyncHandler((req, res) => {
  res.status(200).send(
    JSON.stringify({
      name: "Nitin",
    })
  );
});

module.exports = { createProject, editProject, deleteProject, getAllProjects };
