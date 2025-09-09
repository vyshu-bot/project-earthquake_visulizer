import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function EarthquakeChart({ earthquakes }) {
  if (!earthquakes || earthquakes.length === 0) {
    return <p className="text-center text-gray-500 mt-4">No data to display</p>;
  }

  // Group by region (just first part of "place")
  const regionCounts = {};
  earthquakes.forEach((eq) => {
    const region = eq.properties.place?.split(",").pop().trim() || "Unknown";
    regionCounts[region] = (regionCounts[region] || 0) + 1;
  });

  const regionData = Object.entries(regionCounts).map(([region, count]) => ({
    region,
    count,
  }));

  // Group by magnitude range
  const ranges = { "0–2.5": 0, "2.5–4.5": 0, "4.5–6.0": 0, "6.0+": 0 };
  earthquakes.forEach((eq) => {
    const mag = eq.properties.mag;
    if (mag < 2.5) ranges["0–2.5"]++;
    else if (mag < 4.5) ranges["2.5–4.5"]++;
    else if (mag < 6.0) ranges["4.5–6.0"]++;
    else ranges["6.0+"]++;
  });

  const magnitudeData = Object.entries(ranges).map(([range, count]) => ({
    range,
    count,
  }));

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Earthquakes by Region */}
      <div className="bg-white shadow-lg rounded-xl p-4">
        <h2 className="text-lg font-bold mb-2 text-center">🌎 Quakes by Region</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={regionData.slice(0, 8)} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="region" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Earthquakes by Magnitude */}
      <div className="bg-white shadow-lg rounded-xl p-4">
        <h2 className="text-lg font-bold mb-2 text-center">📊 Quakes by Magnitude</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={magnitudeData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
