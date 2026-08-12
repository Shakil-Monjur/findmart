import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LocationProvider } from "./context/LocationContext";
import { SavedProvider } from "./context/SavedContext";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// Layouts
import CustomerLayout from "./layouts/CustomerLayout";
import ShopOwnerLayout from "./layouts/ShopOwnerLayout";

// Customer Pages
import Home from "./pages/customer/Home";
import Location from "./pages/customer/Location";
import Cart from "./pages/customer/Cart";
import Checkout from "./pages/customer/Checkout";
import Saved from "./pages/customer/Saved";
import Orders from "./pages/customer/Orders";
import OrderHistory from "./pages/customer/OrderHistory";
import ProductDetails from "./pages/customer/ProductDetails";
import Profile from "./pages/customer/Profile";
import Settings from "./pages/customer/Settings";
import Login from "./pages/customer/Login";
import Signup from "./pages/customer/Signup";

import ProtectedRoute from "./components/ProtectedRoute";

import LocationSetup from "./pages/shopOwner/LocationSetup";

// Shop Owner Pages
import Dashboard from "./pages/shopOwner/Dashboard";
import Products from "./pages/shopOwner/Products";
import AddProduct from "./pages/shopOwner/AddProduct";
import EditProduct from "./pages/shopOwner/EditProduct";
import OrdersOwner from "./pages/shopOwner/Orders";
import Sales from "./pages/shopOwner/Sales";
import ProfileOwner from "./pages/shopOwner/Profile";
import SettingsOwner from "./pages/shopOwner/Settings";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LocationProvider>
          <SavedProvider>
            <CartProvider>
              <Routes>
                {/* Customer Routes */}
                <Route path="/" element={<CustomerLayout />}>
                  <Route index element={<Home />} />
                  <Route path="location" element={<Location />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="saved" element={<Saved />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="order-history" element={<OrderHistory />} />
                  <Route path="product/:id" element={<ProductDetails />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="login" element={<Login />} />
                  <Route path="signup" element={<Signup />} />
                </Route>

                {/* Shop Dashboard Route */}
                <Route
                  path="/shop-dashboard"
                  element={
                    <ProtectedRoute>
                      <ShopOwnerLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                </Route>

                {/* Shop Owner Routes */}
                <Route
                  path="/shop-owner"
                  element={
                    <ProtectedRoute>
                      <ShopOwnerLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="location" element={<LocationSetup />} />
                  <Route path="products" element={<Products />} />
                  <Route path="add-product" element={<AddProduct />} />
                  <Route path="edit-product" element={<EditProduct />} />
                  <Route path="orders" element={<OrdersOwner />} />
                  <Route path="sales" element={<Sales />} />
                  <Route path="profile" element={<ProfileOwner />} />
                  <Route path="settings" element={<SettingsOwner />} />
                </Route>
              </Routes>
            </CartProvider>
          </SavedProvider>
        </LocationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;