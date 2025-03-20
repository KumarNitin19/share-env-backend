const admin = require("firebase-admin");
const config = require("./config");

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(config.firebaseConfig),
  });
}

const db = admin.firestore();

module.exports = { admin, db };
