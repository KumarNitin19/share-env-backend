const admin = require("firebase-admin");
// Set custom claims
const setCustomClaims = async (uid, tenantId) => {
  try {
    await admin.auth().setCustomUserClaims(uid, { tenantId });
    console.log(`Custom claims set for user ${uid}`);
  } catch (error) {
    console.error("Error setting custom claims:", error);
  }
};

module.exports = { setCustomClaims };
