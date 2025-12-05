const express = require("express");
const router = express.Router();
const SensorData = require("../models/SensorData");

router.get("/latest", async (req, res) => {
  try {
    const latest = await SensorData.findOne().sort({ createdAt: -1 });

    if (!latest) {
      return res.json({
        temperature: null,
        humidity: null,
        tds: null,
        ultrasonic: null,
        servo: "Idle",
        createdAt: null
      });
    }

    return res.json({
      temperature: latest.temperature ?? null,
      humidity: latest.humidity ?? null,
      tds: latest.tds ?? null,
      ultrasonic: latest.ultrasonic ?? null,
      servo: latest.servo ?? "Idle",
      createdAt: latest.createdAt
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/history", async (req, res) => {
  try {
    const { type, range } = req.query;

    if (!type) {
      return res.status(400).json({ error: "Sensor type is required" });
    }

    let minutes = 60;
    if (range === "1m") minutes = 1;
    if (range === "1h") minutes = 60;
    if (range === "1d") minutes = 1440;

    const sinceTime = new Date(Date.now() - minutes * 60000);

    const data = await SensorData.find({
      createdAt: { $gte: sinceTime },
      [type]: { $exists: true }
    }).sort({ createdAt: 1 });

    const formatted = data.map((d) => ({
      createdAt: d.createdAt,
      value: d[type] !== null ? Number(d[type]).toFixed(2) : null
    }));

    return res.json(formatted);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/upload", async (req, res) => {
  try {
    const { temperature, humidity, tds, ultrasonic, servo } = req.body;

    const newData = await SensorData.create({
      temperature: temperature ? Number(parseFloat(temperature).toFixed(2)) : null,
      humidity: humidity ? Number(parseFloat(humidity).toFixed(2)) : null,
      tds: tds !== undefined ? Number(tds) : null,
      ultrasonic: ultrasonic !== undefined ? Number(ultrasonic) : null,
      servo: servo || "Idle"
    });

    return res.json({ success: true, data: newData });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
