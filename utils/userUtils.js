const admin = require("firebase-admin");
// Set custom claims
const setCustomClaims = async (uid, tenantId) => {
  try {
    await admin
      .auth()
      .setCustomUserClaims(uid, { varVaultPrivateKey: tenantId });
    console.log(`Custom claims set for user ${uid}`);
  } catch (error) {
    console.error("Error setting custom claims:", error);
  }
};

const getUserUid = async (req) => {
  const authHeader = req.headers.authorization;
  const firebaseToken = authHeader.split(" ")[1]; // Extract the token

  const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
  return decodedToken?.uid;
};

module.exports = { setCustomClaims, getUserUid };
