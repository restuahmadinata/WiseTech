import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authUtils, userAPI } from "../../utils/api";

/**
 * Komponen Header - Navigasi utama aplikasi
 *
 * Fitur utama:
 * - Navigasi ke halaman utama dan kategori (Smartphones, Laptops, Tablets) - khusus user biasa
 * - Navigasi admin dashboard - khusus admin
 * - Menu profil pengguna (dropdown) untuk desktop
 * - Menu hamburger untuk tampilan mobile
 * - Pencarian gadget (desktop dan mobile) dengan navigasi ke halaman hasil pencarian - khusus user biasa
 *
 * Komponen ini mengelola:
 * - Status menu mobile (buka/tutup)
 * - Status dropdown profil (buka/tutup)
 * - Pencarian gadget dengan navigasi ke halaman Search dengan query parameter
 * - Role-based navigation (admin vs user biasa)
 *
 * Integrasi API:
 * - Tidak memerlukan API langsung karena pencarian diteruskan ke halaman Search
 * - Logout: Menghapus token autentikasi dari localStorage
 */
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();
  const profileMenuRef = useRef(null);

  // Helper function to check if user is admin
  const isAdmin = () => {
    const userInfo = authUtils.getUserInfo();
    if (userInfo) {
      try {
        return userInfo.is_admin === true;
      } catch (error) {
        console.error("Error checking admin status:", error);
        return false;
      }
    }
    return false;
  };

  // Helper function to get full profile photo URL
  const getProfilePhotoUrl = (photoPath) => {
    if (!photoPath) return null;
    if (photoPath.startsWith("http")) return photoPath; // Already full URL
    return `http://localhost:8000${photoPath}`; // Add API base URL
  };

  // Load user profile when component mounts
  useEffect(() => {
    const loadUserProfile = async () => {
      if (authUtils.getAccessToken()) {
        try {
          const profile = await userAPI.getProfile();
          setUserProfile(profile);
        } catch (error) {
          console.error("Error loading user profile in header:", error);
          // Fallback to stored user info
          const userInfo = authUtils.getUserInfo();
          if (userInfo) {
            setUserProfile({
              full_name: userInfo.name,
              email: userInfo.email,
              profile_photo: null,
            });
          }
        }
      }
    };

    loadUserProfile();

    // Listen for profile updates
    const handleProfileUpdate = (event) => {
      console.log("📳 Header received profile update:", event.detail);
      setUserProfile((prev) => ({
        ...prev,
        ...event.detail,
      }));
      console.log("🔄 Header profile updated");
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = () => {
    const userInfo = authUtils.getUserInfo();
    // Check if user is admin - show confirmation for admin users
    if (userInfo?.is_admin) {
      setShowLogoutModal(true);
    } else {
      // Direct logout for regular users
      performLogout();
    }
  };

  const performLogout = () => {
    // Clear authentication properly
    authUtils.removeToken();
    authUtils.clearUserInfo();
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("adminLastLogin");
    localStorage.removeItem("userLastLogin");

    console.log("✅ User logged out");

    // Redirect to login page
    navigate("/login");
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    performLogout();
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  /**
   * Fungsi untuk menangani pencarian gadget
   *
   * Alur proses:
   * 1. Mencegah perilaku default form submission
   * 2. Memeriksa apakah query pencarian tidak kosong
   * 3. Mengarahkan ke halaman Search dengan query parameter
   * 4. Mengosongkan input pencarian setelah navigasi
   * 5. Menutup menu mobile jika terbuka
   *
   * @param {Event} e - Event object
   */
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      // Close mobile menu if open
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    }
  };
  return (
    <header className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                to={isAdmin() ? "/admin" : "/"}
                className="text-2xl font-extrabold text-white drop-shadow-md hover:text-indigo-100 transition-all duration-300 transform hover:scale-105"
              >
                WiseTech
              </Link>
            </div>

            {/* Navigation - Only for regular users */}
            {!isAdmin() && (
              <nav className="hidden md:ml-6 md:flex md:space-x-8">
                <Link
                  to="/"
                  className="inline-flex items-center px-3 pt-1 border-b-2 border-transparent text-sm font-bold text-white hover:text-indigo-100 hover:border-white transition-all duration-300"
                >
                  Home
                </Link>
                <Link
                  to="/smartphones"
                  className="inline-flex items-center px-3 pt-1 border-b-2 border-transparent text-sm font-bold text-white hover:text-indigo-100 hover:border-white transition-all duration-300"
                >
                  Smartphones
                </Link>
                <Link
                  to="/laptops"
                  className="inline-flex items-center px-3 pt-1 border-b-2 border-transparent text-sm font-bold text-white hover:text-indigo-100 hover:border-white transition-all duration-300"
                >
                  Laptops
                </Link>
                <Link
                  to="/tablets"
                  className="inline-flex items-center px-3 pt-1 border-b-2 border-transparent text-sm font-bold text-white hover:text-indigo-100 hover:border-white transition-all duration-300"
                >
                  Tablets
                </Link>
                <Link
                  to="/browse-reviews"
                  className="inline-flex items-center px-3 pt-1 border-b-2 border-transparent text-sm font-bold text-white hover:text-indigo-100 hover:border-white transition-all duration-300"
                >
                  Browse Reviews
                </Link>
              </nav>
            )}

            {/* Admin Navigation */}
            {isAdmin() && (
              <nav className="hidden md:ml-6 md:flex md:space-x-8">
                <Link
                  to="/admin"
                  className="inline-flex items-center px-3 pt-1 border-b-2 border-transparent text-sm font-bold text-white hover:text-indigo-100 hover:border-white transition-all duration-300"
                >
                  Dashboard
                </Link>
              </nav>
            )}
          </div>

          {/* Search bar - Desktop - Only for regular users */}
          {!isAdmin() && (
            <div className="hidden md:flex md:flex-1 md:items-center md:justify-center px-2">
              <div className="max-w-lg w-full">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search gadgets..."
                    className="w-full bg-white bg-opacity-20 text-white placeholder-gray-100 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-white focus:border-white text-sm"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Admin info display - shows current role */}
          {isAdmin() && (
            <div className="hidden md:flex md:flex-1 md:items-center md:justify-center px-2">
              <div className="flex items-center space-x-2 bg-white bg-opacity-20 text-white px-4 py-2 rounded-full">
                <svg
                  className="h-5 w-5 text-yellow-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span className="text-sm font-medium">Administrator</span>
              </div>
            </div>
          )}

          <div className="hidden md:ml-6 md:flex md:items-center">
            <div className="ml-3 relative" ref={profileMenuRef}>
              <div>
                <button
                  onClick={toggleProfileMenu}
                  className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-9 w-9 rounded-full bg-gradient-to-r from-indigo-300 to-purple-400 p-0.5 shadow-lg transform transition-all duration-300 hover:scale-110">
                    {userProfile?.profile_photo ? (
                      <img
                        src={getProfilePhotoUrl(userProfile.profile_photo)}
                        alt="Profile"
                        className="h-8 w-8 rounded-full object-cover"
                        onLoad={() =>
                          console.log(
                            "✅ Header profile photo loaded:",
                            getProfilePhotoUrl(userProfile.profile_photo)
                          )
                        }
                        onError={(e) => {
                          console.error(
                            "❌ Header: Failed to load profile photo:",
                            userProfile.profile_photo
                          );
                          console.error(
                            "❌ Header: Full URL attempted:",
                            getProfilePhotoUrl(userProfile.profile_photo)
                          );
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className={`h-8 w-8 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold ${
                        userProfile?.profile_photo ? "hidden" : "flex"
                      }`}
                    >
                      {userProfile
                        ? (userProfile.full_name ||
                            userProfile.email ||
                            "U")[0].toUpperCase()
                        : "U"}
                    </div>
                  </div>
                </button>
              </div>

              {isProfileMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-xl py-1 bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg ring-1 ring-black ring-opacity-5 z-50 border border-indigo-100">
                  {/* User info header */}
                  {userProfile && (
                    <div className="px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-300 to-purple-400 p-0.5">
                          {userProfile.profile_photo ? (
                            <img
                              src={getProfilePhotoUrl(
                                userProfile.profile_photo
                              )}
                              alt="Profile"
                              className="w-full h-full rounded-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                          ) : null}
                          <div
                            className={`w-full h-full rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold ${
                              userProfile.profile_photo ? "hidden" : "flex"
                            }`}
                          >
                            {(userProfile.full_name ||
                              userProfile.email)[0].toUpperCase()}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {userProfile.full_name || "User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {userProfile.email}
                          </p>
                          {isAdmin() && (
                            <p className="text-xs text-indigo-600 font-medium">
                              Administrator
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Role-based menu items */}
                  {!isAdmin() && (
                    <>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50 transition-colors duration-200 rounded-md mx-1 my-1"
                      >
                        Your Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50 transition-colors duration-200 rounded-md mx-1 my-1"
                      >
                        Settings
                      </Link>
                    </>
                  )}

                  {isAdmin() && (
                    <>
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50 transition-colors duration-200 rounded-md mx-1 my-1"
                      >
                        Admin Dashboard
                      </Link>
                      <div className="block px-4 py-2 text-sm font-medium text-gray-500 cursor-not-allowed opacity-50 rounded-md mx-1 my-1">
                        Admin Settings
                      </div>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-sm font-medium text-pink-700 hover:bg-pink-50 transition-colors duration-200 rounded-md mx-1 my-1"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-indigo-100 hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-300 transition-all duration-300"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}>
        {/* Mobile search and navigation - Only for regular users */}
        {!isAdmin() && (
          <div className="pt-2 pb-3 space-y-1 bg-gradient-to-b from-indigo-400 to-purple-500">
            {/* Mobile search bar with animation */}
            <div className="px-4 py-2 animate-fadeIn">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search gadgets..."
                  className="w-full bg-white bg-opacity-20 text-white placeholder-gray-100 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-white focus:border-white text-sm shadow-inner transition-all duration-300"
                  autoComplete="off"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg
                    className="h-5 w-5 text-white hover:text-indigo-200 transition-colors duration-200"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </form>
            </div>
            <Link
              to="/"
              className="block pl-3 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-white hover:bg-purple-600 hover:border-indigo-200 hover:text-indigo-100 transition-all duration-200"
            >
              Home
            </Link>
            <Link
              to="/smartphones"
              className="block pl-3 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-white hover:bg-purple-600 hover:border-indigo-200 hover:text-indigo-100 transition-all duration-200"
            >
              Smartphones
            </Link>
            <Link
              to="/laptops"
              className="block pl-3 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-white hover:bg-purple-600 hover:border-indigo-200 hover:text-indigo-100 transition-all duration-200"
            >
              Laptops
            </Link>
            <Link
              to="/tablets"
              className="block pl-3 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-white hover:bg-purple-600 hover:border-indigo-200 hover:text-indigo-100 transition-all duration-200"
            >
              Tablets
            </Link>
            <Link
              to="/browse-reviews"
              className="block pl-3 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-white hover:bg-purple-600 hover:border-indigo-200 hover:text-indigo-100 transition-all duration-200"
            >
              Browse Reviews
            </Link>
          </div>
        )}

        <div className="pt-4 pb-3 border-t border-purple-400 bg-gradient-to-b from-purple-500 to-pink-500">
          <div className="flex items-center px-4">
            <div className="flex-shrink-0">
              <div className="h-11 w-11 rounded-full bg-gradient-to-r from-indigo-300 to-purple-400 p-0.5 shadow-lg">
                {userProfile?.profile_photo ? (
                  <img
                    src={getProfilePhotoUrl(userProfile.profile_photo)}
                    alt="Profile"
                    className="h-10 w-10 rounded-full object-cover"
                    onLoad={() =>
                      console.log(
                        "✅ Mobile profile photo loaded:",
                        getProfilePhotoUrl(userProfile.profile_photo)
                      )
                    }
                    onError={(e) => {
                      console.error(
                        "❌ Mobile: Failed to load profile photo:",
                        userProfile.profile_photo
                      );
                      console.error(
                        "❌ Mobile: Full URL attempted:",
                        getProfilePhotoUrl(userProfile.profile_photo)
                      );
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className={`h-10 w-10 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold ${
                    userProfile?.profile_photo ? "hidden" : "flex"
                  }`}
                >
                  {userProfile
                    ? (userProfile.full_name ||
                        userProfile.email ||
                        "U")[0].toUpperCase()
                    : "U"}
                </div>
              </div>
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-white">
                {userProfile?.full_name || "User"}
              </div>
              <div className="text-sm font-medium text-indigo-100">
                {userProfile?.email || "user@example.com"}
              </div>
            </div>
          </div>
          <div className="mt-3 space-y-1 px-2">
            {/* Role-based mobile menu items */}
            {!isAdmin() && (
              <>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-base font-medium text-white rounded-lg hover:bg-purple-600 transition-all duration-200"
                >
                  Your Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-base font-medium text-white rounded-lg hover:bg-purple-600 transition-all duration-200"
                >
                  Settings
                </Link>
              </>
            )}

            {isAdmin() && (
              <>
                <Link
                  to="/admin"
                  className="block px-4 py-2 text-base font-medium text-white rounded-lg hover:bg-purple-600 transition-all duration-200"
                >
                  Admin Dashboard
                </Link>
                <div className="block px-4 py-2 text-base font-medium text-gray-300 cursor-not-allowed opacity-50 rounded-lg">
                  Admin Settings
                </div>
              </>
            )}

            <button
              onClick={handleLogout}
              className="w-full text-left block px-4 py-2 text-base font-medium text-white rounded-lg hover:bg-pink-600 transition-all duration-200"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal for Admin */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
          onClick={cancelLogout}
        >
          <div
            className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mt-3 text-center">
              {/* Icon */}
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                <svg
                  className="h-6 w-6 text-yellow-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              {/* Title */}
              <h3 className="text-lg font-medium text-gray-900 mt-2">
                Admin Logout Confirmation
              </h3>

              {/* Message */}
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  You are currently logged in as an administrator. Are you sure
                  you want to logout? You will need to login again to access
                  admin features.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex justify-center space-x-4 px-4 py-3">
                <button
                  onClick={cancelLogout}
                  className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Yes, Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
