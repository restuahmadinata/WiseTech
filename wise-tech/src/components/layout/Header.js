import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Komponen Header - Navigasi utama aplikasi
 * 
 * Fitur utama:
 * - Navigasi ke halaman utama dan kategori (Smartphones, Laptops, Tablets)
 * - Menu profil pengguna (dropdown) untuk desktop
 * - Menu hamburger untuk tampilan mobile
 * - Pencarian gadget (desktop dan mobile) dengan navigasi ke halaman hasil pencarian
 * 
 * Komponen ini mengelola:
 * - Status menu mobile (buka/tutup)
 * - Status dropdown profil (buka/tutup)
 * - Pencarian gadget dengan navigasi ke halaman Search dengan query parameter
 * 
 * Integrasi API:
 * - Tidak memerlukan API langsung karena pencarian diteruskan ke halaman Search
 * - Logout: Menghapus token autentikasi dari localStorage
 */
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };
  const handleLogout = () => {
    // Clear authentication
    localStorage.removeItem('isAuthenticated');
    // Redirect to login page
    navigate('/login');
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
      setSearchQuery('');
      // Close mobile menu if open
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    }
  };
  return (
    <header className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-extrabold text-white drop-shadow-md hover:text-indigo-100 transition-all duration-300 transform hover:scale-105">
                WiseTech
              </Link>
            </div>
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              <Link to="/" className="inline-flex items-center px-3 pt-1 border-b-2 border-transparent text-sm font-bold text-white hover:text-indigo-100 hover:border-white transition-all duration-300">
                Home
              </Link>
              <Link to="/smartphones" className="inline-flex items-center px-3 pt-1 border-b-2 border-transparent text-sm font-bold text-white hover:text-indigo-100 hover:border-white transition-all duration-300">
                Smartphones
              </Link>
              <Link to="/laptops" className="inline-flex items-center px-3 pt-1 border-b-2 border-transparent text-sm font-bold text-white hover:text-indigo-100 hover:border-white transition-all duration-300">
                Laptops
              </Link>
              <Link to="/tablets" className="inline-flex items-center px-3 pt-1 border-b-2 border-transparent text-sm font-bold text-white hover:text-indigo-100 hover:border-white transition-all duration-300">
                Tablets
              </Link>
            </nav>          </div>
          
          {/* Search bar - Desktop */}
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
                  <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </form>
            </div>
          </div>
          
          <div className="hidden md:ml-6 md:flex md:items-center">
            <div className="ml-3 relative">
              <div>
                <button
                  onClick={toggleProfileMenu}
                  className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-9 w-9 rounded-full bg-gradient-to-r from-indigo-300 to-purple-400 p-0.5 shadow-lg transform transition-all duration-300 hover:scale-110">
                    <svg className="h-8 w-8 rounded-full text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </button>
              </div>

              {isProfileMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-xl py-1 bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg ring-1 ring-black ring-opacity-5 z-10 border border-indigo-100">
                  <Link to="/profile" className="block px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50 transition-colors duration-200 rounded-md mx-1 my-1">Your Profile</Link>
                  <Link to="/settings" className="block px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50 transition-colors duration-200 rounded-md mx-1 my-1">Settings</Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-sm font-medium text-pink-700 hover:bg-pink-50 transition-colors duration-200 rounded-md mx-1 my-1"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-indigo-100 hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-300 transition-all duration-300"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
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
                <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button type="submit" className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <svg className="h-5 w-5 text-white hover:text-indigo-200 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>
          </div>
          <Link to="/" className="block pl-3 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-white hover:bg-purple-600 hover:border-indigo-200 hover:text-indigo-100 transition-all duration-200">
            Home
          </Link>
          <Link to="/smartphones" className="block pl-3 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-white hover:bg-purple-600 hover:border-indigo-200 hover:text-indigo-100 transition-all duration-200">
            Smartphones
          </Link>
          <Link to="/laptops" className="block pl-3 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-white hover:bg-purple-600 hover:border-indigo-200 hover:text-indigo-100 transition-all duration-200">
            Laptops
          </Link>
          <Link to="/tablets" className="block pl-3 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-white hover:bg-purple-600 hover:border-indigo-200 hover:text-indigo-100 transition-all duration-200">
            Tablets
          </Link>
        </div>        <div className="pt-4 pb-3 border-t border-purple-400 bg-gradient-to-b from-purple-500 to-pink-500">
          <div className="flex items-center px-4">
            <div className="flex-shrink-0">
              <div className="h-11 w-11 rounded-full bg-gradient-to-r from-indigo-300 to-purple-400 p-0.5 shadow-lg">
                <svg className="h-10 w-10 rounded-full text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-white">User Name</div>
              <div className="text-sm font-medium text-indigo-100">user@example.com</div>
            </div>
          </div>
          <div className="mt-3 space-y-1 px-2">
            <Link to="/profile" className="block px-4 py-2 text-base font-medium text-white rounded-lg hover:bg-purple-600 transition-all duration-200">
              Your Profile
            </Link>
            <Link to="/settings" className="block px-4 py-2 text-base font-medium text-white rounded-lg hover:bg-purple-600 transition-all duration-200">
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left block px-4 py-2 text-base font-medium text-white rounded-lg hover:bg-pink-600 transition-all duration-200"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
