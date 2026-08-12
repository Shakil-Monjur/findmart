import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem("findmart_cart");
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error("Failed to load cart from localStorage:", err);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("findmart_cart", JSON.stringify(cartItems));
    } catch (err) {
      console.error("Failed to save cart to localStorage:", err);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    if (!product) return;
    const productId = product._id || product.id;
    if (!productId) return;

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => (item._id && item._id === productId) || (item.id && item.id === productId)
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      } else {
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    if (!productId) return;
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => (item._id ? item._id !== productId : item.id !== productId)
      )
    );
  };

  const updateQuantity = (productId, amount) => {
    if (!productId) return;
    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          const itemId = item._id || item.id;
          if (itemId === productId) {
            const newQty = item.quantity + amount;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const increaseQuantity = (productId) => {
    updateQuantity(productId, 1);
  };

  const decreaseQuantity = (productId) => {
    updateQuantity(productId, -1);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalPrice = cartItems.reduce((acc, item) => {
    const itemPrice = Number(item.price) || 0;
    return acc + itemPrice * item.quantity;
  }, 0);

  const totalUniqueItems = cartItems.length;

  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        totalPrice,
        totalUniqueItems,
        totalItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  return useContext(CartContext);
}
