import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem("wishlist")) || []; }
    catch { return []; }
  });

  // Persist to localStorage whenever wishlist changes
  useEffect(() => {
    try { localStorage.setItem("wishlist", JSON.stringify(wishlist)); }
    catch {}
  }, [wishlist]);

  const toggleWishlist = useCallback((item) => {
    setWishlist((prev) =>
      prev.find((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, item]
    );
  }, []);

  const removeFromWishlist = useCallback((id) => {
    setWishlist((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearWishlist = useCallback(() => setWishlist([]), []);

  const isWishlisted = useCallback(
    (id) => wishlist.some((i) => i.id === id),
    [wishlist]
  );

  return (
    <WishlistContext.Provider
      value={{ wishlist, toggleWishlist, removeFromWishlist, clearWishlist, isWishlisted }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
