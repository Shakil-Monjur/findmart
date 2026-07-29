import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import OwnerProductCard from "../../components/shopOwner/OwnerProductCard";
import "../../styles/shopOwner.css";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states for creating post
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  // Modal states for editing post
  const [editingProduct, setEditingProduct] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editImage, setEditImage] = useState("");

  // Fetch seller's products
  const fetchSellerProducts = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;
      const user = JSON.parse(storedUser);
      const userId = user._id || user.id;

      const res = await fetch(`https://findmart.onrender.com/api/products/seller/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        const fallbackRes = await fetch("https://findmart.onrender.com/api/products");
        if (fallbackRes.ok) {
          const allData = await fallbackRes.json();
          const userProducts = allData.filter(
            (p) => (p.seller?._id || p.seller?.id || p.seller) === userId
          );
          setProducts(userProducts);
        }
      }
    } catch (err) {
      console.error("Error fetching seller products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerProducts();
  }, []);

  // Handle submit for creating a post
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
        setTitle("");
        setDescription("");
        setPrice("");
        setImage("");
        setIsPostModalOpen(false);
        setProducts((prev) => [data, ...prev]);
      } else {
        alert(data.message || "Failed to create post");
      }
    } catch (error) {
      console.error("Post creation error:", error);
      alert("An error occurred while creating post");
    }
  };

  // Open Edit modal
  const handleOpenEdit = (product) => {
    if (!product) return;
    setEditingProduct(product);
    setEditTitle(product.title || "");
    setEditDescription(product.description || "");
    setEditPrice(product.price !== undefined ? product.price : "");
    setEditImage(product.image || "");
  };

  // Handle submit for editing a post
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://findmart.onrender.com/api/products/${editingProduct._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          price: Number(editPrice),
          image: editImage,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Post updated successfully!");
        setProducts((prev) =>
          prev.map((p) => (p._id === editingProduct._id ? data : p))
        );
        setEditingProduct(null);
      } else {
        alert(data.message || "Failed to update post");
      }
    } catch (err) {
      console.error("Error updating post:", err);
      alert("An error occurred while updating post");
    }
  };

  return (
    <div className="shop-owner-dashboard">
      {/* Top Tabs */}
      <div className="owner-tabs">
        <NavLink
          to="/shop-owner"
          end
          className={({ isActive }) => (isActive ? "owner-tab-item active" : "owner-tab-item")}
        >
          All Product
        </NavLink>
        <NavLink
          to="/shop-owner/location"
          className={({ isActive }) => (isActive ? "owner-tab-item active" : "owner-tab-item")}
        >
          Location
        </NavLink>
        <NavLink
          to="/shop-owner/orders"
          className={({ isActive }) => (isActive ? "owner-tab-item active" : "owner-tab-item")}
        >
          Order
        </NavLink>
        <NavLink
          to="/shop-owner/sales"
          className={({ isActive }) => (isActive ? "owner-tab-item active" : "owner-tab-item")}
        >
          Sells
        </NavLink>
      </div>

      {/* Post a Product Action Button */}
      <button className="post-product-btn" onClick={() => setIsPostModalOpen(true)}>
        Post a product
      </button>

      {/* Create Product Modal */}
      {isPostModalOpen && (
        <div className="modal-overlay" onClick={() => setIsPostModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Post a New Product</h3>
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

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsPostModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Create Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="modal-overlay" onClick={() => setEditingProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Edit Product Post</h3>
            <form onSubmit={handleEditSubmit} className="post-form">
              <div className="form-group">
                <label>Product Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter product title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-textarea"
                  placeholder="Enter product description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Price ($)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Enter price"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter image URL"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Shop Owner Product Cards Grid */}
      <div className="owner-product-grid">
        {products.length > 0 ? (
          products.map((p) => (
            <OwnerProductCard key={p._id} product={p} onEdit={handleOpenEdit} />
          ))
        ) : (
          <>
            <OwnerProductCard onEdit={handleOpenEdit} />
            <OwnerProductCard onEdit={handleOpenEdit} />
            <OwnerProductCard onEdit={handleOpenEdit} />
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;