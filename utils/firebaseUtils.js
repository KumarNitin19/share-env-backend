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

module.exports = { VerifyFirebaseToken };
