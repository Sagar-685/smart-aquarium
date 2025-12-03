const cron = require("node-cron");
const Schedule = require("./models/Schedule");
const { startSimulator } = require("./utils/simulator");
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

// API routes
app.use("/api/sensor", sensorRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/schedule", scheduleRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    startScheduleChecker();          // <-- start cron after DB is ready
  })
  .catch((err) => console.log(err));


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Start fake simulator only in dev mode
if (process.env.ENABLE_SIMULATOR === "true") {
  startSimulator();
}
function startScheduleChecker() {
  // Runs every minute
  cron.schedule("* * * * *", async () => {
    const now = new Date();
    const hh = now.getHours().toString().padStart(2, "0");
    const mm = now.getMinutes().toString().padStart(2, "0");
    const currentTime = `${hh}:${mm}`;

    try {
      const matches = await Schedule.find({ time: currentTime });
      if (matches.length > 0) {
        console.log(
          `⏰ Auto-feed trigger at ${currentTime} for ${matches.length} schedule(s)`
        );
        console.log("Feeding fish automatically (SIMULATED SERVO) 🐠🍽️");
        // later: call ESP32 / Arduino here
      }
    } catch (err) {
      console.error("Error in schedule checker:", err.message);
    }
  });

  console.log("✅ Schedule checker started (runs every minute)");
}
