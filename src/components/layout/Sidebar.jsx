import {
  FaHome,
  FaMapMarkerAlt,
  FaShoppingCart,
  FaHeart,
  FaClipboardList,
  FaCog,
  FaUser,
  FaStore,
} from "react-icons/fa";

import "./../../styles/sidebar.css";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">

      <ul className="sidebar-menu">

        <li>
          <NavLink to="/" end>
            <FaHome />
            <span>Home</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/location">
            <FaMapMarkerAlt />
            <span>Location</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/cart">
            <FaShoppingCart />
            <span>Cart</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/orders">
            <FaClipboardList />
            <span>Orders</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/saved">
            <FaHeart />
            <span>Saved</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/settings">
            <FaCog />
            <span>Settings</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/profile">
            <FaUser />
            <span>Profile</span>
          </NavLink>
        </li>

      </ul>

      <div className="sidebar-footer">
        <NavLink to="/shop-owner" className="sidebar-menu-item">
          <FaStore />
          <span>Shop Owner</span>
        </NavLink>
      </div>

    </aside>
  );
}

export default Sidebar;