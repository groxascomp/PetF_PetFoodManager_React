import React, { useState, useEffect } from "react";

export default function Level() {
  const [irStatus, setIrStatus] = useState("none");
  const ESP_IP = "http://192.168.8.139"; // your ESP8266 IP

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${ESP_IP}/irStatus`);
        if (!res.ok) throw new Error("Bad response");
        const data = await res.json();
        setIrStatus(data.status);
      } catch {
        setIrStatus("none");
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
  className="h-[684px]"
  style={{ backgroundColor: "rgb(189, 222, 238)",
    paddingTop:"90px",
   }}>
      <div className="bg-white shadow rounded-lg p-8 max-w-xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Pet Level Status</h1>
        <p className="text-gray-600 mb-6">
          
        </p><br></br>

        {/* IR status */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="text-lg font-medium text-gray-700">Food Level:</span>
          <span
            className={`w-4 h-4 rounded-full ${
              irStatus === "detected" ? "bg-green-500" : "bg-red-500"
            }`}
          ></span>
          <span className="text-gray-800 font-semibold">
            {irStatus === "detected" ? "Sufficient Food Available" : "Low Level"}
          </span>
        </div>

        {/* Show message if status is red */}
        {irStatus !== "detected" && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded relative">
            <strong className="font-bold">Notice: </strong>
            <span className="block sm:inline">
              Kindly replenish your food supply to ensure that we are able to provide your pet with the appropriate portion of meals each day. Maintaining a consistent stock of food helps us safeguard your pet’s health and well-being.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
