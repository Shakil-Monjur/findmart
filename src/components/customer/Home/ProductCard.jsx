import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaHeart, FaRegHeart, FaShoppingCart, FaCheck } from "react-icons/fa";
import { useSavedContext } from "../../../context/SavedContext";
import { useCartContext } from "../../../context/CartContext";
import "./../../../styles/productCard.css";

function ProductCard({ product }) {
  const { isSaved, toggleSave } = useSavedContext();
  const { addToCart } = useCartContext();
  const [added, setAdded] = useState(false);

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const checkUser = () => {
      try {
        const stored = localStorage.getItem("user");
        setUser(stored ? JSON.parse(stored) : null);
      } catch {
        setUser(null);
      }
    };
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, []);

  const isShopOwner =
    user?.role === "Shop Owner" || user?.role === "seller" || user?.role === "owner";
  const isBuyer = !isShopOwner;

  const productId = product?._id || product?.id;
  const saved = isSaved(productId);

  const handleHeartClick = (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (!token && !storedUser) {
      alert("Please login or sign up first to access this feature.");
      return;
    }
    if (product) {
      toggleSave(product);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (product) {
      addToCart(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    }
  };

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("data:") || url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    if (url.startsWith("/")) {
      return `https://findmart.onrender.com${url}`;
    }
    return `https://findmart.onrender.com/${url}`;
  };

  const imageSrc = getImageUrl(product?.image);
  const title = product?.title || "product photo";
  const sellerName =
    product?.seller?.fullName ||
    product?.seller?.name ||
    product?.owner?.fullName ||
    product?.owner?.name ||
    "Shop Name";

  const price = product?.price !== undefined ? product.price : 15;
  const description = product?.description || "Description about product ...";

  const defaultSellerAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  const rawSellerAvatar =
    product?.seller?.profilePicture ||
    product?.seller?.profilePic ||
    product?.seller?.avatar ||
    product?.owner?.profilePicture ||
    product?.owner?.profilePic ||
    product?.owner?.avatar;

  const getSellerAvatarUrl = (url) => {
    if (!url) return defaultSellerAvatar;
    if (url.startsWith("data:") || url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    if (url.startsWith("/")) {
      return `https://findmart.onrender.com${url}`;
    }
    return `https://findmart.onrender.com/${url}`;
  };

  const sellerAvatarUrl = getSellerAvatarUrl(rawSellerAvatar);

  return (
    <div className="product-card">
      <div className="product-photo-box">
        {isBuyer && (
          <button
            className={`heart-btn ${saved ? "saved" : ""}`}
            onClick={handleHeartClick}
            title={saved ? "Remove from saved" : "Save product"}
            aria-label="Save product"
          >
            {saved ? (
              <FaHeart className="heart-icon filled" />
            ) : (
              <FaRegHeart className="heart-icon outline" />
            )}
          </button>
        )}

        {imageSrc ? (
          <img
            src={imageSrc}
            alt={title}
            className="product-image"
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }}
          />
        ) : (
          <span>{title}</span>
        )}
      </div>

      <div className="product-card-body">
        <div className="product-card-middle">
          <div className="shop-info-left">
            <img
              src={sellerAvatarUrl}
              alt={sellerName}
              className="shop-owner-avatar"
              style={{
                width: "26px",
                height: "26px",
                borderRadius: "50%",
                objectFit: "cover",
                flexShrink: 0,
                border: "1px solid #e5e7eb",
              }}
            />
            <span className="shop-title">{sellerName}</span>
          </div>
          <span className="product-price">$ {price}</span>
        </div>

        <p className="product-description">{description}</p>

        <button
          className={`add-to-cart-btn ${added ? "added" : ""}`}
          onClick={handleAddToCart}
        >
          {added ? (
            <>
              <FaCheck style={{ marginRight: "6px" }} /> Added to Cart!
            </>
          ) : (
            <>
              <FaShoppingCart style={{ marginRight: "6px" }} /> Add to Cart
            </>
          )}
        </button>

        <div className="product-card-footer">
          <span>500 m Away</span>
          <FaMapMarkerAlt className="distance-icon" />
        </div>
      </div>
    </div>
  );
}

export default ProductCard;