const express = require("express");
const authenticateUser = require("../../middleware/privateRoute.middleware");

const router = express.Router();

router.get("/get-all-projects", authenticateUser, protect);
router.post("/create-project", authenticateUser, protect);
router.post("/edit-project-name", authenticateUser, protect);
router.post("/add-variable", authenticateUser, protect);
router.post("/edit-variable-label", authenticateUser, protect);

module.exports = router;
