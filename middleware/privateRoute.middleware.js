const authenticateUser = (req, res, next) => {
  const idToken = req.headers.authorization;
  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken;
      next();
    })
    .catch((error) => {
      console.log("Error verifying ID token:", error);
      res.status(401).json({ error: "Invalid token" });
    });
};

module.exports = authenticateUser;

// Middleware to Authenticate and Check User Validity
// const authenticate = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ error: "Authorization header is missing or invalid" });
//   }

//   const token = authHeader.split(" ")[1]; // Extract the JWT token

//   try {
//     // Verify the JWT Token
//     const payload = jwt.verify(token, JWT_SECRET);

//     // Check if the user exists in the database or in-memory store
//     const user = users[payload.userId];
//     if (!user) {
//       return res.status(403).json({ error: "User not found or invalid" });
//     }

//     // Attach user info to the request object for downstream handlers
//     req.user = user;
//     next();
//   } catch (error) {
//     return res.status(401).json({ error: "Invalid or expired token" });
//   }
// };
