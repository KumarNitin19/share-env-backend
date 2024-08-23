const asyncHandler = require("express-async-handler");

const getENVVariables = asyncHandler(async (req, res) => {
  res.status(200).send(
    JSON.stringify({
      name: "Nitin",
    })
  );
});

module.exports = { getENVVariables };
