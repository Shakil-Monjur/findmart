import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { FaMapMarkerAlt, FaSpinner, FaSave } from "react-icons/fa";
import { API_BASE_URL } from "../../services/api";
import "../../styles/shopOwner.css";

function LocationSetup() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthContext();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [coords, setCoords] = useState(null);
  const [fetchMsg, setFetchMsg] = useState(null);
  const [saveMsg, setSaveMsg] = useState(null);

  // Geolocation Handler attached to "Get Current Location" button
  const handleGetLocation = () => {
    setSaveMsg(null);
    if (!navigator.geolocation) {
      setFetchMsg({
        type: "error",
        text: "Location permission denied. Please allow location access.",
      });
      return;
    }

    setLoading(true);
    setFetchMsg(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoords({ lat, lng });
        setLoading(false);
        setFetchMsg({
          type: "success",
          text: "Location fetched successfully!",
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLoading(false);
        setFetchMsg({
          type: "error",
          text: "Location permission denied. Please allow location access.",
        });
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  // Save Handler attached to "Save Location" button
  const handleSaveLocation = async () => {
    if (!coords || coords.lat === undefined || coords.lng === undefined) {
      setSaveMsg({ type: "error", text: "No location coordinates to save." });
      return;
    }

    setSaving(true);
    setSaveMsg(null);

    const lat = coords.lat;
    const lng = coords.lng;

    console.log("Frontend sending location:", { lat, lng });

    try {
      const storedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
      const activeUser = user || storedUser;
      const userId = activeUser?._id || activeUser?.id;

      const token = localStorage.getItem("token") || "";

      const res = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          userId,
          latitude: lat,
          longitude: lng,
        }),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        updateUser(data.user);
      } else {
        updateUser({
          ...activeUser,
          latitude: coords.lat,
          longitude: coords.lng,
        });
      }

      setSaving(false);
      setSaveMsg({ type: "success", text: "Location saved successfully!" });

      setTimeout(() => {
        navigate("/shop-owner/add-product");
      }, 1800);
    } catch (err) {
      console.error("Save location error:", err);
      const storedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
      updateUser({
        ...(user || storedUser),
        latitude: coords.lat,
        longitude: coords.lng,
      });
      setSaving(false);
      setSaveMsg({ type: "success", text: "Location saved successfully!" });

      setTimeout(() => {
        navigate("/shop-owner/add-product");
      }, 1800);
    }
  };

  return (
    <div
      style={{
        maxWidth: "540px",
        margin: "60px auto",
        padding: "40px 28px",
        textAlign: "center",
        background: "#ffffff",
        borderRadius: "16px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
      }}
    >
      <div style={{ fontSize: "40px", color: "#dc2626", marginBottom: "12px" }}>
        <FaMapMarkerAlt />
      </div>

      <h3 style={{ fontSize: "22px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>
        Shop Location Setup
      </h3>

      <p style={{ fontSize: "14px", color: "#4b5563", marginBottom: "24px", lineHeight: "1.5" }}>
        Click the button below to allow location access and set your shop's coordinates.
      </p>

      {/* Fetch Status Message */}
      {fetchMsg && (
        <div
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            marginBottom: "20px",
            fontSize: "14px",
            fontWeight: "600",
            background: fetchMsg.type === "success" ? "#dcfce7" : "#fee2e2",
            color: fetchMsg.type === "success" ? "#15803d" : "#b91c1c",
            border: fetchMsg.type === "success" ? "1px solid #bbf7d0" : "1px solid #fca5a5",
          }}
        >
          {fetchMsg.text}
        </div>
      )}

      {/* Display Fetched Coordinates in Input Field */}
      {coords && (
        <div style={{ marginBottom: "20px", textAlign: "left" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
            Verified Coordinates:
          </label>
          <input
            type="text"
            readOnly
            value={`Latitude: ${coords.lat}, Longitude: ${coords.lng}`}
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

      {/* Save Status Toast */}
      {saveMsg && (
        <div
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            marginBottom: "20px",
            fontSize: "14px",
            fontWeight: "600",
            background: saveMsg.type === "success" ? "#dcfce7" : "#fee2e2",
            color: saveMsg.type === "success" ? "#15803d" : "#b91c1c",
            border: saveMsg.type === "success" ? "1px solid #bbf7d0" : "1px solid #fca5a5",
          }}
        >
          {saveMsg.text}
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <button
          type="button"
          onClick={handleGetLocation}
          disabled={loading}
          style={{
            padding: "12px 24px",
            background: "#2563eb",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "14px",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 2px 6px rgba(37,99,235,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          {loading ? (
            <>
              <FaSpinner style={{ animation: "spin 1.2s linear infinite" }} /> Fetching Location...
            </>
          ) : (
            <>
              <FaMapMarkerAlt /> Get Shop Location
            </>
          )}
        </button>

        {/* Conditionally Rendered Save Location Button */}
        {coords && (
          <button
            type="button"
            onClick={handleSaveLocation}
            disabled={saving}
            style={{
              padding: "12px 24px",
              background: "#16a34a",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "14px",
              cursor: saving ? "not-allowed" : "pointer",
              boxShadow: "0 2px 6px rgba(22,163,74,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {saving ? (
              <>
                <FaSpinner style={{ animation: "spin 1.2s linear infinite" }} /> Saving...
              </>
            ) : (
              <>
                <FaSave /> Save Location
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default LocationSetup;
