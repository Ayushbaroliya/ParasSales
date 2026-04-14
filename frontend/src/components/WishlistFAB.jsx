import React, { useState, useEffect, useRef } from "react";
import { FaHeart, FaTimes, FaWhatsapp, FaTrash, FaShoppingCart } from "react-icons/fa";
import { useWishlist } from "../contexts/WishlistContext";
import { useLanguage } from "../contexts/LanguageContext";

const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "916260942161";

/* ── Helper: send enquiry to WhatsApp ── */
function buildWhatsAppUrl(wishlist) {
  const msg = wishlist
    .map((item, idx) => `${idx + 1}. ${item.title} — ${item.price}\n   Image: ${item.image}`)
    .join("\n\n");
  const text = encodeURIComponent(`Hi! I'd like to enquire about:\n\n${msg}`);
  return `https://wa.me/${WA_NUMBER}?text=${text}`;
}

/* ── Wishlist Item Card inside drawer ── */
function WishlistItem({ item, lang }) {
  const { removeFromWishlist } = useWishlist();

  const waUrl = encodeURIComponent(
    `Hi! I'm interested in: ${item.title} (${item.price}).\nImage: ${item.image}`
  );

  return (
    <div className="wl-drawer-item">
      <div className="wl-drawer-img-wrap">
        <img src={item.image} alt={item.title} loading="lazy" />
      </div>
      <div className="wl-drawer-info">
        <p className="wl-drawer-name">{item.title}</p>
        <p className="wl-drawer-price">{item.price}</p>
        <div className="wl-drawer-actions">
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${waUrl}`}
            target="_blank"
            rel="noreferrer"
            className="wl-enquire-btn"
            title={lang === "en" ? "Enquire on WhatsApp" : "व्हाट्सएप पर पूछताछ"}
          >
            <FaWhatsapp size={13} />
            {lang === "en" ? "Enquire" : "पूछताछ"}
          </a>
          <button
            className="wl-remove-btn"
            onClick={() => removeFromWishlist(item.id)}
            title={lang === "en" ? "Remove" : "हटाएं"}
          >
            <FaTrash size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main FAB + Drawer ── */
export default function WishlistFAB() {
  const { wishlist, clearWishlist } = useWishlist();
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [bounce, setBounce] = useState(false);
  const prevCount = useRef(wishlist.length);

  // Badge bounce animation when count increases
  useEffect(() => {
    if (wishlist.length > prevCount.current) {
      setBounce(true);
      const t = setTimeout(() => setBounce(false), 600);
      return () => clearTimeout(t);
    }
    prevCount.current = wishlist.length;
  }, [wishlist.length]);

  // Close drawer on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Prevent body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (wishlist.length === 0 && !open) return null;

  const sendAll = () => {
    if (!wishlist.length) return;
    window.open(buildWhatsAppUrl(wishlist), "_blank");
    setOpen(false);
  };

  return (
    <>
      {/* ── Backdrop ── */}
      {open && (
        <div
          className="wl-backdrop"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Slide-in Drawer ── */}
      <aside className={`wl-drawer ${open ? "wl-drawer--open" : ""}`} role="dialog" aria-label="Wishlist">
        {/* Header */}
        <div className="wl-drawer-header">
          <div className="wl-drawer-title">
            <FaHeart size={15} style={{ color: "var(--red)" }} />
            <span>{language === "en" ? "My Wishlist" : "मेरी पसंदीदा"}</span>
            <span className="wl-drawer-count">{wishlist.length}</span>
          </div>
          <div className="wl-drawer-header-actions">
            {wishlist.length > 0 && (
              <button className="wl-clear-btn" onClick={clearWishlist} title="Clear all">
                {language === "en" ? "Clear all" : "सभी हटाएं"}
              </button>
            )}
            <button className="wl-close-btn" onClick={() => setOpen(false)} aria-label="Close">
              <FaTimes size={16} />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="wl-drawer-body">
          {wishlist.length === 0 ? (
            <div className="wl-empty">
              <div className="wl-empty-icon">🤍</div>
              <p>{language === "en" ? "Your wishlist is empty" : "पसंदीदा खाली है"}</p>
              <span>{language === "en" ? "Add items from any product page" : "किसी भी उत्पाद से जोड़ें"}</span>
            </div>
          ) : (
            <div className="wl-items-list">
              {wishlist.map((item) => (
                <WishlistItem key={item.id} item={item} lang={language} />
              ))}
            </div>
          )}
        </div>

        {/* Footer CTA */}
        {wishlist.length > 0 && (
          <div className="wl-drawer-footer">
            <p className="wl-footer-summary">
              {wishlist.length} {language === "en" ? "item(s) selected" : "आइटम चुने गए"}
            </p>
            <button className="wl-send-all-btn" onClick={sendAll}>
              <FaWhatsapp size={18} />
              {language === "en" ? "Send All Enquiries on WhatsApp" : "सभी पूछताछ भेजें"}
            </button>
          </div>
        )}
      </aside>

      {/* ── Floating Action Button ── */}
      <button
        id="wishlist-fab"
        className={`wl-fab ${bounce ? "wl-fab--bounce" : ""} ${open ? "wl-fab--active" : ""}`}
        onClick={() => setOpen((p) => !p)}
        aria-label={language === "en" ? "View Wishlist" : "पसंदीदा देखें"}
        title={language === "en" ? "Wishlist" : "पसंदीदा"}
      >
        <FaShoppingCart size={24} />
        {wishlist.length > 0 && (
          <span className={`wl-fab-badge ${bounce ? "wl-fab-badge--pop" : ""}`}>
            {wishlist.length > 99 ? "99+" : wishlist.length}
          </span>
        )}
        <span className="wl-fab-ripple" />
      </button>
    </>
  );
}
