const express = require("express");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");
const dotenv = require("dotenv");
const asyncHandler = require("express-async-handler");
dotenv.config();

const app = express();
app.use(express.json());

// Secret keys for JWT
const JWT_SECRET = process.env.JWT_SECRET; // Use a strong secret for JWT
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET; // Use a different secret for refresh tokens

// In-memory storage for refresh tokens (use a database in production)
const refreshTokensStore = {};

// Generate JWT Token
const generateAccessToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
};

// Generate Refresh Token
const generateRefreshToken = (payload) => {
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
  refreshTokensStore[refreshToken] = true;
  return refreshToken;
};

// Refresh Access Token
const RefreshTokem = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(400)
      .json({ error: "Authorization header is missing or invalid" });
  }

  const refreshToken = authHeader.split(" ")[1]; // Extract the refresh token

  if (!refreshTokensStore[refreshToken]) {
    return res.status(403).json({ error: "Invalid refresh token" });
  }

  try {
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const newAccessToken = generateAccessToken({ userId: payload.userId });
    const newRefreshToken = generateRefreshToken({ userId: payload.userId });

    // Remove old refresh token and store the new one
    delete refreshTokensStore[refreshToken];
    refreshTokensStore[newRefreshToken] = true;

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired refresh token" });
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

module.exports = { AddTenant, RefreshTokem };
