import {
  FaHome,
  FaMapMarkerAlt,
  FaShoppingCart,
  FaHeart,
  FaClipboardList,
  FaCog,
  FaUser,
  FaBox,
  FaChartLine,
  FaPlusCircle,
} from "react-icons/fa";

import "./../../styles/sidebar.css";
import { NavLink, useLocation } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

function Sidebar({ role }) {
  const location = useLocation();
  const { user, isLoggedIn } = useAuthContext();

  const isShopOwner =
    role === "owner" ||
    user?.role === "Shop Owner" ||
    location.pathname.startsWith("/shop-owner") ||
    location.pathname.startsWith("/shop-dashboard");

  const customerLinks = [
    { to: "/", label: "Home", icon: <FaHome />, end: true },
    { to: "/location", label: "Location", icon: <FaMapMarkerAlt /> },
    { to: "/cart", label: "Cart", icon: <FaShoppingCart /> },
    { to: "/orders", label: "Order", icon: <FaClipboardList /> },
    { to: "/saved", label: "Saved", icon: <FaHeart /> },
    { to: "/settings", label: "Setting", icon: <FaCog /> },
  ];

  const ownerLinks = [
    { to: "/shop-dashboard", label: "Dashboard", icon: <FaChartLine />, end: true },
    { to: "/shop-owner", label: "My Products", icon: <FaBox />, end: true },
    { to: "/shop-owner/add-product", label: "Add Product", icon: <FaPlusCircle /> },
    { to: "/shop-owner/location", label: "Location", icon: <FaMapMarkerAlt /> },
    { to: "/shop-owner/sales", label: "Sells", icon: <FaChartLine /> },
    { to: "/shop-owner/orders", label: "Order", icon: <FaClipboardList /> },
    { to: "/shop-owner/settings", label: "Setting", icon: <FaCog /> },
  ];

  const mainNavItems = isShopOwner ? ownerLinks : customerLinks;
  const profileLink = isShopOwner ? "/shop-owner/profile" : "/profile";

  const restrictedItems = ["Cart", "Order", "Saved", "Setting", "Profile"];

  const handleNavClick = (e, label) => {
    if (!isLoggedIn && restrictedItems.includes(label)) {
      e.preventDefault();
      alert("Please login or sign up first to access this feature.");
    }
  };

  const getLinkStyle = (label) => {
    if (!isLoggedIn && restrictedItems.includes(label)) {
      return { color: "#a0aec0" };
    }
    return undefined;
  };

  const getIconStyle = (label) => {
    if (!isLoggedIn && restrictedItems.includes(label)) {
      return { background: "#a0aec0" };
    }
    return undefined;
  };

  return (
    <aside className="sidebar">
      {/* Search Input at top */}
      <div className="sidebar-search">
        <input
          type="text"
          placeholder="Search Your Mart"
          className="sidebar-search-input"
        />
      </div>

      <ul className="sidebar-menu">
        {mainNavItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.end}
              onClick={(e) => handleNavClick(e, item.label)}
              style={getLinkStyle(item.label)}
            >
              <span className="icon-box" style={getIconStyle(item.label)}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}

        <li className="sidebar-gap">
          <NavLink
            to={profileLink}
            onClick={(e) => handleNavClick(e, "Profile")}
            style={getLinkStyle("Profile")}
          >
            <span className="icon-box" style={getIconStyle("Profile")}>
              <FaUser />
            </span>
            <span>Profile</span>
          </NavLink>
        </li>
      </ul>

      <div className="sidebar-footer">
        <NavLink to="/shop-owner" className="shop-owner-btn">
          Shop Owner
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;
