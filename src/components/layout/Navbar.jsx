

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn, logout } = useAuthContext();

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
      return `http://localhost:5000${url}`;
    }
    return `http://localhost:5000/${url}`;
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

        <div className="nav-right">
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
