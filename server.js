const express = require("express");
const dotenv = require("dotenv");
const admin = require("./firebaseAdmin");

const cors = require("cors");
const cliRoutes = require("./routes/cli-routes");
const projectRoutes = require("./routes/project-routes");
const userRoutes = require("./routes/user-routes");
const { execSync } = require("child_process");

dotenv.config();
const PORT = process.env.PORT || 7000;

const app = express();

app.use(express.json());
app.use(cors());
app.use("/cli", cliRoutes);
app.use("/api/v1", projectRoutes);
app.use("/api/v1", userRoutes);
app.listen(PORT, console.log(`App running on port ${PORT}`));

// Fetch user GitHub session
// const fetchGitHubSession = () => {
//   try {
//     const githubUsername = execSync("git config user.name").toString().trim();
//     if (!githubUsername) {
//       console.error("GitHub session not found. Please login via GitHub.");
//       process.exit(1);
//     }
//     return githubUsername;
//   } catch (error) {
//     console.error("Error fetching GitHub session:", error.message);
//     process.exit(1);
//   }
// };

// console.log(crypto.randomBytes(64).toString("base64"));
