const express = require("express");
const authenticateUser = require("../../middleware/privateRoute.middleware");
const {
  getAllProjects,
  createProject,
  editProject,
  deleteProject,
  getProject,
} = require("../../controller/project-controller");

const router = express.Router();

router.get("/projects/", authenticateUser, getAllProjects); // To get all projects

router.get("/project/:projectId", getProject); // To get all projects

router.post("/add-project/", authenticateUser, createProject); // To create a project

router.put("/project/:projectId", authenticateUser, editProject); // To update the project

router.delete("/delete-project/:projectId", authenticateUser, deleteProject); // To delete the project

module.exports = router;
