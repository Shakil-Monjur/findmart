import { useState } from "react";
import { useLocationContext } from "../../context/LocationContext";
import { FaMapMarkerAlt, FaSpinner } from "react-icons/fa";
import "./../../styles/Location.css";

function Location() {
  const { userLocation, requestLocation } = useLocationContext();
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState(userLocation || null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser.");
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({ lat, lng });
        setLoading(false);
        if (requestLocation) requestLocation();
      },
      (err) => {
        console.error("Geolocation error:", err);
        setLoading(false);
        setErrorMsg("Location permission denied or unavailable.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const coordString = coords ? `Latitude: ${coords.lat}, Longitude: ${coords.lng}` : "";

  return (
    <div style={{ maxWidth: "540px", margin: "40px auto", padding: "24px", textAlign: "center" }}>
      <div className="location-section">
        <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>Your Current Location</h3>
        <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "20px" }}>
          Click the button below to retrieve your location using HTML5 Geolocation.
        </p>

        {errorMsg && (
          <div style={{ color: "#dc2626", marginBottom: "16px", fontSize: "14px", fontWeight: "600" }}>
            {errorMsg}
          </div>
        )}

        {coords && (
          <div style={{ marginBottom: "20px", textAlign: "left" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
              Verified Coordinates:
            </label>
            <input
              type="text"
              readOnly
              value={coordString}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #93c5fd",
                backgroundColor: "#eff6ff",
                fontSize: "14px",
                textAlign: "center",
                fontWeight: "600",
                color: "#1e40af",
                boxSizing: "border-box",
              }}
            />
          </div>
        )}

        <button
          className="location-btn"
          onClick={handleGetLocation}
          disabled={loading}
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", justifyContent: "center" }}
        >
          {loading ? <FaSpinner style={{ animation: "spin 1s linear infinite" }} /> : <FaMapMarkerAlt />}
          {loading ? "Getting Location..." : "Get Current Location"}
        </button>
      </div>
    </div>
  );
}

export default Location;