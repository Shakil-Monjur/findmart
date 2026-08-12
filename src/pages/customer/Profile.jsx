import { useState, useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";
import LocationPicker from "../../components/common/LocationPicker";
import { FaCamera, FaMapMarkerAlt } from "react-icons/fa";
import { API_BASE_URL, SERVER_BASE_URL } from "../../services/api";
import "../../styles/profile.css";

function Profile() {
  const { user, updateUser } = useAuthContext();
  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [previewPic, setPreviewPic] = useState("");

  // Location state as required by rule
  const [location, setLocation] = useState({
    lat: user?.latitude || user?.lat || 23.8103,
    lng: user?.longitude || user?.lng || 90.4125,
  });

  // Toast notification state
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || user.username || user.name || "");
      setEmail(user.email || "");
      setRole(user.role || "Customer");
      setPreviewPic(user.profilePicture || user.profilePic || user.avatar || defaultAvatar);

      const userLat = user.latitude !== undefined && user.latitude !== null ? Number(user.latitude) : user.lat;
      const userLng = user.longitude !== undefined && user.longitude !== null ? Number(user.longitude) : user.lng;

      if (userLat && userLng && !isNaN(userLat) && !isNaN(userLng)) {
        setLocation({ lat: userLat, lng: userLng });
      }
    }
  }, [user]);

  const handleImageUpload = async (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewPic(reader.result);
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("profilePicture", file);
    const userId = user?._id || user?.id;
    if (userId) {
      formData.append("userId", userId);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/users/update-profile-picture`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.user) {
        updateUser(data.user);
        setPreviewPic(data.user.profilePicture || data.user.profilePic);
        setToast({ type: "success", message: "Profile picture updated and saved!" });
      } else {
        updateUser({ profilePicture: previewPic, profilePic: previewPic });
        setToast({ type: "error", message: data.message || "Failed to save profile picture." });
      }
    } catch (err) {
      console.error("Upload error:", err);
      updateUser({ profilePicture: previewPic, profilePic: previewPic });
      setToast({ type: "error", message: "Error uploading profile picture." });
    }
    setTimeout(() => setToast(null), 3500);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  // Handler for Save Location button
  const handleSaveLocation = async (e) => {
    if (e) e.preventDefault();
    setToast(null);

    if (!location || location.lat === undefined || location.lng === undefined) {
      setToast({ type: "error", message: "Please pick a location on the map before saving." });
      setTimeout(() => setToast(null), 3500);
      return;
    }

    const lat = location.lat;
    const lng = location.lng;

    console.log("Frontend sending location:", { lat, lng });

    const userId = user?._id || user?.id;

    try {
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
        setToast({ type: "success", message: "Shop location saved successfully!" });
      } else {
        const updatedLocal = { ...user, latitude: location.lat, longitude: location.lng };
        updateUser(updatedLocal);
        setToast({ type: "success", message: "Shop location updated!" });
      }
    } catch (err) {
      console.error("Save location error:", err);
      const updatedLocal = { ...user, latitude: location.lat, longitude: location.lng };
      updateUser(updatedLocal);
      setToast({ type: "success", message: "Shop location updated!" });
    }

    setTimeout(() => setToast(null), 3500);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setToast(null);

    const userId = user?._id || user?.id;

    try {
      const res = await fetch(`${API_BASE_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : "",
        },
        body: JSON.stringify({
          userId,
          fullName,
          email,
          latitude: location.lat,
          longitude: location.lng,
        }),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        updateUser(data.user);
        setToast({ type: "success", message: "Profile details saved successfully!" });
      } else {
        updateUser({
          ...user,
          fullName,
          email,
          latitude: location.lat,
          longitude: location.lng,
        });
        setToast({ type: "success", message: "Profile details updated!" });
      }
    } catch (err) {
      console.error("Save profile error:", err);
      updateUser({
        ...user,
        fullName,
        email,
        latitude: location.lat,
        longitude: location.lng,
      });
      setToast({ type: "success", message: "Profile details updated!" });
    }

    setTimeout(() => setToast(null), 3500);
  };

  const getAvatarUrl = (url) => {
    if (!url) return defaultAvatar;
    if (url.startsWith("data:") || url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    if (url.startsWith("/")) {
      return `${SERVER_BASE_URL}${url}`;
    }
    return `${SERVER_BASE_URL}/${url}`;
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar-wrapper">
          <img
            src={getAvatarUrl(previewPic)}
            alt="Profile Preview"
            className="profile-avatar-preview"
          />
          <label htmlFor="profilePicInput" className="avatar-upload-label" title="Upload new photo">
            <FaCamera />
          </label>
          <input
            type="file"
            id="profilePicInput"
            accept="image/*"
            className="avatar-file-input"
            onChange={handleImageChange}
          />
        </div>

        <div className="profile-title-group">
          <h2>{fullName || "User Profile"}</h2>
          <span className="profile-role-badge">{role}</span>
        </div>
      </div>

      {/* Toast Notification Banner */}
      {toast && (
        <div
          style={{
            padding: "12px 18px",
            background: toast.type === "success" ? "#dcfce7" : "#fee2e2",
            color: toast.type === "success" ? "#15803d" : "#b91c1c",
            border: toast.type === "success" ? "1px solid #bbf7d0" : "1px solid #fca5a5",
            borderRadius: "8px",
            marginBottom: "20px",
            fontSize: "14px",
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          {toast.message}
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="profile-form">
        <div className="profile-field-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            className="profile-input"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div className="profile-field-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            className="profile-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Location Picker Section */}
        <div className="profile-field-group" style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #f3f4f6" }}>
          <label style={{ fontWeight: "700", color: "#111827", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
            <FaMapMarkerAlt style={{ color: "#dc2626" }} /> Shop Location Setup
          </label>

          {location.lat && location.lng ? (
            <div style={{ padding: "10px 14px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "8px", fontSize: "13px", color: "#1e40af", marginBottom: "12px" }}>
              📍 Selected Coordinates: <strong>Lat {Number(location.lat).toFixed(5)}, Lng {Number(location.lng).toFixed(5)}</strong>
            </div>
          ) : (
            <div style={{ padding: "10px 14px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "13px", color: "#6b7280", marginBottom: "12px" }}>
              Click anywhere on the map below to set your location pin.
            </div>
          )}

          <LocationPicker
            initialLocation={{ lat: Number(location.lat || 23.8103), lng: Number(location.lng || 90.4125) }}
            onLocationSelect={(coords) => setLocation({ lat: coords.lat, lng: coords.lng })}
          />

          <button
            type="button"
            onClick={handleSaveLocation}
            style={{
              marginTop: "14px",
              padding: "12px 24px",
              background: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "14px",
              cursor: "pointer",
              width: "100%",
              boxShadow: "0 2px 6px rgba(37,99,235,0.25)",
            }}
          >
            Save Location
          </button>
        </div>

        <button type="submit" className="profile-save-btn" style={{ marginTop: "16px" }}>
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default Profile;