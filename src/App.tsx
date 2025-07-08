import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

function TourismMap() {
  const [places, setPlaces] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [view, setView] = useState<"map" | "cards">("map");

  useEffect(() => {
    axios
      .get("https://xadiufoakfmdygtjdihw.supabase.co/rest/v1/places", {
        headers: {
          apikey:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhZGl1Zm9ha2ZtZHlndGpkaWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5Njk4MDUsImV4cCI6MjA2NzU0NTgwNX0.jXBVkn3gTb5oe_0hgmvDWMIz0ll_sptK1f01MwUNgiA",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhZGl1Zm9ha2ZtZHlndGpkaWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5Njk4MDUsImV4cCI6MjA2NzU0NTgwNX0.jXBVkn3gTb5oe_0hgmvDWMIz0ll_sptK1f01MwUNgiA",
        },
      })
      .then((res) => {
        setPlaces(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const filteredPlaces = selectedCategory
    ? places.filter((p) => p.category === selectedCategory)
    : places;

  const categories = Array.from(new Set(places.map((p) => p.category)));

  return (
    <div style={{ padding: "20px" }}>
      {/* Toggle View Button */}
      <div style={{ marginBottom: "10px" }}>
        <button
          onClick={() => setView(view === "map" ? "cards" : "map")}
          style={{
            padding: "10px 20px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Switch to {view === "map" ? "Cards View" : "Map View"}
        </button>
      </div>

      {/* Category Filters */}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setSelectedCategory(null)}
          style={{
            padding: "10px",
            background: selectedCategory === null ? "#007bff" : "#eee",
            color: selectedCategory === null ? "white" : "black",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          All
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "10px",
              background: selectedCategory === cat ? "#007bff" : "#eee",
              color: selectedCategory === cat ? "white" : "black",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Views */}
      {view === "map" ? (
        <div style={{ height: "80vh" }}>
          <MapContainer
            center={[26.8206, 30.8025]}
            zoom={5}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            {filteredPlaces.map((place) => (
              <Marker key={place.id} position={[place.lat, place.lng]}>
                <Popup>
                  <h3>{place.name}</h3>
                  <img
                    src={place.image}
                    alt={place.name}
                    style={{ width: "200px", borderRadius: "8px" }}
                  />
                  <p>{place.description}</p>
                  <p>
                    <strong>Category:</strong> {place.category}
                  </p>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {filteredPlaces.map((place) => (
            <div
              key={place.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "10px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                background: "white",
              }}
            >
              <img
                src={place.image}
                alt={place.name}
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  marginBottom: "10px",
                }}
              />
              <h3>{place.name}</h3>
              <p style={{ fontSize: "14px", color: "#555" }}>
                {place.description}
              </p>
              <p>
                <strong>Category:</strong> {place.category}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TourismMap;
