const express = require("express");
const authenticateUser = require("../../middleware/privateRoute.middleware");
const {
  getAllProjects,
  createProject,
  editProject,
  deleteProject,
} = require("../../controller/project-controller");

const router = express.Router();

router.get("/get-all-projects", getAllProjects);
router.post("/create-project", authenticateUser, createProject);
router.put("/edit-project", authenticateUser, editProject);
router.delete("/delete-project", authenticateUser, deleteProject);

module.exports = router;
