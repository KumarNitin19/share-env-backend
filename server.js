const express = require("express");
const dotenv = require("dotenv");
const admin = require("./firebaseAdmin");

const cors = require("cors");
const cliRoutes = require("./routes/cli-routes");
const projectRoutes = require("./routes/project-routes");
const userRoutes = require("./routes/user-routes");
const envGroupRoutes = require("./routes/env-group-routes");
const githubRoutes = require("./routes/github-routes");

dotenv.config();
const PORT = process.env.PORT || 7000;

const app = express();

app.use(express.json());
app.use(cors());
app.use("/cli", cliRoutes);
app.use("/api/v1", [userRoutes, projectRoutes, envGroupRoutes, githubRoutes]);

app.listen(PORT, console.log(`App running on port ${PORT}`));

// console.log(crypto.randomBytes(64).toString("base64"));
