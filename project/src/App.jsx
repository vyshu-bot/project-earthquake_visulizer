import React, { useState } from "react";
import EarthquakeMap from "./components/EarthquakeMap";
import EarthquakeChart from "./components/EarthquakeChart";

export default function App() {
  const [minMag, setMinMag] = useState(0);
  const [earthquakeData, setEarthquakeData] = useState([]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-100 via-white to-blue-200">
      {/* Header */}
      <header className="p-6 bg-gradient-to-r from-blue-700 to-blue-500 shadow-lg text-white">
        <h1 className="text-3xl font-extrabold tracking-wide text-center">
          🌍 Earthquake Visualizer
        </h1>
        <p className="text-center text-sm mt-2 opacity-90">
          Live data from USGS Earthquake API
        </p>
      </header>

      {/* Controls */}
      <div className="p-4 flex justify-center bg-white shadow-md">
        <div className="flex items-center gap-3">
          <label className="font-semibold text-gray-700">Min Magnitude:</label>
          <select
            value={minMag}
            onChange={(e) => setMinMag(Number(e.target.value))}
            className="px-3 py-2 border rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value={0}>All</option>
            <option value={2.5}>2.5+</option>
            <option value={4.5}>4.5+</option>
            <option value={6.0}>6.0+</option>
          </select>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 p-4">
        <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200">
          <EarthquakeMap minMag={minMag} onDataLoaded={setEarthquakeData} />
        </div>
      </div>

      {/* Charts */}
      <EarthquakeChart earthquakes={earthquakeData} />

      {/* Footer */}
      <footer className="p-3 text-center text-xs text-gray-600 bg-gray-100">
        Built with ❤️ using React, Leaflet & TailwindCSS
      </footer>
    </div>
  );
}
