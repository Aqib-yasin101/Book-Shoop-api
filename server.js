const express = require("express");
const general = require("./routes/general.js");
const auth_users = require("./routes/auth_users.js");

const app = express();
const PORT = 5000;

app.use(express.json());

// Public (general) routes
app.use("/", general);

// Authenticated routes
app.use("/", auth_users);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
