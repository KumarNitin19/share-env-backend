const express = require("express");
const dotenv = require("dotenv");
import cors from "cors";

dotenv.config();
const PORT = process.env.PORT || 7000;

const app = express();

app.use(cors());
app.get("/", (req, res) => {
  res.send("API STARTED");
});

app.listen(PORT, console.log(`App running on port ${PORT}`));
