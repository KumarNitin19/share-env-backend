const express = require("express");
const authenticateUser = require("../../middleware/privateRoute.middleware");
const {
  getAllProjects,
  createProject,
  editProject,
  deleteProject,
} = require("../../controller/project-controller");

const router = express.Router();

router.get("/projects", authenticateUser, getAllProjects);
router.post("/add-project", authenticateUser, createProject);
router.put("/edit-project", authenticateUser, editProject);
router.delete("/delete-project", authenticateUser, deleteProject);

module.exports = router;
