const axios = require("axios");

function startSimulator() {
  const BASE_URL = process.env.SIMULATOR_BASE_URL || "http://localhost:5000";

  console.log("Starting fake sensor simulator...");

  setInterval(async () => {
    // Random "normal-ish" values
    const temperature = (Math.random() * 6) + 26; // 26–32 °C
    const ph = (Math.random() * 0.8) + 6.8;      // 6.8–7.6

    try {
      await axios.post(`${BASE_URL}/api/sensor/upload`, {
        temperature,
        ph,
      });

      console.log(
        `Simulated Sensor -> Temp: ${temperature.toFixed(2)}°C, pH: ${ph.toFixed(2)}`
      );
    } catch (err) {
      console.error("Simulator error:", err.message);
    }
  }, 30000); // every 30 seconds
}

module.exports = { startSimulator };
