const express = require("express");

const router = express.Router();

router.post("/signin");
router.post("/add-tenant");
router.post("/refresh-token");

module.exports = router;
