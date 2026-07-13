import { createBrowserRouter } from "react-router-dom";

// Layouts
import CustomerLayout from "../layouts/CustomerLayout";
import ShopOwnerLayout from "../layouts/ShopOwnerLayout";

// Customer Pages
import Home from "../pages/customer/Home";
import Location from "../pages/customer/Location";
import Cart from "../pages/customer/Cart";
import Saved from "../pages/customer/Saved";
import Orders from "../pages/customer/Orders";
import ProductDetails from "../pages/customer/ProductDetails";
import Profile from "../pages/customer/Profile";
import Settings from "../pages/customer/Settings";
import Login from "../pages/customer/Login";
import Signup from "../pages/customer/Signup";

// Shop Owner Pages
import Dashboard from "../pages/shopOwner/Dashboard";
import Products from "../pages/shopOwner/Products";
import AddProduct from "../pages/shopOwner/AddProduct";
import EditProduct from "../pages/shopOwner/EditProduct";
import OrdersOwner from "../pages/shopOwner/Orders";
import Sales from "../pages/shopOwner/Sales";
import ProfileOwner from "../pages/shopOwner/Profile";
import SettingsOwner from "../pages/shopOwner/Settings";

const router = createBrowserRouter([
  // ==========================
  // Customer Routes
  // ==========================
  {
    path: "/",
    element: <CustomerLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "location",
        element: <Location />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "saved",
        element: <Saved />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "product/:id",
        element: <ProductDetails />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
    ],
  },

  // ==========================
  // Shop Owner Routes
  // ==========================
  {
    path: "/shop-owner",
    element: <ShopOwnerLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "add-product",
        element: <AddProduct />,
      },
      {
        path: "edit-product",
        element: <EditProduct />,
      },
      {
        path: "orders",
        element: <OrdersOwner />,
      },
      {
        path: "sales",
        element: <Sales />,
      },
      {
        path: "profile",
        element: <ProfileOwner />,
      },
      {
        path: "settings",
        element: <SettingsOwner />,
      },
    ],
  },
]);

export default router;