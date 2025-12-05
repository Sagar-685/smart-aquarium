import React, { useEffect, useState } from "react";
import axios from "axios";
import ModalGraph from "./components/ModalGraph";
import "./App.css";

const API_BASE = "http://localhost:5000";

function App() {
  const [temperature, setTemperature] = useState("—");
  const [humidity, setHumidity] = useState("—");
  const [tds, setTds] = useState("—");
  const [ultrasonic, setUltrasonic] = useState("—");
  const [servoStatus, setServoStatus] = useState("Idle");

  const [activeSensor, setActiveSensor] = useState(null);

  // GET LATEST SENSOR DATA
  const fetchSensorData = async () => {
  try {
    const res = await axios.get(`${API_BASE}/api/sensor/latest`);
    const d = res.data;

    if (!d) return;

    setTemperature(d.temperature !== null ? Number(d.temperature).toFixed(2) : "—");
    setHumidity(d.humidity !== null ? Number(d.humidity).toFixed(2) : "—");
    setTds(d.tds !== null ? Number(d.tds).toFixed(2) : "—");
    setUltrasonic(d.ultrasonic !== null ? Number(d.ultrasonic).toFixed(2) : "—");

    // Servo is a string → DO NOT convert to number
    setServoStatus(d.servo || "Idle");

  } catch (err) {
    console.error("Fetch sensor error:", err.message);
  }
};


  // FEED NOW
  const handleFeedNow = async () => {
    try {
      await axios.post(`${API_BASE}/api/feed/trigger`);
      setServoStatus("Feeding…");
      setTimeout(() => setServoStatus("Idle"), 5000);
    } catch (err) {
      console.error("Feed error:", err.message);
    }
  };

  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">

      {/* HEADER */}
      <header className="header">
        <img src="/logo.jpg" alt="Nexten Logo" className="logo" />
        <div className="brand-title">
          <h1>Nexten</h1>
          <p>Creators of HydroGuardian</p>
        </div>
      </header>

      {/* MAIN SECTION */}
      <div className="main-section">

        {/* PRODUCT IMAGE */}
        <div className="product-section">
          <img src="/feeder.jpg" alt="HydroGuardian Feeder" className="product-image" />
          <h2 className="product-name">HydroGuardian Smart Feeder</h2>
        </div>

        {/* SENSOR GRID */}
        <div className="sensor-grid">

          <div className="sensor-card" onClick={() => setActiveSensor("temperature")}>
            <h3>Temperature</h3>
            <p className="value">{temperature} °C</p>
          </div>

          <div className="sensor-card" onClick={() => setActiveSensor("humidity")}>
            <h3>Humidity</h3>
            <p className="value">{humidity} %</p>
          </div>

          <div className="sensor-card" onClick={() => setActiveSensor("tds")}>
            <h3>TDS</h3>
            <p className="value">{tds} ppm</p>
          </div>

          <div className="sensor-card" onClick={() => setActiveSensor("ultrasonic")}>
            <h3>Ultrasonic</h3>
            <p className="value">{ultrasonic} cm</p>
          </div>

          <div className="sensor-card" onClick={() => setActiveSensor("servo")}>
            <h3>Servo Status</h3>
            <p className="value">{servoStatus}</p>
          </div>

          <button className="feed-btn" onClick={handleFeedNow}>
            Feed Now
          </button>
        </div>
      </div>

      {/* MODAL GRAPH */}
      {activeSensor && (
        <ModalGraph 
          sensor={activeSensor}
          onClose={() => setActiveSensor(null)}
        />
      )}
    </div>
  );
}

export default App;
