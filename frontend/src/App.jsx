import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import CategoryNav from "./components/CategoryNav";
import ProtectedRoute from "./components/ProtectedRoute";

const Home = lazy(() => import("./components/Home"));
const Category = lazy(() => import("./components/Categories"));
const Product = lazy(() => import("./components/Product"));
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));

// Inner layout — uses location key to trigger CSS page-transition on route change
function Layout() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminPage && <Navbar />}
      {/* ── Global category filter — rendered OUTSIDE all page components ── */}
      {!isAdminPage && <CategoryNav />}

      {/* key forces remount + animation on every route change */}
      <main key={location.pathname} className={isAdminPage ? "" : "route-page"}>
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '50px', color: 'var(--text)' }}>Loading...</div>}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/category/:id" element={<Category />} />
            <Route path="/product/:id" element={<Product />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </Suspense>
      </main>
    </>
  );
}

import { LanguageProvider } from "./contexts/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;