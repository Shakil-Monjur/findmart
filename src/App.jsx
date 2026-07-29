import { RouterProvider } from "react-router-dom";
import router from "./router/AppRouter";
import { LocationProvider } from "./context/LocationContext";
import { SavedProvider } from "./context/SavedContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <SavedProvider>
          <RouterProvider router={router} />
        </SavedProvider>
      </LocationProvider>
    </AuthProvider>
  );
}

export default App;