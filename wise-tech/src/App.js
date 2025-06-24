/**
 * WiseTech - Platform Ulasan Gadget
 *
 * Aplikasi ini adalah platform ulasan gadget yang memungkinkan pengguna untuk menjelajahi,
 * mencari, dan memberikan ulasan tentang berbagai gadget seperti smartphone, laptop, dan tablet.
 *
 * Struktur aplikasi:
 * - Otentikasi: Login dan Register
 * - Home: Halaman utama dengan gadget unggulan dan ulasan terbaru
 * - Kategori: Smartphone, Laptop, dan Tablet
 * - Pencarian: Pencarian gadget dengan filter
 * - Profil Pengguna: Pengaturan profil dan aktivitas terkini
 * - Admin Dashboard: Panel administrasi untuk mengelola konten
 *
 * Dibuat: Juni 2025
 */

import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/auth/Login"; // Komponen Login
import Register from "./components/auth/Register"; // Komponen Register
import Header from "./components/layout/Header"; // Header dengan navigasi
import Footer from "./components/layout/Footer"; // Footer dengan tautan sosial media
import NotFound from "./components/layout/NotFound"; // Halaman 404
import Home from "./components/home/Home"; // Halaman beranda
import GadgetDetail from "./components/gadgets/GadgetDetail"; // Detail gadget dan ulasan
import AdminDashboard from "./components/admin/AdminDashboard"; // Dashboard admin
import UserProfile from "./components/user/UserProfile"; // Profil pengguna
import Smartphones from "./components/gadgets/Smartphones"; // Halaman kategori smartphone
import Laptops from "./components/gadgets/Laptops"; // Halaman kategori laptop
import Tablets from "./components/gadgets/Tablets"; // Halaman kategori tablet
import Search from "./components/gadgets/Search"; // Pencarian gadget
import BrowseReviews from "./components/reviews/BrowseReviews"; // Halaman browse semua reviews

/**
 * Komponen utama aplikasi yang menentukan routing dan struktur tampilan
 *
 * Flow aplikasi:
 * 1. Pengguna masuk melalui halaman Login atau Register
 * 2. Setelah otentikasi, pengguna diarahkan ke beranda (Home)
 * 3. Pengguna dapat:
 *    - Menjelajahi gadget berdasarkan kategori
 *    - Melihat detail gadget dan ulasan
 *    - Mencari gadget dengan filter
 *    - Mengelola profil pengguna mereka
 * 4. Admin dapat mengakses dashboard admin untuk mengelola konten
 *
 * @returns {JSX.Element} Aplikasi WiseTech dengan routing
 */
function App() {
  /**
   * Fungsi untuk memeriksa status otentikasi pengguna
   * Catatan untuk tim backend:
   * - Saat ini selalu mengembalikan true untuk pengembangan
   * - Implementasi sebenarnya harus memeriksa token JWT atau sesi
   *
   * @returns {boolean} Status otentikasi pengguna
   */
  const isAuthenticated = () => {
    // Memeriksa apakah pengguna sudah login dari localStorage
    return localStorage.getItem("isAuthenticated") === "true";
  };

  /**
   * Fungsi untuk memeriksa apakah pengguna adalah admin
   *
   * @returns {boolean} Status admin pengguna
   */
  const isAdmin = () => {
    const userInfo = localStorage.getItem("userInfo");
    console.log(
      "🔍 App.js isAdmin check - userInfo from localStorage:",
      userInfo
    );

    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        console.log("🔍 App.js isAdmin check - parsed user:", user);
        console.log("🔍 App.js isAdmin check - user.is_admin:", user.is_admin);
        console.log(
          "🔍 App.js isAdmin check - typeof user.is_admin:",
          typeof user.is_admin
        );
        return user.is_admin === true;
      } catch (error) {
        console.error("Error parsing user info:", error);
        return false;
      }
    }
    console.log("🔍 App.js isAdmin check - no userInfo found");
    return false;
  };

  /**
   * Komponen untuk melindungi rute yang memerlukan otentikasi
   * Mengarahkan pengguna ke halaman login jika belum terautentikasi
   *
   * @param {Object} props - Properties komponen
   * @param {React.ReactNode} props.children - Child components
   * @returns {JSX.Element} Children component atau redirect ke login
   */
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  /**
   * Komponen untuk melindungi rute khusus pengguna biasa
   * Mengarahkan admin ke dashboard admin dan non-authenticated ke login
   *
   * @param {Object} props - Properties komponen
   * @param {React.ReactNode} props.children - Child components
   * @returns {JSX.Element} Children component atau redirect
   */
  const UserOnlyRoute = ({ children }) => {
    const isAuth = isAuthenticated();
    const isAdminUser = isAdmin();

    console.log("🔍 UserOnlyRoute check - isAuthenticated():", isAuth);
    console.log("🔍 UserOnlyRoute check - isAdmin():", isAdminUser);

    if (!isAuth) {
      console.log(
        "❌ UserOnlyRoute - User not authenticated, redirecting to login"
      );
      return <Navigate to="/login" replace />;
    }
    if (isAdminUser) {
      console.log(
        "❌ UserOnlyRoute - Admin user trying to access user page, redirecting to admin dashboard"
      );
      return <Navigate to="/admin" replace />;
    }

    console.log("✅ UserOnlyRoute - User access granted");
    return children;
  };

  /**
   * Komponen untuk melindungi rute admin
   * Mengarahkan pengguna ke halaman login jika belum terautentikasi
   * atau ke home jika bukan admin
   *
   * @param {Object} props - Properties komponen
   * @param {React.ReactNode} props.children - Child components
   * @returns {JSX.Element} Children component atau redirect
   */
  const AdminRoute = ({ children }) => {
    const isAuth = isAuthenticated();
    const isAdminUser = isAdmin();

    console.log("🔍 AdminRoute check - isAuthenticated():", isAuth);
    console.log("🔍 AdminRoute check - isAdmin():", isAdminUser);
    console.log(
      "🔍 AdminRoute check - localStorage userInfo:",
      localStorage.getItem("userInfo")
    );
    console.log(
      "🔍 AdminRoute check - localStorage user_is_admin:",
      localStorage.getItem("user_is_admin")
    );

    if (!isAuth) {
      console.log(
        "❌ AdminRoute - User not authenticated, redirecting to login"
      );
      return <Navigate to="/login" replace />;
    }
    if (!isAdminUser) {
      console.log("❌ AdminRoute - User not admin, redirecting to home");
      return <Navigate to="/" replace />;
    }

    console.log("✅ AdminRoute - Admin access granted");
    return children;
  };

  /**
   * Komponen untuk melindungi rute autentikasi (login/register)
   * Mengarahkan pengguna yang sudah login ke halaman yang sesuai dengan role mereka
   *
   * @param {Object} props - Properties komponen
   * @param {React.ReactNode} props.children - Child components
   * @returns {JSX.Element} Children component atau redirect
   */
  const AuthRoute = ({ children }) => {
    const isAuth = isAuthenticated();
    const isAdminUser = isAdmin();

    console.log("🔍 AuthRoute check - isAuthenticated():", isAuth);
    console.log("🔍 AuthRoute check - isAdmin():", isAdminUser);

    if (isAuth) {
      if (isAdminUser) {
        console.log(
          "❌ AuthRoute - Admin already authenticated, redirecting to admin dashboard"
        );
        return <Navigate to="/admin" replace />;
      } else {
        console.log(
          "❌ AuthRoute - User already authenticated, redirecting to home"
        );
        return <Navigate to="/" replace />;
      }
    }

    console.log("✅ AuthRoute - User not authenticated, showing auth page");
    return children;
  };

  return (
    <Router>
      <div className="App flex flex-col min-h-screen">
        <Routes>
          {/* 
            Rute Autentikasi - tanpa header/footer
            Rute-rute ini mengarahkan pengguna yang sudah login ke halaman yang sesuai
            Tim backend: Implementasikan API untuk otentikasi pada endpoint-endpoint ini 
          */}
          <Route
            path="/login"
            element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            }
          />
          <Route
            path="/register"
            element={
              <AuthRoute>
                <Register />
              </AuthRoute>
            }
          />

          {/* 
            Rute Terproteksi - dengan header/footer
            Semua rute di bawah memerlukan otentikasi pengguna
            Tim backend: Validasi token JWT/session pada setiap request API
          */}
          {/* Halaman Beranda dengan gadget unggulan dan ulasan terbaru */}
          <Route
            path="/"
            element={
              <UserOnlyRoute>
                <>
                  <Header />
                  <main className="flex-grow">
                    <Home />
                  </main>
                  <Footer />
                </>
              </UserOnlyRoute>
            }
          />

          {/* 
            Halaman Detail Gadget dengan spesifikasi dan ulasan
            :id adalah parameter dinamis untuk ID gadget
            Tim backend: Implementasikan endpoint GET /api/gadgets/:id
          */}
          <Route
            path="/gadget/:id"
            element={
              <UserOnlyRoute>
                <>
                  <Header />
                  <main className="flex-grow">
                    <GadgetDetail />
                  </main>
                  <Footer />
                </>
              </UserOnlyRoute>
            }
          />

          {/* 
            Halaman Profil Pengguna untuk melihat dan mengedit informasi pengguna
            Tim backend: Implementasikan endpoint GET & PUT /api/users/profile 
          */}
          <Route
            path="/profile"
            element={
              <UserOnlyRoute>
                <>
                  <Header />
                  <main className="flex-grow">
                    <UserProfile />
                  </main>
                  <Footer />
                </>
              </UserOnlyRoute>
            }
          />

          {/* 
            Halaman Kategori Smartphone - menampilkan daftar smartphone dengan filter
            Tim backend: Implementasikan endpoint GET /api/gadgets?category=smartphone
            dengan dukungan untuk parameter filter: brand, priceRange, sortBy
          */}
          <Route
            path="/smartphones"
            element={
              <UserOnlyRoute>
                <>
                  <Header />
                  <main className="flex-grow">
                    <Smartphones />
                  </main>
                  <Footer />
                </>
              </UserOnlyRoute>
            }
          />

          {/* 
            Halaman Kategori Laptop - menampilkan daftar laptop dengan filter
            Tim backend: Implementasikan endpoint GET /api/gadgets?category=laptop
            dengan dukungan untuk parameter filter: brand, processor, priceRange, sortBy
          */}
          <Route
            path="/laptops"
            element={
              <UserOnlyRoute>
                <>
                  <Header />
                  <main className="flex-grow">
                    <Laptops />
                  </main>
                  <Footer />
                </>
              </UserOnlyRoute>
            }
          />

          {/* 
            Halaman Kategori Tablet - menampilkan daftar tablet dengan filter
            Tim backend: Implementasikan endpoint GET /api/gadgets?category=tablet
            dengan dukungan untuk parameter filter: brand, screenSize, priceRange, sortBy
          */}
          <Route
            path="/tablets"
            element={
              <UserOnlyRoute>
                <>
                  <Header />
                  <main className="flex-grow">
                    <Tablets />
                  </main>
                  <Footer />
                </>
              </UserOnlyRoute>
            }
          />

          {/* 
            Halaman Pencarian - untuk mencari gadget di semua kategori
            Tim backend: Implementasikan endpoint GET /api/search?q=[query]&category=[category]
            dengan dukungan untuk filter dan pencarian full-text
          */}
          <Route
            path="/search"
            element={
              <UserOnlyRoute>
                <>
                  <Header />
                  <main className="flex-grow">
                    <Search />
                  </main>
                  <Footer />
                </>
              </UserOnlyRoute>
            }
          />

          {/* 
            Halaman Browse Reviews - untuk menjelajahi semua review user
            Tim backend: Implementasikan endpoint GET /api/reviews dengan filter dan pagination
          */}
          <Route
            path="/browse-reviews"
            element={
              <UserOnlyRoute>
                <>
                  <Header />
                  <main className="flex-grow">
                    <BrowseReviews />
                  </main>
                  <Footer />
                </>
              </UserOnlyRoute>
            }
          />

          {/* 
            Dashboard Admin - untuk pengelolaan platform
            Tim backend: Implementasikan endpoint admin yang diproteksi
            dan periksa peran pengguna (admin = true) untuk akses
          */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* 
            Halaman 404 - untuk rute yang tidak ditemukan
            Tim backend: Tidak diperlukan endpoint khusus
          */}
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <>
                  <Header />
                  <main className="flex-grow">
                    <NotFound />
                  </main>
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
