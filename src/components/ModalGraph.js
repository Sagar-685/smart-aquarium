import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
  Tooltip,
  Legend
);

const API_BASE = "http://localhost:5000";

export default function ModalGraph({ sensor, onClose }) {
  const [range, setRange] = useState("1h");
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/sensor/history?type=${sensor}&range=${range}`
      );
      setHistory(res.data || []);
    } catch (err) {
      console.error("Graph fetch error:", err.message);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [sensor, range]);


  const labels = history.map((d) =>
    new Date(d.createdAt).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit"
    })
  );

  const values = history.map((d) =>
    d[sensor] !== null ? Number(d[sensor]) : null
  );

  const data = {
    labels,
    datasets: [
      {
        label: `${sensor.toUpperCase()} Trend`,
        data: values,
        borderColor: "#0077ff",
        backgroundColor: "rgba(0, 119, 255, 0.2)",
        tension: 0.25,
        borderWidth: 2,
        pointRadius: 3
      }
    ]
  };

  return (
    <div className="modal-bg">
      <div className="modal-box">

        <h2 className="graph-title">{sensor.toUpperCase()} Graph</h2>

        <div className="range-select-container">
          <label>View: </label>
          <select
            className="range-select"
            value={range}
            onChange={(e) => setRange(e.target.value)}
          >
            <option value="1m">Last 1 Min</option>
            <option value="1h">Last 1 Hour</option>
            <option value="1d">Last 1 Day</option>
          </select>
        </div>

        {history.length > 0 ? (
          <Line data={data} />
        ) : (
          <p className="no-data">No data available for this sensor.</p>
        )}

        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
