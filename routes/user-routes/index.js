const express = require("express");
const {
  Login,
  AddPrivateKeyToFirebaseClaims,
} = require("../../controller/user-controller");
const authenticateUser = require("../../middleware/privateRoute.middleware");

const router = express.Router();

router.get("/signin/", Login);
router.post(
  "/generate-private-key/",
  authenticateUser,
  AddPrivateKeyToFirebaseClaims
);
// router.post("/refresh-token");

module.exports = router;
