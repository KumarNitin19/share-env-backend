const admin = require("firebase-admin");
const bcrypt = require("bcrypt");

// Verify Firebase ID Token and Issue JWT + Refresh Token
async function VerifyFirebaseToken(req, res) {
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
}

async function SaveAccessAndRefreshToken(userId, accessToken, refreshToken) {
  const access_token_hash = await bcrypt.hash(accessToken, 10);
  const refresh_token_hash = await bcrypt.hash(refreshToken, 10);
  // Save to database
  await db.collection("tokens").insertOne({
    user_id: userId,
    access_token_hash: access_token_hash,
    refresh_token_hash: refresh_token_hash,
    created_at: new Date(),
    revoked: false,
  });
}

module.exports = { VerifyFirebaseToken, SaveAccessAndRefreshToken };
