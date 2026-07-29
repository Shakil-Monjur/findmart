import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/shopOwner.css";

function AddProduct() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      const sellerId = user?._id || user?.id;

      const res = await fetch("https://findmart.onrender.com/api/products", {
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
        alert("Post created successfully!");
        navigate("/shop-dashboard");
      } else {
        alert(data.message || "Failed to create post");
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