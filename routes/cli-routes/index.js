const express = require("express");
const { getENVVariables } = require("../../controller/cli-controller");

const router = express.Router();

router.get("/get-env-varaibles", getENVVariables);

module.exports = router;
