import { useState, useEffect } from "react";
import { SERVER_BASE_URL } from "../../services/api";

function OwnerProductCard({ product, onEdit }) {
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
    product?.seller?.fullName ||
    product?.seller?.name ||
    product?.owner?.fullName ||
    product?.owner?.name ||
    user?.fullName ||
    user?.username ||
    user?.name ||
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
    product?.owner?.avatar ||
    user?.profilePicture ||
    user?.profilePic ||
    user?.avatar;

  const getSellerAvatarUrl = (url) => {
    if (!url) return defaultSellerAvatar;
    if (url.startsWith("data:") || url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    if (url.startsWith("/")) {
      return `${SERVER_BASE_URL}${url}`;
    }
    return `${SERVER_BASE_URL}/${url}`;
  };

  const sellerAvatarUrl = getSellerAvatarUrl(rawSellerAvatar);

  return (
    <div className="owner-product-card">
      <div className="owner-photo-box">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={title}
            className="owner-image"
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }}
          />
        ) : (
          <span>{title}</span>
        )}
        <span
          className="edit-icon-text"
          onClick={() => onEdit && onEdit(product)}
          style={{ cursor: "pointer" }}
        >
          Edit
        </span>
      </div>

      <div className="owner-card-body">
        <div className="owner-card-middle">
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
      </div>
    </div>
  );
}

export default OwnerProductCard;
