const express = require("express");

const router = express.Router();

router.get("/get-env-varaibles", protect);
