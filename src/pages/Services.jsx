// src/pages/Services.jsx
import { useEffect, useState } from "react";
import { CheckCircleIcon, UserIcon } from "@heroicons/react/24/solid";

export default function Services() {
  const [logs, setLogs] = useState([]);

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

  function fetchLogs() {
    fetch("https://petfeeder-8cf87-default-rtdb.asia-southeast1.firebasedatabase.app/logs.json")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          const entries = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          entries.sort((a, b) => parseTimestamp(b.timestamp) - parseTimestamp(a.timestamp));
          setLogs(entries);
        } else {
          setLogs([]);
        }
      })
      .catch((err) => console.error("Error fetching logs:", err));
  }

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  function getIcon(event) {
    const lower = event.toLowerCase();
    if (lower.includes("manual")) {
      return <UserIcon className="h-5 w-5 text-blue-500 mr-2" />;
    }
    if (lower.includes("scheduled")) {
      return <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />;
    }
    return null;
  }

  // Tracker calculations
  const today = new Date().toDateString();
  const mealsToday = logs.filter(
    (log) => new Date(parseTimestamp(log.timestamp)).toDateString() === today
  ).length;

  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const mealsThisWeek = logs.filter(
    (log) => parseTimestamp(log.timestamp) >= startOfWeek
  ).length;

  const unscheduledMeals = logs.filter((log) =>
    log.event.toLowerCase().includes("manual")
  ).length;

  // Notification message logic
  const getNotificationMessage = () => {
    if (mealsToday === 3) {
      return "I would like to inform you that your pet’s daily food intake has exceeded the average recommended meal portion. It may be beneficial to monitor their diet closely to ensure balanced nutrition and overall well-being.";
    }
    if (mealsToday === 4) {
      return "Providing your dog with meals that exceed the recommended portions may lead to a series of health problems. It is advisable to maintain a balanced feeding schedule to safeguard your pet’s overall well-being.";
    }
    if (mealsToday >= 5) {
      return "Bro Stop, your dog is Chunk Dog now";
    }
    return null;
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: `
          linear-gradient(-90deg, rgba(81, 104, 124, 0.0), rgba(56, 73, 111, 0.0)),
          url("/cat-food-bg.jpg") center/cover no-repeat fixed
        `,
        paddingTop: "0px",
        paddingBottom: "00px",
      }}
    >
      <section className="max-w-4xl mx-auto px-4 pt-4 pb-12 text-center font-sans"
      style={{ paddingTop: "00px", }}
      >
        <h1 className="text-6xl font-extrabold text-gray-800 mb-6">Tracking Food</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-8">🍽️ Food Served History 🍽️</h2><br />

        {/* Tracker Grid */}
        <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto mb-8">
          <div className="bg-white border border-blue-200 rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-gray-700 font-semibold text-lg mb-2">Average Meal per Day</span>
            <span className="text-blue-600 font-bold text-3xl">{mealsToday}</span>
          </div>
          <div className="bg-white border border-green-200 rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-gray-700 font-semibold text-lg mb-2">Meals This Week</span>
            <span className="text-green-600 font-bold text-3xl">{mealsThisWeek}</span>
          </div>
          <div className="bg-white border border-red-200 rounded-lg shadow p-6 flex flex-col items-center">
            <span className="text-gray-700 font-semibold text-lg mb-2">Unscheduled Meals</span>
            <span className="text-red-600 font-bold text-3xl">{unscheduledMeals}</span>
          </div>
        </div>

        {/* Notification below tracker */}
        {getNotificationMessage() && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded relative mb-12 max-w-2xl mx-auto">
            <strong className="font-bold">Notice: </strong>
            <span className="block sm:inline">{getNotificationMessage()}</span>
          </div>
        )}

        {/* Logs Table */}
        {logs.length === 0 ? (
          <p className="text-gray-500 font-medium">No food served yet.</p>
        ) : (
          <div className="overflow-x-auto w-full max-w-2xl mx-auto mt-8">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg shadow-sm text-center font-sans bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                    Event
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                    Date & Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log, index) => (
                  <tr key={log.id} className={index === 0 ? "bg-blue-50" : ""}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium text-center">
                      <div className="flex items-center justify-center">
                        {getIcon(log.event)}
                        <span>{log.event}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium text-center">
                      {log.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
