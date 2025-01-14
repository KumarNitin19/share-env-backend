const admin = require("firebase-admin");

async function listAllUsers(nextPageToken) {
  try {
    // List batch of users
    const result = await admin.auth().listUsers(1000, nextPageToken);
    result.users.forEach((userRecord) => {
      console.log("User:", userRecord.toJSON());
    });

    // If there are more users, continue listing
    if (result.pageToken) {
      await listAllUsers(result.pageToken);
    }
  } catch (error) {
    console.error("Error listing users:", error);
  }
}

module.exports = { listAllUsers };
