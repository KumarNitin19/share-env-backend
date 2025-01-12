const express = require("express");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");
const dotenv = require("dotenv");
dotenv.config();

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(require("./firebase-service-account.json")),
});

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

// Verify Firebase ID Token and Issue JWT + Refresh Token
app.post("/signin", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(400)
      .json({ error: "Authorization header is missing or invalid" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token

  try {
    // Verify Firebase ID Token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    // Generate JWT and Refresh Token
    const accessToken = generateAccessToken({ userId });
    const refreshToken = generateRefreshToken({ userId });

    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(401).json({ error: "Invalid Firebase token" });
  }
});

// Refresh Access Token
app.post("/refresh-token", (req, res) => {
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

// Middleware to Protect Routes
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Authorization header is missing or invalid" });
  }

  const token = authHeader.split(" ")[1]; // Extract the JWT token

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Protected Route Example
app.get("/protected", authenticate, (req, res) => {
  res.json({
    message: "You have accessed a protected route!",
    userId: req.user.userId,
  });
});
