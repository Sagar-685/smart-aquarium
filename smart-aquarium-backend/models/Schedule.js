const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
  time: String,  // Example: "09:00"
});

module.exports = mongoose.model("Schedule", ScheduleSchema);
