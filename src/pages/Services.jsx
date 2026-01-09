import { useEffect, useState } from "react";
import "../App.css"; // make sure to import your CSS

export default function Services() {
  const [logs, setLogs] = useState([]);

  // Helper: parse "Jan-10-2026 03:14" into a Date object
  function parseTimestamp(ts) {
    const [datePart, timePart] = ts.split(" ");
    const [monthStr, day, year] = datePart.split("-");
    const [hour, minute] = timePart.split(":");

    const months = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };

    return new Date(
      parseInt(year),
      months[monthStr],
      parseInt(day),
      parseInt(hour),
      parseInt(minute)
    );
  }

  // Fetch logs from Firebase
  function fetchLogs() {
    fetch("https://petfeeder-8cf87-default-rtdb.asia-southeast1.firebasedatabase.app/logs.json")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          const entries = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          // Sort newest first
          entries.sort((a, b) => parseTimestamp(b.timestamp) - parseTimestamp(a.timestamp));
          setLogs(entries);
        } else {
          setLogs([]);
        }
      })
      .catch((err) => console.error("Error fetching logs:", err));
  }

  useEffect(() => {
    fetchLogs(); // initial load
    const interval = setInterval(fetchLogs, 5000); // refresh every 5 seconds
    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <section className="page">
      <h1>Our Services</h1>
      <ul>
        <li>Consulting & Strategy</li>
        <li>Web & App Development</li>
        <li>Financial Analysis</li>
      </ul>

      <h2>🍽️ Food Served History</h2>
      {logs.length === 0 ? (
        <p>No food served yet.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ marginTop: "1rem", width: "100%", maxWidth: 700 }}>
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Event</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={log.id} className={index === 0 ? "latest-row" : ""}>
                <td>{log.timestamp}</td>
                <td>{log.event}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
