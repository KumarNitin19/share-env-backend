const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cliRoutes = require("./routes/cli-routes");

dotenv.config();
const PORT = process.env.PORT || 7000;

const app = express();

app.use(cors());
app.get("/", (req, res) => {
  res.send("API STARTED");
});
app.use("/cli", cliRoutes);
app.listen(PORT, console.log(`App running on port ${PORT}`));
