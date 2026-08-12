import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { API_BASE_URL } from "../../services/api";
import "../../styles/shopOwner.css";

function AddProduct() {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  const storedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const activeUser = user || storedUser;

  const hasLocation =
    activeUser &&
    activeUser.latitude !== undefined &&
    activeUser.latitude !== null &&
    activeUser.longitude !== undefined &&
    activeUser.longitude !== null;

  if (!hasLocation) {
    return (
      <div
        style={{
          maxWidth: "600px",
          margin: "40px auto",
          padding: "36px 24px",
          textAlign: "center",
          background: "#ffffff",
          border: "1px solid #fecaca",
          borderRadius: "16px",
          boxShadow: "0 4px 16px rgba(220,38,38,0.08)",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>⚠️</div>
        <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#991b1b", margin: "0 0 10px 0" }}>
          Shop Location Required
        </h3>
        <p style={{ fontSize: "15px", color: "#4b5563", margin: "0 0 24px 0", lineHeight: "1.5" }}>
          Please set your shop location in your profile before adding products.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => navigate("/shop-owner/location")}
            style={{
              padding: "12px 24px",
              background: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "14px",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(37,99,235,0.25)",
            }}
          >
            Auto-Detect Location
          </button>
          <button
            onClick={() => navigate("/shop-owner/profile")}
            style={{
              padding: "12px 24px",
              background: "#dc2626",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "14px",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(220,38,38,0.25)",
            }}
          >
            Go to Profile to Set Location
          </button>
        </div>
      </div>
    );
  }

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      const sellerId = activeUser?._id || activeUser?.id;

      const res = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title,
          description,
          price: Number(price),
          image,
          seller: sellerId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Product posted successfully!");
        navigate("/shop-dashboard");
      } else {
        alert(data.message || "Failed to create product post");
      }
    } catch (error) {
      console.error("Post creation error:", error);
      alert("An error occurred while creating post");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "20px" }}>
        Post a New Product
      </h2>
      <form onSubmit={handlePostSubmit} className="post-form">
        <div className="form-group">
          <label>Product Title</label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter product title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            className="form-textarea"
            placeholder="Enter product description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Price ($)</label>
          <input
            type="number"
            className="form-input"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Image URL</label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>

        <div className="form-actions" style={{ marginTop: "20px" }}>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/shop-dashboard")}
          >
            Cancel
          </button>
          <button type="submit" className="btn-submit">
            Create Post
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;