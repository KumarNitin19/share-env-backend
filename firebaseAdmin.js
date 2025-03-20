const admin = require("firebase-admin");
const config = require("./config");

admin.initializeApp({
  credential: admin.credential.cert(config.firebaseConfig),
  databaseURL: config.database_uri,
});

const db = admin.firestore();

module.exports = { db, admin };
