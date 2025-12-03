const SensorData = require("../models/SensorData");
const { sendAlert } = require("../utils/telegram");

exports.uploadSensor = async (req, res) => {
  try {
    const data = await SensorData.create(req.body);

    // --- Alert Logic ---
    const alerts = [];

    if (data.temperature < 20 || data.temperature > 35) {
      alerts.push(`⚠️ Temperature out of range: ${data.temperature}°C`);
    }

    if (data.ph < 6.5 || data.ph > 7.5) {
      alerts.push(`⚠️ pH out of safe range: ${data.ph}`);
    }

    // Send all alerts to Telegram
    for (const msg of alerts) {
      sendAlert(msg);
    }

    res.json({ message: "Sensor data saved", data, alertsSent: alerts.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};

exports.getLatest = async (req, res) => {
  try {
    const latest = await SensorData.findOne().sort({ timestamp: -1 });
    res.json(latest);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
