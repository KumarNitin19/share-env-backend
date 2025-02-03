const express = require("express");
const authenticateUser = require("../../middleware/privateRoute.middleware");
const {
  createENVGroup,
  getAllENVGroups,
  deleteENVGroup,
} = require("../../controller/env-group-controller");

const router = express.Router();

router.get("/groups/:projectId", authenticateUser, getAllENVGroups);
router.post("/add-group", authenticateUser, createENVGroup);
router.delete("/delete-group/:groupId", authenticateUser, deleteENVGroup);

module.exports = router;
