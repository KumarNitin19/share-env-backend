const express = require("express");
const authenticateUser = require("../../middleware/privateRoute.middleware");
const {
  createENVGroup,
  getENVGroups,
  deleteENVGroup,
} = require("../../controller/env-group-controller");

const router = express.Router();

router.get("/groups/:projectId", authenticateUser, getENVGroups);
router.post("/add-group", authenticateUser, createENVGroup);
router.delete("/delete-group/:groupId", authenticateUser, deleteENVGroup);

module.exports = router;
