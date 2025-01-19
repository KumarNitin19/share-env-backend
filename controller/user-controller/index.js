const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");
const asyncHandler = require("express-async-handler");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/helper");
const { SaveAccessAndRefreshToken } = require("../../utils/firebaseUtils");
const { db } = require("../../firebase");
const { v4: uuidv4 } = require("uuid");
const { setCustomClaims } = require("../../utils/userUtils");

// User login
const Login = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;
  // Verifying header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(400)
      .json({ error: "Authorization header is missing or invalid" });
  }

  const firebaseToken = authHeader.split(" ")[1]; // Extract the refresh token
  try {
    // 1. Verify the Firebase token
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    const { uid, email, name, picture } = decodedToken;

    // 2. Check if the user exists in Firestore
    const userDoc = await db.collection("users").doc(uid).get();

    if (userDoc.exists) {
      // User exists in Firestore
      const tenantId = uuidv4();
      await admin.auth().setCustomUserClaims(uid, { varVaultId: tenantId });
      return res
        .status(200)
        .send({ message: "User already exists", user: userDoc.data() });
    }

    // Add tenantId as a custom claim
    const tenantId = uuidv4();
    await setCustomClaims(uid, tenantId);

    // 3. Register the user in Firestore if not present
    const newUser = {
      uid,
      email: email || null,
      name: name || "Anonymous",
      picture: picture || null,
      createdAt: new Date(),
      tenantId,
    };

    await db.collection("users").doc(uid).set(newUser);

    res.status(201).send({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(400).send({ error: "Failed to verify token or register user" });
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

module.exports = { RefreshToken, Login };
