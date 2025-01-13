const express = require("express");
const { VerifyFirebaseToken } = require("../../controller/user-controller");

const router = express.Router();

router.post("/signin", VerifyFirebaseToken);
router.post("/add-tenant");
router.post("/refresh-token");

module.exports = router;
