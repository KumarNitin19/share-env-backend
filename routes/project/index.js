const express = require("express");
const authenticateUser = require("../../middleware/privateRoute.middleware");
const {
  getAllProjects,
  createProject,
  editProject,
  deleteProject,
} = require("../../controller/project-controller");

const router = express.Router();

router.get("/projects/", authenticateUser, getAllProjects);
router.post("/add-project/", authenticateUser, createProject);
router.put("/project/:projectId", authenticateUser, editProject);
router.delete("/delete-project/:projectId", authenticateUser, deleteProject);

module.exports = router;
