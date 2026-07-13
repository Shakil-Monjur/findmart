import { Outlet } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

import "../styles/layout.css";

function CustomerLayout() {
  return (
    <div className="customer-layout">

      <Navbar />

      <div className="layout-container">

        <Sidebar />

        <main className="content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default CustomerLayout;