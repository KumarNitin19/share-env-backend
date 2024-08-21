const express = require("express");

const router = express.Router();

router.get("/get-all-projects", protect);
router.post("/create-project", protect);
router.post("/edit-project-name", protect);
router.post("/add-variable", protect);
router.post("/edit-variable-label", protect);
