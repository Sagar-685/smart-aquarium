const cron = require("node-cron");
const Schedule = require("./models/Schedule");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const sensorRoutes = require("./routes/sensorRoutes");
const feedRoutes = require("./routes/feedRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");

const app = express();
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

// API routes
app.use("/api/sensor", sensorRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/schedule", scheduleRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    startScheduleChecker();   
  })
  .catch((err) => console.log(err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

function startScheduleChecker() {
  cron.schedule("* * * * *", async () => {
    const now = new Date();
    const hh = now.getHours().toString().padStart(2, "0");
    const mm = now.getMinutes().toString().padStart(2, "0");
    const currentTime = `${hh}:${mm}`;

    try {
      const matches = await Schedule.find({ time: currentTime });
      if (matches.length > 0) {
        console.log(
          ` Auto-feed trigger at ${currentTime} for ${matches.length} schedule(s)`
        );
        console.log("Feeding fish automatically (SIMULATED SERVO) 🐠🍽️");
      }
    } catch (err) {
      console.error("Error in schedule checker:", err.message);
    }
  });

  console.log("✅ Schedule checker started (runs every minute)");
}
