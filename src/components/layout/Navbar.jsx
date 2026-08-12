

import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useAuthContext } from "../../context/AuthContext";
import { useCartContext } from "../../context/CartContext";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn, logout } = useAuthContext();
  const { totalUniqueItems } = useCartContext();

  const isShopOwner =
    user?.role === "Shop Owner" ||
    location.pathname.startsWith("/shop-owner") ||
    location.pathname.startsWith("/shop-dashboard");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const displayName = user?.fullName || user?.username || user?.name || "User";
  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  const rawAvatar = user?.profilePicture || user?.profilePic || user?.avatar;

  const getAvatarUrl = (url) => {
    if (!url) return defaultAvatar;
    if (url.startsWith("data:") || url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    if (url.startsWith("/")) {
      return `https://findmart.onrender.com${url}`;
    }
    return `https://findmart.onrender.com/${url}`;
  };

  const avatarUrl = getAvatarUrl(rawAvatar);

  return (
    <header className="navbar-header">
      <nav className="navbar">
        <div className="logo-container">
          <Link to="/" className="logo">
            <h2>fm</h2>
          </Link>
          {isShopOwner && <span className="shop-owner-title">Shop Owner</span>}
        </div>

        <div className="nav-right" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {!isShopOwner && (
            <Link
              to="/cart"
              className="navbar-cart-link"
              title="Shopping Cart"
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#374151",
                fontSize: "20px",
                textDecoration: "none",
                padding: "6px",
                borderRadius: "50%",
              }}
            >
              <FaShoppingCart />
              {totalUniqueItems > 0 && (
                <span
                  className="navbar-cart-badge"
                  style={{
                    position: "absolute",
                    top: "-4px",
                    right: "-6px",
                    background: "#2563eb",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: "700",
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 4px rgba(37, 99, 235, 0.3)",
                  }}
                >
                  {totalUniqueItems}
                </span>
              )}
            </Link>
          )}

          {isLoggedIn && user ? (
            <div className="user-profile-section" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <img
                src={avatarUrl}
                alt={displayName}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginRight: "2px",
                  border: "2px solid #e2e8f0",
                }}
              />
              <span className="user-greeting">Hello, {displayName}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/signup" className="signup-btn">
                Sign Up
              </Link>
              <Link to="/login" className="login-btn">
                Log In
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
