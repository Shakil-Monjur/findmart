import { Outlet, NavLink } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

import "../styles/layout.css";

import { useCartContext } from "../context/CartContext";

function CustomerLayout() {
  const { totalUniqueItems } = useCartContext();

  return (
    <div className="customer-layout">

      <Navbar />

      <div className="layout-container">

        <Sidebar />

        <main className="content">
          {/* Global Top Navigation Tabs */}
          <div className="main-tabs">
            <NavLink to="/" end className={({ isActive }) => (isActive ? "tab-item active" : "tab-item")}>
              Home
            </NavLink>
            <NavLink to="/cart" className={({ isActive }) => (isActive ? "tab-item active" : "tab-item")}>
              Cart {totalUniqueItems > 0 ? `(${totalUniqueItems})` : ""}
            </NavLink>
            <NavLink to="/saved" className={({ isActive }) => (isActive ? "tab-item active" : "tab-item")}>
              Saved
            </NavLink>
            <NavLink to="/orders" className={({ isActive }) => (isActive ? "tab-item active" : "tab-item")}>
              Order
            </NavLink>
          </div>

          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default CustomerLayout;