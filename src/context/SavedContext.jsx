import { createContext, useContext, useState, useEffect } from "react";

const SavedContext = createContext();

export function SavedProvider({ children }) {
  const [savedProducts, setSavedProducts] = useState(() => {
    try {
      const stored = localStorage.getItem("saved_products");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("saved_products", JSON.stringify(savedProducts));
    } catch (err) {
      console.error("Failed to save to localStorage:", err);
    }
  }, [savedProducts]);

  const isSaved = (productId) => {
    if (!productId) return false;
    return savedProducts.some(
      (p) => (p._id && p._id === productId) || (p.id && p.id === productId)
    );
  };

  const toggleSave = (product) => {
    if (!product) return;
    const productId = product._id || product.id;
    if (!productId) return;

    setSavedProducts((prev) => {
      const exists = prev.some(
        (p) => (p._id && p._id === productId) || (p.id && p.id === productId)
      );
      if (exists) {
        return prev.filter(
          (p) => (p._id ? p._id !== productId : p.id !== productId)
        );
      } else {
        return [...prev, product];
      }
    });
  };

  return (
    <SavedContext.Provider value={{ savedProducts, isSaved, toggleSave }}>
      {children}
    </SavedContext.Provider>
  );
}

export function useSavedContext() {
  return useContext(SavedContext);
}
