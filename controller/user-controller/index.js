const express = require("express");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");
const dotenv = require("dotenv");
const asyncHandler = require("express-async-handler");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/helper");
const { SaveAccessAndRefreshToken } = require("../../utils/firebaseUtils");
const { db } = require("../../firebase");
dotenv.config();

const app = express();
app.use(express.json());

// User login
const Login = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(400)
      .json({ error: "Authorization header is missing or invalid" });
  }

  const firebaseToken = authHeader.split(" ")[1]; // Extract the refresh token
  try {
    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    const { uid, email, name } = decodedToken; // Extract user data

    // Check if the user exists in your database
    let user = await db.collection("users").findOne({ firebase_uid: uid });
    if (!user) {
      // If user doesn't exist, create a new one
      user = {
        firebase_uid: uid,
        email,
        name: name || "Anonymous",
        created_at: new Date(),
      };
      await db.collection("users").insertOne(user);
    }

    // Generate JWT tokens
    const payload = { userId: user._id, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await SaveAccessAndRefreshToken(user._id, accessToken, refreshToken);

    res.status(200).json({
      accessToken,
      refreshToken,
      message: "User logged-in successfully!!",
    });
  } catch (error) {
    console.error("Error verifying Firebase token:", error);
    res.status(401).send("Invalid Firebase token");
  }
});

// Refresh Access Token
const RefreshToken = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(400)
      .json({ error: "Authorization header is missing or invalid" });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Check if the refresh token is valid
    const tokens = await db
      .collection("tokens")
      .find({ user_id: decoded.userId, revoked: false })
      .toArray();
    const isValid = await Promise.any(
      tokens.map((token) =>
        bcrypt.compare(refreshToken, token.refresh_token_hash)
      )
    );
    if (!isValid) return res.status(403).send("Invalid refresh token");

    // Generate new tokens
    const payload = { userId: decoded.userId, email: decoded.email };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    await SaveAccessAndRefreshToken(
      decoded.userId,
      newAccessToken,
      newRefreshToken
    );

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    res.status(403).send("Invalid or expired refresh token");
  }
});

const AddTenant = asyncHandler(async (req, res) => {
  const { idToken, tenantId } = req.body;

  if (!idToken || !tenantId) {
    return res.status(400).json({ error: "idToken and tenantId are required" });
  }

  try {
    // Verify the Firebase ID Token to get the user's UID
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Add tenantId as a custom claim
    await admin.auth().setCustomUserClaims(uid, { tenantId });

    res.json({
      message: `Tenant ID '${tenantId}' added to user '${uid}'`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to add tenantId", details: error.message });
  }
});

module.exports = { AddTenant, RefreshToken, Login };
