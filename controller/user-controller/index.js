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

  const firebaseToken = authHeader.split(" ")[1]; // Extract the token
  try {
    // 1. Verify the Firebase token
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    const { uid, email, name, picture } = decodedToken;

    // 2. Check if the user exists in Firestore
    const userDoc = await db.collection("users").doc(uid).get();

    if (userDoc.exists) {
      // User exists in Firestore
      return res.status(200).json({
        message: "User already exists",
        user: {
          ...userDoc.data(),
          varVaultPrivateKey: decodedToken?.varVaultPrivateKey,
        },
      });
    }

    // 3. Register the user in Firestore if not present
    const newUser = {
      uid,
      email: email || null,
      name: name || "Anonymous",
      picture: picture || null,
      createdAt: new Date(),
    };

    await db.collection("users").doc(uid).set(newUser);

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    // console.error("Error processing request:", error);
    res.status(400).json({
      status: 403,
      message: "Failed to verify token or register user",
    });
  }
});

// To generate and add private key to custom claims
const AddPrivateKeyToFirebaseClaims = asyncHandler(async (req, res) => {
  try {
    // Add tenantId as a custom claim
    const varVaultPrivateKey = uuidv4();
    await setCustomClaims(uid, varVaultPrivateKey);
    res.status(200).json({
      message: "Private key successfully generated!!",
      privateKey: varVaultPrivateKey,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong, please try again!!",
    });
  }
});

module.exports = { Login, AddPrivateKeyToFirebaseClaims };
