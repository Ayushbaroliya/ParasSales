import React, { useState, useEffect } from "react";
import { useCategories } from "../hooks/useCategories";

const Album = () => {
  const { data: categories, loading, error } = useCategories();
  const [activeCategory, setActiveCategory] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [hideOutOfStock, setHideOutOfStock] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("wishlist"));
    if (data) setWishlist(data);
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (item) => {
    const exists = wishlist.find((i) => i.id === item.id);
    if (exists) {
      setWishlist(wishlist.filter((i) => i.id !== item.id));
    } else {
      setWishlist([...wishlist, item]);
    }
  };

  const sendToWhatsApp = () => {
    if (wishlist.length === 0) return alert("Select items first 😄");

    const msg = wishlist
      .map((item, i) => `${i + 1}. ${item.title} - ${item.price}\n${item.image}`)
      .join("\n\n");

    const waNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "916260942161";
    window.open(
      `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`
    );
  };

  return (
    <div className="app">

      {/* 🔥 HERO */}
      <section className="hero">
        <h1>Paaras Tiles</h1>
        <p>Design your dream space</p>
      </section>

      {/* 🟡 CATEGORIES */}
      {!activeCategory && (
        <section className="categories-grid">
          {loading && <p>Loading categories...</p>}
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}
          {categories?.map((cat) => (
            <div
              key={cat.id}
              className="category-card"
              onClick={() => setActiveCategory(cat)}
            >
              <img src={cat.cover} className="category-image" />
              <h3>{cat.name}</h3>
            </div>
          ))}
        </section>
      )}

      {/* 🔵 PRODUCTS */}
      {activeCategory && (
        <>
          <button className="back-btn" onClick={() => setActiveCategory(null)}>
            ← Back
          </button>

          {/* FILTERS */}
          <div className="filters">
            <span>All</span>
            <span>Modern</span>
            <span>Marble</span>
            <span>Wood</span>
            <button
              className={`filter-btn ${hideOutOfStock ? 'active' : ''}`}
              onClick={() => setHideOutOfStock(!hideOutOfStock)}
              style={{
                padding: '8px 12px',
                backgroundColor: hideOutOfStock ? '#ff6b6b' : '#f0f0f0',
                color: hideOutOfStock ? '#fff' : '#333',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              {hideOutOfStock ? '✔ Hide Out of Stock' : 'Show All'}
            </button>
          </div>

          <section className="products-grid">
            {activeCategory.items
              .filter((item) => !hideOutOfStock || !item.isOutOfStock)
              .map((item) => {
                const added = wishlist.some((i) => i.id === item.id);

                return (
                  <div 
                    key={item.id} 
                    className="product-card"
                    style={{
                      position: 'relative',
                      backgroundColor: item.isOutOfStock ? '#f5f5f5' : 'transparent',
                    }}
                  >
                    <div style={{
                      position: 'relative',
                      overflow: 'hidden',
                    }}>
                      <img src={item.image} className="product-image" style={{
                        filter: item.isOutOfStock ? 'grayscale(100%) brightness(0.8)' : 'none',
                      }} />
                      {item.isOutOfStock && (
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundColor: 'rgba(0, 0, 0, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <div style={{
                            backgroundColor: '#ff6b6b',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                          }}>
                            OUT OF STOCK
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="product-info">
                      <h3>{item.title}</h3>
                      <p style={{
                        textDecoration: item.isOutOfStock ? 'line-through' : 'none',
                        color: item.isOutOfStock ? '#999' : '#333',
                      }}>
                        {item.price}
                      </p>

                      <button
                        className="buy-btn"
                        onClick={() => toggleWishlist(item)}
                        disabled={item.isOutOfStock}
                        style={{
                          opacity: item.isOutOfStock ? 0.6 : 1,
                          cursor: item.isOutOfStock ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {item.isOutOfStock 
                          ? 'Out of Stock' 
                          : (added ? 'Remove ❤️' : 'Add ❤️')
                        }
                      </button>
                    </div>
                  </div>
                );
              })}
          </section>
        </>
      )}

      {/* ❤️ WISHLIST FLOATING */}
      {wishlist.length > 0 && (
        <div className="wishlist-bar">
          <span>{wishlist.length} selected</span>
          <button onClick={sendToWhatsApp}>WhatsApp</button>
        </div>
      )}

      {/* 🧾 ABOUT */}
      <section className="about">
        <h2>About Us</h2>
        <p>
          We provide premium quality tiles for homes and commercial spaces.
        </p>
      </section>

      {/* 📞 CTA */}
      <section className="cta">
        <h2>Need Help?</h2>
        <button onClick={sendToWhatsApp}>Chat on WhatsApp</button>
      </section>

      {/* 🪵 FOOTER */}
      <footer className="footer">
        <p>© 2026 Paaras Tiles</p>
      </footer>
    </div>
  );
};

export default Album;