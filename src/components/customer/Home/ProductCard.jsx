import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaHeart, FaRegHeart, FaShoppingCart, FaCheck } from "react-icons/fa";
import { useSavedContext } from "../../../context/SavedContext";
import { useCartContext } from "../../../context/CartContext";
import { useLocationContext } from "../../../context/LocationContext";
import { calculateDistance } from "../../../utils/distanceCalculator";
import { SERVER_BASE_URL } from "../../../services/api";
import "./../../../styles/productCard.css";

const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

function ProductCard({ product, customerLat, customerLng, onRouteClick }) {
  const { isSaved, toggleSave } = useSavedContext();
  const { addToCart } = useCartContext();
  const { userLocation, userLat: contextUserLat, userLng: contextUserLng } = useLocationContext();
  const [added, setAdded] = useState(false);

  // Extract seller/owner data strictly as specified by Rule 3
  const sellerData = product?.seller || product?.owner;
  const shopLat =
    sellerData?.latitude !== undefined && sellerData?.latitude !== null && !isNaN(sellerData.latitude)
      ? Number(sellerData.latitude)
      : null;

  const shopLng =
    sellerData?.longitude !== undefined && sellerData?.longitude !== null && !isNaN(sellerData.longitude)
      ? Number(sellerData.longitude)
      : null;

  const userLat =
    customerLat !== undefined && customerLat !== null && !isNaN(customerLat)
      ? Number(customerLat)
      : userLocation?.lat !== undefined && userLocation?.lat !== null && !isNaN(userLocation.lat)
      ? Number(userLocation.lat)
      : contextUserLat;

  const userLng =
    customerLng !== undefined && customerLng !== null && !isNaN(customerLng)
      ? Number(customerLng)
      : userLocation?.lng !== undefined && userLocation?.lng !== null && !isNaN(userLocation.lng)
      ? Number(userLocation.lng)
      : contextUserLng;

  let distanceText = "Distance unavailable";

  if (
    shopLat !== null &&
    shopLng !== null &&
    userLat !== null &&
    userLat !== undefined &&
    userLng !== null &&
    userLng !== undefined &&
    !isNaN(userLat) &&
    !isNaN(userLng)
  ) {
    const computed = calculateDistance(userLat, userLng, shopLat, shopLng);
    if (computed) {
      distanceText = computed;
    }
  }

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

  const handleDistanceClick = (e) => {
    e.stopPropagation();
    if (onRouteClick && shopLat !== null && shopLng !== null) {
      onRouteClick({ lat: shopLat, lng: shopLng, shopName: sellerName });
    }
  };

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("data:") || url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    if (url.startsWith("/")) {
      return `${SERVER_BASE_URL}${url}`;
    }
    return `${SERVER_BASE_URL}/${url}`;
  };

  const imageSrc = getImageUrl(product?.image);
  const title = product?.title || "product photo";
  const sellerName =
    sellerData?.fullName ||
    sellerData?.name ||
    "Shop Name";

  const price = product?.price !== undefined ? product.price : 15;
  const description = product?.description || "Description about product ...";

  const rawSellerAvatar =
    sellerData?.profilePicture ||
    sellerData?.profilePic ||
    sellerData?.avatar;

  const getSellerAvatarUrl = (url) => {
    if (!url) return defaultAvatar;
    if (url.startsWith("data:") || url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    if (url.startsWith("/")) {
      return `${SERVER_BASE_URL}${url}`;
    }
    return `${SERVER_BASE_URL}/${url}`;
  };

  const sellerAvatarUrl = getSellerAvatarUrl(rawSellerAvatar);

  console.log("DEBUG FRONTEND - Product:", product?.title || product?.name, "Seller Data:", sellerData);

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

        <div
          className="product-card-footer"
          onClick={handleDistanceClick}
          style={{
            cursor: shopLat !== null && shopLng !== null ? "pointer" : "default",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          title="Click to view road route on map"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span>{distanceText}</span>
            <FaMapMarkerAlt className="distance-icon" />
          </div>

          {shopLat !== null && shopLng !== null && (
            <button
              type="button"
              className="view-route-btn"
              onClick={handleDistanceClick}
              style={{
                background: "#eff6ff",
                color: "#2563eb",
                border: "1px solid #bfdbfe",
                borderRadius: "6px",
                padding: "4px 8px",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              View Road Route
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;