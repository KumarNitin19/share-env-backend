const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cliRoutes = require("./routes/cli-routes");
const projectRoutes = require("./routes/project");

dotenv.config();
const PORT = process.env.PORT || 7000;

const app = express();

app.use(cors());
app.use("/cli", cliRoutes);
app.use("/app/v1", projectRoutes);
app.listen(PORT, console.log(`App running on port ${PORT}`));
