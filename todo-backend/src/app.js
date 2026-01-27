const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/tasks", require("./routes/task.routes"));

module.exports = app;
