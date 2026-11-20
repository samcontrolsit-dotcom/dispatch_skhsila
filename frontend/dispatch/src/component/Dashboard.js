import React, { useState } from "react";
import logo from "../images/logo.png";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import "./Dashboard.css"; // 👈 import the styles

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const API_URL = "http://127.0.0.1:8000";

export default function Dashboard() {
  const [binNo, setBinNo] = useState("");
  const [partNo, setPartNo] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${API_URL}/search`, {
        params: {
          bin_no: binNo,
          part_no: partNo,
          from_date: fromDate,
          to_date: toDate,
        },
      });
      if (res.data && res.data.error) {
        setError(res.data.error);
        setData([]);
        return;
      }
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("SEARCH ERROR:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "Unable to connect to Python server"
      );
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const totalOK = data.reduce((s, m) => s + Number(m.ok_count || 0), 0);
  const totalNG = data.reduce((s, m) => s + Number(m.ng_count || 0), 0);

  const pieData = {
    labels: ["OK", "NG"],
    datasets: [
      {
        data: [totalOK, totalNG],
        backgroundColor: ["#16a34a", "#dc2626"],
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const barData = {
    labels: data.map((m) => m.bin_no),
    datasets: [
      {
        label: "OK Count",
        data: data.map((m) => Number(m.ok_count || 0)),
        backgroundColor: "#16a34a",
        borderRadius: 8,
        maxBarThickness: 40,
      },
    ],
  };

  const qtyData = {
    labels: data.map((m) => m.bin_no),
    datasets: [
      {
        label: "Total Qty",
        data: data.map((m) => Number(m.qty || 0)),
        backgroundColor: "#2563eb",
        borderRadius: 8,
        maxBarThickness: 32,
      },
      {
        label: "Scanned",
        data: data.map((m) => Number(m.scanned_qty || 0)),
        backgroundColor: "#f59e0b",
        borderRadius: 8,
        maxBarThickness: 32,
      },
    ],
  };

  const handlePrint = async (bin_no, part_no, qty) => {
    try {
      const res = await axios.get(`${API_URL}/print-label`, {
        params: { bin_no, part_no, qty },
      });
      if (res.data?.success) alert("✅ Printed successfully");
      else alert(`❌ ${res.data?.error || "Print failed"}`);
    } catch (err) {
      console.error("PRINT ERROR:", err);
      alert("❌ Unable to connect to Python printer service");
    }
  };

  return (
    <div className="dash">
      {/* HEADER */}
      <header className="dash-header">
        <img src={logo} alt="logo" className="logo" />
        <a href="/">
          <p>SCAN</p>
        </a>
      </header>

      <h2 className="dash-title">Production Binning Dashboard</h2>

      {/* ERROR */}
      {error && (
        <div className="dash-error">
          <span>❌</span> {error}
        </div>
      )}

      {/* FILTERS */}
      <div className="filters">
        <div className="field">
          <label>Bin No</label>
          <input
            placeholder="e.g. B-101"
            value={binNo}
            onChange={(e) => setBinNo(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Part No</label>
          <input
            placeholder="e.g. P-200"
            value={partNo}
            onChange={(e) => setPartNo(e.target.value)}
          />
        </div>
        <div className="field">
          <label>From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div className="field">
          <label>To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <div className="field">
          <label>&nbsp;</label>
          <button
            className="btn-search"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "Searching…" : "Search"}
          </button>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="summary">
        <div className="stat-card ok">
          <div className="stat-label">Total OK</div>
          <div className="stat-value">{totalOK}</div>
        </div>
        <div className="stat-card ng">
          <div className="stat-label">Total NG</div>
          <div className="stat-value">{totalNG}</div>
        </div>
        <div className="stat-card bins">
          <div className="stat-label">Bins</div>
          <div className="stat-value">{data.length}</div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="charts">
        <div className="chart-card">
          <h3>OK vs NG</h3>
          <div className="chart-body">
            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="chart-card">
          <h3>Bin-wise OK</h3>
          <div className="chart-body">
            <Bar data={barData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="chart-card">
          <h3>Qty vs Scanned</h3>
          <div className="chart-body">
            <Bar data={qtyData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* MASTER CARDS */}
      <div className="master-list">
        {data.map((m, i) => (
          <div className="master-card" key={i}>
            <div className="card-head">
              <h3>MASTER — {m.bin_no}</h3>
              <button
                className="btn-print"
                onClick={() => handlePrint(m.bin_no, m.part_no, m.qty)}
              >
                🖨 Print Label
              </button>
            </div>

            <div className="meta-grid">
              <div className="meta">
                <span>Bin</span>
                <b>{m.bin_no}</b>
              </div>
              <div className="meta">
                <span>Part</span>
                <b>{m.part_no}</b>
              </div>
              <div className="meta">
                <span>Part Name</span>
                <b>{m.part_name}</b>
              </div>
              <div className="meta">
                <span>Qty</span>
                <b>{m.qty}</b>
              </div>
              <div className="meta">
                <span>Scanned</span>
                <b>{m.scanned_qty}</b>
              </div>
              <div className="meta">
                <span>OK / NG</span>
                <b>
                  <span className="badge ok">{m.ok_count}</span>{" "}
                  <span className="badge ng">{m.ng_count}</span>
                </b>
              </div>
            </div>

            <div className="scan-table-wrap">
              <table className="scan">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Serial</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {m.scans.map((s, j) => (
                    <tr key={j}>
                      <td>{s.date}</td>
                      <td>{s.time}</td>
                      <td>{s.serial_no}</td>
                      <td>
                        <span
                          className={`badge ${
                            s.result === "NG" ? "ng" : "ok"
                          }`}
                        >
                          {s.result}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}