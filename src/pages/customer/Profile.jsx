import { useState, useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { FaCamera } from "react-icons/fa";
import "../../styles/profile.css";

function Profile() {
  const { user, updateUser } = useAuthContext();

  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [previewPic, setPreviewPic] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || user.username || user.name || "");
      setEmail(user.email || "");
      setRole(user.role || "Customer");
      setPreviewPic(user.profilePicture || user.profilePic || user.avatar || defaultAvatar);
    }
  }, [user]);

  const handleImageUpload = async (file) => {
    if (!file) return;

    // Show instant local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewPic(reader.result);
    };
    reader.readAsDataURL(file);

    // Create FormData for backend file upload
    const formData = new FormData();
    formData.append("profilePicture", file);
    const userId = user?._id || user?.id;
    if (userId) {
      formData.append("userId", userId);
    }

    try {
      const res = await fetch("https://findmart.onrender.com/api/users/update-profile-picture", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.user) {
        // Update global Auth Context and localStorage with new user data from backend
        updateUser(data.user);
        setPreviewPic(data.user.profilePicture || data.user.profilePic);
        setSuccessMsg("Profile picture updated and saved to database!");
        setTimeout(() => setSuccessMsg(""), 3500);
      } else {
        // Fallback: update local auth context if backend returns non-ok
        updateUser({ profilePicture: previewPic, profilePic: previewPic });
        alert(data.message || "Failed to save profile picture to server.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      // Fallback local update
      updateUser({ profilePicture: previewPic, profilePic: previewPic });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser({
      fullName,
      email,
      role,
      profilePicture: previewPic,
      profilePic: previewPic,
    });
    setSuccessMsg("Profile details saved successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar-wrapper">
          <img
            src={previewPic || defaultAvatar}
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

      {successMsg && (
        <div
          style={{
            padding: "10px 16px",
            background: "#dcfce7",
            color: "#15803d",
            borderRadius: "8px",
            marginBottom: "20px",
            fontSize: "14px",
            fontWeight: "500",
            textAlign: "center",
          }}
        >
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="profile-form">
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

        <div className="profile-field-group">
          <label htmlFor="uploadPhoto">Upload Profile Picture</label>
          <input
            type="file"
            id="uploadPhoto"
            accept="image/*"
            onChange={handleImageChange}
            className="profile-input"
            style={{ background: "#ffffff", padding: "8px" }}
          />
        </div>

        <button type="submit" className="profile-save-btn">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default Profile;