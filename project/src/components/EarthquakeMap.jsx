import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";

// --- Custom Marker Icons ---
const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const orangeIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// --- Helper: Pick icon based on magnitude ---
const getMarkerIcon = (mag) => {
  if (mag >= 6.0) return redIcon;
  if (mag >= 4.5) return orangeIcon;
  return greenIcon;
};

// --- Search Control Component ---
const SearchControl = () => {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      showMarker: true,
      showPopup: false,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: true,
    });

    map.addControl(searchControl);

    // ✅ Listen to "location selected" and zoom in
    map.on("geosearch/showlocation", (result) => {
      const { x, y } = result.location;
      map.flyTo([y, x], 8, { duration: 2 }); // Smooth zoom to level 8
    });

    return () => {
      map.removeControl(searchControl);
      map.off("geosearch/showlocation");
    };
  }, [map]);

  return null;
};

// --- Main Component ---
export default function EarthquakeMap({ minMag, onDataLoaded }) {
  const [earthquakes, setEarthquakes] = useState([]);

  useEffect(() => {
    axios
      .get("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson")
      .then((res) => {
        setEarthquakes(res.data.features);
        if (onDataLoaded) onDataLoaded(res.data.features);
      })
      .catch((err) => console.error("Error fetching earthquake data:", err));
  }, [onDataLoaded]);

  const filteredQuakes = earthquakes.filter((eq) => eq.properties.mag >= minMag);

  return (
    <div style={{ position: "relative" }}>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{
          height: "500px",
          width: "100%",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        {/* Base Map */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* 🔍 Search Bar */}
        <SearchControl />

        {/* Earthquake Markers */}
        <MarkerClusterGroup>
          {filteredQuakes.map((eq) => (
            <Marker
              key={eq.id}
              position={[eq.geometry.coordinates[1], eq.geometry.coordinates[0]]}
              icon={getMarkerIcon(eq.properties.mag)}
            >
              <Popup>
                <div style={{ fontFamily: "Arial, sans-serif", fontSize: "14px" }}>
                  <h3 style={{ margin: "0", color: "#d32f2f", fontSize: "16px" }}>
                    {eq.properties.place}
                  </h3>
                  <p style={{ margin: "5px 0" }}>
                    <b>Magnitude:</b> {eq.properties.mag}
                  </p>
                  <p style={{ margin: "5px 0" }}>
                    <b>Time:</b>{" "}
                    {new Date(eq.properties.time).toLocaleString()}
                  </p>
                  <a
                    href={eq.properties.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#1976d2" }}
                  >
                    More details
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
