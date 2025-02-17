const express = require("express");
const authenticateUser = require("../../middleware/privateRoute.middleware");
const {
  createENVGroup,
  getAllENVGroups,
  updateENVGroup,
  deleteENVGroup,
} = require("../../controller/env-group-controller");

const router = express.Router();

router.get("/groups/:projectId", getAllENVGroups);
router.post("/add-group", authenticateUser, createENVGroup);
router.put("/group/:groupId", authenticateUser, updateENVGroup);
router.delete("/delete-group/:groupId", authenticateUser, deleteENVGroup);

module.exports = router;
