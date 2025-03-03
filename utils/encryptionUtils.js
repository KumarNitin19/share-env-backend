const crypto = require("crypto");

// Function to encrypt data
const encryptData = (data, userPrivateKey) => {
  const key = crypto.createHash("sha256").update(userPrivateKey).digest(); // Derive a 256-bit key
  const iv = crypto.randomBytes(16); // AES IV

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(JSON.stringify(data), "utf8", "hex");
  encrypted += cipher.final("hex");

  return { encryptedData: encrypted, iv: iv.toString("hex") };
};

// Function to decrypt data
const decryptData = (encryptedData, iv, userPrivateKey) => {
  const key = crypto.createHash("sha256").update(userPrivateKey).digest(); // Derive the same 256-bit key
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    key,
    Buffer.from(iv, "hex")
  );

  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return JSON.parse(decrypted);
};

module.exports = { encryptData, decryptData };
