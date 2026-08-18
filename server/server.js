const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDatabase } = require("./config/database");

const peopleRoutes = require("./routes/peopleRoutes");
const jobRoutes = require("./routes/jobRoutes");
const skillRoutes = require("./routes/skillRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/people", peopleRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/skills", skillRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "CareerGraph API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "CareerGraph backend is healthy",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await connectDatabase();
});