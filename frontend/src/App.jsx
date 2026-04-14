import React, { Suspense, lazy, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import CategoryNav from "./components/CategoryNav";
import ProtectedRoute from "./components/ProtectedRoute";
import Preloader from "./components/Preloader";
import WishlistFAB from "./components/WishlistFAB";

const Home          = lazy(() => import("./components/Home"));
const Category      = lazy(() => import("./components/Categories"));
const Product       = lazy(() => import("./components/Product"));
const AboutPage     = lazy(() => import("./components/About"));
const AdminLogin    = lazy(() => import("./pages/admin/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));

// A lightweight shimmer skeleton shown while lazy chunks load (not the full preloader)
const PageShimmer = () => (
  <div style={{ padding: "40px 28px" }}>
    <div className="shimmer-block" style={{ height: 260, borderRadius: 16, marginBottom: 24 }} />
    <div className="shimmer-block" style={{ height: 20, width: "60%", borderRadius: 8, marginBottom: 12 }} />
    <div className="shimmer-block" style={{ height: 14, width: "90%", borderRadius: 8, marginBottom: 8 }} />
    <div className="shimmer-block" style={{ height: 14, width: "75%", borderRadius: 8 }} />
  </div>
);

// Inner layout — uses location key to trigger CSS page-transition on route change
function Layout() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  const [initialLoad, setInitialLoad] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Give fonts & first paint a moment, then fade out preloader
    const fadeTimer = setTimeout(() => setFadeOut(true), 400);
    const hideTimer = setTimeout(() => setInitialLoad(false), 800);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (initialLoad)
    return <Preloader fadeOut={fadeOut} />;

  return (
    <>
      {!isAdminPage && <Navbar />}
      {!isAdminPage && <CategoryNav />}

      <main key={location.pathname} className={isAdminPage ? "" : "route-page"}>
        <Suspense fallback={<PageShimmer />}>
          <Routes location={location}>
            <Route path="/"             element={<Home />} />
            <Route path="/category/:id" element={<Category />} />
            <Route path="/product/:id"  element={<Product />} />
            <Route path="/about"        element={<AboutPage />} />

            {/* Admin Routes */}
            <Route path="/admin/login"  element={<AdminLogin />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/admin"      element={<AdminDashboard />} />
            </Route>
          </Routes>
        </Suspense>
      </main>

      {/* Global Wishlist FAB — fixed on screen, all pages */}
      {!isAdminPage && <WishlistFAB />}
    </>
  );
}

import { LanguageProvider } from "./contexts/LanguageContext";
import { WishlistProvider } from "./contexts/WishlistContext";

function App() {
  return (
    <WishlistProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </LanguageProvider>
    </WishlistProvider>
  );
}

export default App;