import { RouterProvider } from "react-router-dom";
import router from "./router/AppRouter";
import { LocationProvider } from "./context/LocationContext";
import { SavedProvider } from "./context/SavedContext";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <SavedProvider>
          <CartProvider>
            <RouterProvider router={router} />
          </CartProvider>
        </SavedProvider>
      </LocationProvider>
    </AuthProvider>
  );
}

export default App;