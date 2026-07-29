import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const checkAuth = () => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      } else if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const login = (userData, token) => {
    if (token) {
      localStorage.setItem("token", token);
    }
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    }
    setUser(userData);
    window.dispatchEvent(new Event("storage"));
  };

  const updateUser = (updatedFields) => {
    setUser((prevUser) => {
      const newUser = { ...(prevUser || {}), ...updatedFields };
      try {
        localStorage.setItem("user", JSON.stringify(newUser));
      } catch (err) {
        console.error("Error saving user to localStorage:", err);
      }
      window.dispatchEvent(new Event("storage"));
      return newUser;
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("storage"));
  };

  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(user && (token || user._id || user.id || user.email));

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        login,
        updateUser,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
