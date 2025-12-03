const Schedule = require("../models/Schedule");

exports.addSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.create(req.body);
    res.json({ message: "Schedule added", schedule });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getSchedule = async (req, res) => {
  try {
    const schedules = await Schedule.find();
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// NEW: delete schedule
exports.deleteSchedule = async (req, res) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ message: "Schedule deleted" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
