const dotenv = require("dotenv");

dotenv.config();

const {
  PORT,
  DATABASE_URI,
  PROJECT_ID,
  PRIVATE_KEY_ID,
  PRIVATE_KEY,
  CLIENT_EMAIL,
  CLIENT_ID,
  AUTH_URI,
  TOKEN_URI,
  AUTH_PROVIDER_URI,
  CLIENT_URI,
} = process.env;

module.exports = {
  port: PORT,
  firebaseConfig: {
    project_id: PROJECT_ID,
    private_key_id: PRIVATE_KEY_ID,
    private_key: PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: CLIENT_EMAIL,
    client_id: CLIENT_ID,
    auth_uri: AUTH_URI,
    token_uri: TOKEN_URI,
    auth_provider_x509_cert_url: AUTH_PROVIDER_URI,
    client_x509_cert_url: CLIENT_URI,
  },
  database_uri: DATABASE_URI,
};
