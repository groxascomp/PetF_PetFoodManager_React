import React, { useEffect, useState } from "react";

export default function Blog() {
  const [petFact, setPetFact] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPetFact = async () => {
    setLoading(true);
    setError("");
    try {
      // Randomly choose between cat or dog fact API
      const sources = [
        { type: "cat", url: "https://catfact.ninja/fact" },
        { type: "dog", url: "https://dogapi.dog/api/v2/facts" },
      ];
      const choice = sources[Math.floor(Math.random() * sources.length)];

      const res = await fetch(choice.url);
      if (!res.ok) throw new Error("Failed to fetch pet fact");
      const data = await res.json();

      if (choice.type === "cat") {
        setPetFact("🐱 " + data.fact);
      } else if (choice.type === "dog") {
        setPetFact("🐶 " + data.data[0].attributes.body);
      }
    } catch (err) {
      setError("Oops! Could not fetch a pet fact right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPetFact();
  }, []);

  return (
    <div
  className="h-[684px]"
  style={{ backgroundColor: "rgb(189, 222, 238)",
    paddingTop:"90px",
   }}
>
      <div className="bg-white shadow rounded-lg p-8 max-w-xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">🐾 Pet Facts Blog</h1>
        <br></br><p className="text-gray-600 mb-6">
          Discover fun and quirky facts about pets!
        </p><br></br>

        {loading && <p className="text-gray-500">Loading a pet fact...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded mb-6">
            <span className="block">{petFact}</span>
          </div>
        )}

        <button
          onClick={fetchPetFact}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
        >
          Get Another Fact
        </button>
      </div>
    </div>
  );
}
