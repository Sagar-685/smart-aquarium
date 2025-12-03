const express = require("express");
const router = express.Router();
const { uploadSensor, getLatest } = require("../controllers/sensorController");

router.post("/upload", uploadSensor);
router.get("/latest", getLatest);

module.exports = router;
