const express = require("express");
const authenticateUser = require("../../middleware/privateRoute.middleware");
const {
  getAllProjects,
  createProject,
  editProject,
  deleteProject,
} = require("../../controller/project-controller");

const router = express.Router();

router.get("/get-all-projects", authenticateUser, protect, getAllProjects);
router.post("/create-project", authenticateUser, protect, createProject);
router.put("/edit-project", authenticateUser, protect, editProject);
router.delete("/delete-project", authenticateUser, protect, deleteProject);

module.exports = router;
