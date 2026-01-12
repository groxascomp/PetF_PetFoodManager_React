// src/pages/Level.jsx
import React, { useState, useEffect, useRef } from "react";

export default function Level() {
  const [irStatus, setIrStatus] = useState("none");
  const ESP_IP = "http://10.58.198.63"; // 
  const audioRef = useRef(null); // 
  const prevStatus = useRef("none"); 

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

  // 👇 Play sound whenever status switches to "detected"
  useEffect(() => {
    if (irStatus === "detected" && prevStatus.current !== "detected" && audioRef.current) {
      audioRef.current.play();
    }
    prevStatus.current = irStatus;
  }, [irStatus]);

  return (
    <div
      className="h-[684px]"
      style={{
        background: `
          linear-gradient(-90deg, rgba(81, 104, 124, 0.0), rgba(56, 73, 111, 0.0)),
          url("/cat-food-bg.jpg") center/cover no-repeat fixed
        `,
        paddingTop: "60px",
      }}
    >
      <div
        className="bg-white shadow rounded-lg p-8 max-w-xl mx-auto text-center"
        style={{ paddingTop: "20px" }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Pet Level Status</h1>
        <p className="text-gray-600 mb-6"></p>
        <br />

        {/* IR status */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="text-lg font-medium text-gray-700">Food Level:</span>
          <span
            className={`w-4 h-4 rounded-full ${
              irStatus === "detected" ? "bg-green-500" : "bg-red-500"
            }`}
          ></span>
          <span className="text-gray-800 font-semibold">
            {irStatus === "detected"
              ? "Sufficient Food Available"
              : "Low Level"}
          </span>
        </div>

        {/* ✅ Show cat gif when green */}
        {irStatus === "detected" && (
          <div className="flex justify-center mb-6">
            <img
              src="/happy-cat.gif"
              alt="Happy cat"
              className="w-60 h-60"
            />
          </div>
        )}

        {/* ✅ Show sad cat gif when red */}
        {irStatus !== "detected" && (
          <div className="flex flex-col items-center mb-6">
            <img
              src="/SadCat.gif"
              alt="Sad cat"
              className="w-40 h-40 mb-4"
            />
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded relative">
              <strong className="font-bold">Notice: </strong>
              <span className="block sm:inline">
                Kindly replenish your food supply to ensure that we are able to
                provide your pet with the appropriate portion of meals each day.
                Maintaining a consistent stock of food helps us safeguard your
                pet’s health and well-being.
              </span>
            </div>
          </div>
        )}

        {/* ✅ Hidden audio element for Happy.m4a */}
        <audio ref={audioRef}>
          <source src="/Happy.m4a" type="audio/mp4" />
        </audio>
      </div>
    </div>
  );
}
