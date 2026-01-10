import { useState, useEffect } from "react";

export default function About() {
  const [status, setStatus] = useState("");
  const [dayHour, setDayHour] = useState("");
  const [dayMinute, setDayMinute] = useState("");
  const [nightHour, setNightHour] = useState("");
  const [nightMinute, setNightMinute] = useState("");
  const [savedDay, setSavedDay] = useState(null);
  const [savedNight, setSavedNight] = useState(null);

  const [showEmojis, setShowEmojis] = useState(false);
  const [showClock, setShowClock] = useState(false);
  const [showDefaultMessage, setShowDefaultMessage] = useState(true);

  const ESP_IP = "http://192.168.8.139";

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

        setSavedDay(
          `${String(data.dayHour).padStart(2, "0")}:${String(data.dayMinute).padStart(2, "0")}`
        );
        setSavedNight(
          `${String(data.nightHour).padStart(2, "0")}:${String(data.nightMinute).padStart(2, "0")}`
        );
      } catch (err) {
        console.error(err);
        showStatus("❌ Error: Could not fetch schedule from ESP8266");
      }
    };

    fetchSchedule();
  }, []);

  const showStatus = (message) => {
    const cleanMessage = message.replace(/Manual/gi, "").replace(/\(\)/g, "").trim();
    setShowDefaultMessage(false);   // hide default message
    setStatus(cleanMessage);

    setTimeout(() => {
      setStatus("");
      setShowDefaultMessage(true);  // show default message again
    }, 5000);
  };

  const formatTo12Hour = (time) => {
    const [hourStr, minuteStr] = time.split(":");
    let hour = parseInt(hourStr, 10);
    const minute = minuteStr.padStart(2, "0");
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour.toString().padStart(2, "0")}:${minute} ${ampm}`;
  };

  const turnOnLed = async () => {
    try {
      const res = await fetch(`${ESP_IP}/led/on`);
      if (!res.ok) throw new Error("Bad response");
      const text = await res.text();
      showStatus(text);

      setShowEmojis(true);
      setTimeout(() => setShowEmojis(false), 5000);
    } catch (err) {
      showStatus("❌ Error: Could not reach ESP8266");
    }
  };

  const setSchedule = async () => {
    try {
      const res = await fetch(
        `${ESP_IP}/setSchedule?dayHour=${dayHour}&dayMinute=${dayMinute}&nightHour=${nightHour}&nightMinute=${nightMinute}`
      );
      if (!res.ok) throw new Error("Bad response");
      const text = await res.text();
      showStatus(text);

      setSavedDay(`${dayHour.padStart(2, "0")}:${dayMinute.padStart(2, "0")}`);
      setSavedNight(`${nightHour.padStart(2, "0")}:${nightMinute.padStart(2, "0")}`);

      setShowClock(true);
      setTimeout(() => setShowClock(false), 5000);
    } catch (err) {
      showStatus("❌ Error: Could not reach ESP8266");
    }
  };

  return (
    <div className="bg-blue-100 min-h-screen">
      <section className="max-w-4xl mx-auto px-6 pt-0 pb-4 text-center font-sans">
        <br></br><h1 className="text-6xl font-extrabold text-gray-800 mb-8">Feed Your Lovely Pets !</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-8">
          🐱 Control & Scheduling 🐶
        </h2><br></br>

        {/* Send Meal */}
        <div className="mb-2 flex justify-center items-center gap-4">
          {showEmojis && <span className="emoji-fade-bounce text-2xl">🐾</span>}
          <button
            className="bg-[rgb(13,58,81)] hover:bg-[rgb(83,126,149)] text-white font-bold py-2 px-4 rounded shadow flex items-center"
            onClick={turnOnLed}
          >
            Send Meal
          </button>
          {showEmojis && <span className="emoji-fade-bounce text-2xl">🐾</span>}
        </div>

        {/* Popup space */}
        <div className="h-12 flex justify-center items-center mb-2">
          {showDefaultMessage && (
            <p className="popup-fade font-semibold text-gray-600">
              Ensure your pet is fed responsibly and thoughtfully.
            </p>
          )}
          {status && (
            <p
              className={`popup-fade font-semibold ${
                status.includes("❌") ? "text-red-600" : "text-gray-700"
              }`}
            >
              {status}
            </p>
          )}
        </div>

        {/* Schedule */}
        <div className="bg-white border border-gray-300 rounded-lg shadow p-6 max-w-md mx-auto mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Set Day Schedule</h3>
          <input
            type="time"
            id="dayTime"
            name="dayTime"
            value={`${dayHour.padStart(2, "0")}:${dayMinute.padStart(2, "0")}`}
            onChange={(e) => {
              const [hour, minute] = e.target.value.split(":");
              setDayHour(hour);
              setDayMinute(minute);
            }}
            className="custom-time-input mb-6"
          />

          <h3 className="text-lg font-semibold text-gray-800 mb-4">Set Night Schedule</h3>
          <div className="flex flex-col items-center gap-4 mb-6">
            <input
              type="time"
              id="nightTime"
              name="nightTime"
              value={`${nightHour.padStart(2, "0")}:${nightMinute.padStart(2, "0")}`}
              onChange={(e) => {
                const [hour, minute] = e.target.value.split(":");
                setNightHour(hour);
                setNightMinute(minute);
              }}
              className="custom-time-input"
            />

            <div className="flex justify-center items-center gap-4">
              {showClock && <span className="emoji-fade-bounce text-2xl">⏰</span>}
              <button
                className="bg-[rgb(13,58,81)] hover:bg-[rgb(83,126,149)] text-white font-bold py-2 px-4 rounded shadow flex items-center"
                onClick={setSchedule}
              >
                Save Schedule
              </button>
              {showClock && <span className="emoji-fade-bounce text-2xl">⏰</span>}
            </div>
          </div>
        </div>

        {/* Saved times */}
        {(savedDay || savedNight) && (
          <div className="bg-white border border-gray-300 rounded-lg shadow p-6 max-w-md mx-auto mb-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">📅 Current Schedule 📅</h3>
            {savedDay && (
              <p className="text-gray-700">Day Schedule: {formatTo12Hour(savedDay)}</p>
            )}
            {savedNight && (
              <p className="text-gray-700">Night Schedule: {formatTo12Hour(savedNight)}</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
