const crypto = require("crypto");

// Your custom secret key (should be 32 bytes for AES-256)
const SECRET_KEY = crypto
  .createHash("sha256")
  .update("your-custom-secret-key")
  .digest("base64")
  .slice(0, 32);
// Your Initialization Vector (IV) (should be 16 bytes)
const IV = crypto.randomBytes(16); // Can be generated once and reused for the same encryption context

/**
 * Encrypt data using AES-256-CBC
 * @param {string} data - The data to encrypt
 * @returns {string} - The encrypted data in Base64 format
 */
function encrypt(data) {
  const cipher = crypto.createCipheriv("aes-256-cbc", SECRET_KEY, IV);
  let encrypted = cipher.update(data, "utf8", "base64");
  encrypted += cipher.final("base64");
  return `${IV.toString("base64")}:${encrypted}`;
}

/**
 * Decrypt data using AES-256-CBC
 * @param {string} encryptedData - The encrypted data in Base64 format
 * @returns {string} - The decrypted plaintext
 */
function decrypt(encryptedData) {
  const [iv, encrypted] = encryptedData.split(":");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    SECRET_KEY,
    Buffer.from(iv, "base64")
  );
  let decrypted = decipher.update(encrypted, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// Usage
const plainText = "Sensitive data that needs encryption";

// Encrypt the data
const encryptedData = encrypt(plainText);
console.log("Encrypted Data:", encryptedData);

// Decrypt the data
const decryptedData = decrypt(encryptedData);
console.log("Decrypted Data:", decryptedData);
