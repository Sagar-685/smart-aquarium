import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_BASE = "http://localhost:5000";

function App() {
  const [temperature, setTemperature] = useState("Loading...");
  const [ph, setPh] = useState("Loading...");
  const [schedules, setSchedules] = useState([]);
  const [newTime, setNewTime] = useState("");

  // -------- Sensor data --------
  const fetchSensorData = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/sensor/latest`);
      if (res.data) {
        setTemperature(res.data.temperature.toFixed(2));
        setPh(res.data.ph.toFixed(2));
      }
    } catch (err) {
      console.error("Error fetching sensor data:", err.message);
    }
  };

  // -------- Schedule data --------
  const fetchSchedules = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/schedule/all`);
      setSchedules(res.data || []);
    } catch (err) {
      console.error("Error fetching schedules:", err.message);
    }
  };

  // Add new schedule
  const handleAddSchedule = async (e) => {
    e.preventDefault();
    if (!newTime) return;

    try {
      const res = await axios.post(`${API_BASE}/api/schedule/add`, {
        time: newTime, // "HH:MM" from input[type=time]
      });
      setSchedules((prev) => [...prev, res.data.schedule]);
      setNewTime("");
    } catch (err) {
      console.error("Error adding schedule:", err.message);
    }
  };

  // Delete schedule
  const handleDeleteSchedule = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/schedule/${id}`);
      setSchedules((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Error deleting schedule:", err.message);
    }
  };

  // Manual feed
  const handleFeedNow = async () => {
    try {
      await axios.post(`${API_BASE}/api/feed/trigger`);
      alert("Feed command sent (simulated) 🐟");
    } catch (err) {
      console.error("Error triggering feed:", err.message);
    }
  };

  // Helper to show nice 12-hr format
  const formatTime = (t) => {
    if (!t) return "";
    const [hStr, mStr] = t.split(":");
    let h = parseInt(hStr, 10);
    const suffix = h >= 12 ? "PM" : "AM";
    if (h === 0) h = 12;
    else if (h > 12) h -= 12;
    return `${h.toString().padStart(2, "0")}:${mStr} ${suffix}`;
  };

  // Initial load + auto refresh sensors
  useEffect(() => {
    fetchSensorData();
    fetchSchedules();

    const interval = setInterval(fetchSensorData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <h1 className="title">Smart Aquarium Dashboard</h1>

      {/* Sensor Cards */}
      <div className="cards">
        <div className="card">
          <h3>Temperature</h3>
          <p className="value">{temperature} °C</p>
        </div>

        <div className="card">
          <h3>pH Level</h3>
          <p className="value">{ph}</p>
        </div>
      </div>

      {/* Feed Button */}
      <button className="feed-button" onClick={handleFeedNow}>
        Feed Now
      </button>

      {/* Schedule Section */}
      <div className="schedule-box">
        <h2>Feeding Schedule</h2>

        <form className="schedule-form" onSubmit={handleAddSchedule}>
          <input
            type="time"
            className="schedule-input"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            required
          />
          <button type="submit" className="schedule-add-btn">
            Add
          </button>
        </form>

        <ul className="schedule-list">
          {schedules.length === 0 && <li>No schedules added yet.</li>}
          {schedules.map((sch) => (
            <li key={sch._id} className="schedule-item">
              <span className="schedule-time">{formatTime(sch.time)}</span>
              <button
                className="schedule-delete-btn"
                onClick={() => handleDeleteSchedule(sch._id)}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
