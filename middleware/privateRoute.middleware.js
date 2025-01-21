const { admin } = require("../firebase");

// Middleware to Authenticate and Check User Validity
const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Authorization header is missing or invalid" });
  }

  const firebaseToken = authHeader.split(" ")[1]; // Extract the token

  try {
    // 1. Verify the Firebase token
    const user = await admin.auth().verifyIdToken(firebaseToken);

    if (!user) {
      return res.status(403).json({ error: "User not found or invalid" });
    }

    // Attach user info to the request object for downstream handlers
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = authenticateUser;
