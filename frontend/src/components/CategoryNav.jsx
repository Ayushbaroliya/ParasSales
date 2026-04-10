import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useCategories } from "../hooks/useCategories";

/**
 * Global Category Navigation bar.
 * Rendered from App.jsx so it lives OUTSIDE any page component.
 * Only shows when the user is on a /category/* or /product/* route.
 */
const CategoryNav = () => {
  const location = useLocation();
  const { data: categories, loading } = useCategories();

  // Only show on category / product pages
  const showNav =
    location.pathname.startsWith("/category") ||
    location.pathname.startsWith("/product");

  if (!showNav || loading || !categories) return null;

  return (
    <nav className="category-nav" aria-label="Category filter">
      <div className="category-nav-inner">
        {categories.map((cat) => (
          <NavLink
            key={cat.id}
            to={`/category/${cat.id}`}
            className={({ isActive }) =>
              `category-nav-pill${isActive ? " active" : ""}`
            }
          >
            <span className="cat-nav-icon">{cat.icon}</span>
            <span className="cat-nav-name">{cat.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default CategoryNav;
