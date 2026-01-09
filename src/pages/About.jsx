import { useState, useEffect } from "react";

export default function About() {
  const [status, setStatus] = useState("");
  const [dayHour, setDayHour] = useState("");
  const [dayMinute, setDayMinute] = useState("");
  const [nightHour, setNightHour] = useState("");
  const [nightMinute, setNightMinute] = useState("");

  const [savedDay, setSavedDay] = useState(null);
  const [savedNight, setSavedNight] = useState(null);

  // ESP8266 IP address
  const ESP_IP = "http://192.168.8.139";

  // Load schedule from ESP when component mounts
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await fetch(`${ESP_IP}/getSchedule`);
        if (!res.ok) throw new Error("Bad response");
        const data = await res.json();

        setDayHour(String(data.dayHour));
        setDayMinute(String(data.dayMinute));
        setNightHour(String(data.nightHour));
        setNightMinute(String(data.nightMinute));

        setSavedDay(`${String(data.dayHour).padStart(2, "0")}:${String(data.dayMinute).padStart(2, "0")}`);
        setSavedNight(`${String(data.nightHour).padStart(2, "0")}:${String(data.nightMinute).padStart(2, "0")}`);
      } catch (err) {
        console.error(err);
        setStatus("❌ Error: Could not fetch schedule from ESP8266");
      }
    };

    fetchSchedule();
  }, []);

  // Manual control
  const turnOnLed = async () => {
    try {
      const res = await fetch(`${ESP_IP}/led/on`);
      if (!res.ok) throw new Error("Bad response");
      const text = await res.text();
      setStatus(text);

      setTimeout(() => {
        setStatus("LED is OFF (auto after 5 sec)");
      }, 5000);
    } catch (err) {
      setStatus("❌ Error: Could not reach ESP8266");
    }
  };

  // Schedule control
  const setSchedule = async () => {
    try {
      const res = await fetch(
        `${ESP_IP}/setSchedule?dayHour=${dayHour}&dayMinute=${dayMinute}&nightHour=${nightHour}&nightMinute=${nightMinute}`
      );
      if (!res.ok) throw new Error("Bad response");
      const text = await res.text();
      setStatus(text);

      setSavedDay(`${dayHour.padStart(2, "0")}:${dayMinute.padStart(2, "0")}`);
      setSavedNight(`${nightHour.padStart(2, "0")}:${nightMinute.padStart(2, "0")}`);
    } catch (err) {
      setStatus("❌ Error: Could not reach ESP8266");
    }
  };

  return (
    <section className="page">
      <h1>Feed Me!</h1>
      

      {/* Manual control */}
      <div style={{ marginTop: "1.5rem" }}>
        <button className="btn btn--primary" onClick={turnOnLed}>
          Turn LED ON (5 sec)
        </button>
      </div>

      {/* Schedule control */}
      <div style={{ marginTop: "2rem" }}>
        <h3>Set Day Schedule</h3>
        <input
          type="number"
          placeholder="Hour"
          value={dayHour}
          onChange={(e) => setDayHour(e.target.value)}
        />
        <input
          type="number"
          placeholder="Minute"
          value={dayMinute}
          onChange={(e) => setDayMinute(e.target.value)}
        />

        <h3 style={{ marginTop: "1rem" }}>Set Night Schedule</h3>
        <input
          type="number"
          placeholder="Hour"
          value={nightHour}
          onChange={(e) => setNightHour(e.target.value)}
        />
        <input
          type="number"
          placeholder="Minute"
          value={nightMinute}
          onChange={(e) => setNightMinute(e.target.value)}
        />

        <div style={{ marginTop: "1rem" }}>
          <button className="btn btn--primary" onClick={setSchedule}>
            Save Schedule
          </button>
        </div>
      </div>

      {/* Show saved schedule times */}
      {(savedDay || savedNight) && (
        <div style={{ marginTop: "1.5rem" }}>
          <h3>📅 Current Schedule</h3>
          {savedDay && <p>Day Schedule: {savedDay}</p>}
          {savedNight && <p>Night Schedule: {savedNight}</p>}
        </div>
      )}

      {status && (
        <p
          style={{
            marginTop: "1rem",
            fontWeight: "600",
            color: status.includes("❌") ? "red" : "#45455e",
          }}
        >
          {status}
        </p>
      )}
    </section>
  );
}
