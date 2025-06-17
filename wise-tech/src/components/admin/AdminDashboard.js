/**
 * Komponen AdminDashboard - Panel kontrol admin platform
 * 
 * Fitur utama:
 * - Dashboard dengan statistik platform (overview)
 * - Manajemen gadget (tambah, edit, hapus)
 * - Manajemen ulasan (moderasi)
 * - Manajemen pengguna (lihat, edit, hapus)
 * - Melihat analitik platform
 * 
 * Tab:
 * - Overview: Grafik dan statistik
 * - Gadgets: Daftar semua gadget dengan opsi pencarian dan filter
 * - Reviews: Daftar ulasan dengan opsi moderasi
 * - Users: Daftar pengguna dengan opsi pencarian dan filter
 * - Analytics: Grafik dan laporan penggunaan
 * 
 * API yang dibutuhkan:
 * - GET /api/admin/dashboard/stats - Statistik dasbor
 * - GET /api/admin/gadgets - Daftar semua gadget (dengan pagination)
 * - GET /api/admin/reviews - Daftar semua ulasan (dengan pagination)
 * - GET /api/admin/users - Daftar semua pengguna (dengan pagination)
 * - PUT /api/admin/gadgets/:id - Edit gadget
 * - DELETE /api/admin/gadgets/:id - Hapus gadget
 * - PUT /api/admin/reviews/:id - Edit/moderasi ulasan
 * - DELETE /api/admin/reviews/:id - Hapus ulasan
 * - PUT /api/admin/users/:id - Edit data pengguna
 * 
 * Catatan keamanan:
 * API admin harus diproteksi dan hanya dapat diakses oleh pengguna dengan role='admin'
 */
import React, { useState } from 'react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [gadgets, setGadgets] = useState([
    {
      id: 1,
      name: 'iPhone 15 Pro',
      category: 'Smartphones',
      rating: 4.8,
      status: 'Published',
      added: '2023-12-01',
    },
    {
      id: 2,
      name: 'Samsung Galaxy Book Pro',
      category: 'Laptops',
      rating: 4.5,
      status: 'Published',
      added: '2023-11-15',
    },
    {
      id: 3,
      name: 'iPad Air',
      category: 'Tablets',
      rating: 4.7,
      status: 'Published',
      added: '2023-10-22',
    },
    {
      id: 4,
      name: 'Google Pixel 8',
      category: 'Smartphones',
      rating: 4.6,
      status: 'Published',
      added: '2023-09-30',
    },
    {
      id: 5,
      name: 'Dell XPS 15',
      category: 'Laptops',
      rating: 4.4,
      status: 'Draft',
      added: '2023-12-10',
    },
  ]);

  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Admin',
      reviews: 12,
      joined: '2023-01-15',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Sarah Smith',
      email: 'sarah.smith@example.com',
      role: 'User',
      reviews: 24,
      joined: '2023-02-28',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Michael Johnson',
      email: 'michael.johnson@example.com',
      role: 'User',
      reviews: 8,
      joined: '2023-03-10',
      status: 'Active',
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      role: 'Moderator',
      reviews: 15,
      joined: '2023-04-05',
      status: 'Active',
    },
    {
      id: 5,
      name: 'Robert Wilson',
      email: 'robert.wilson@example.com',
      role: 'User',
      reviews: 3,
      joined: '2023-05-20',
      status: 'Suspended',
    },
  ]);

  const [reviews, setReviews] = useState([
    {
      id: 1,
      user: 'John Doe',
      gadget: 'iPhone 15 Pro',
      rating: 5,
      status: 'Approved',
      date: '2023-12-05',
    },
    {
      id: 2,
      user: 'Sarah Smith',
      gadget: 'Samsung Galaxy Book Pro',
      rating: 4,
      status: 'Approved',
      date: '2023-12-02',
    },
    {
      id: 3,
      user: 'Michael Johnson',
      gadget: 'iPad Air',
      rating: 5,
      status: 'Pending',
      date: '2023-12-10',
    },
    {
      id: 4,
      user: 'Emily Davis',
      gadget: 'Google Pixel 8',
      rating: 3,
      status: 'Pending',
      date: '2023-12-09',
    },
    {
      id: 5,
      user: 'Robert Wilson',
      gadget: 'Dell XPS 15',
      rating: 2,
      status: 'Rejected',
      date: '2023-12-08',
    },
  ]);

  const stats = {
    totalGadgets: gadgets.length,
    totalUsers: users.length,
    totalReviews: reviews.length,
    pendingReviews: reviews.filter(review => review.status === 'Pending').length,
    activeUsers: users.filter(user => user.status === 'Active').length,
    suspendedUsers: users.filter(user => user.status === 'Suspended').length,
  };

  const handleReviewStatusChange = (id, newStatus) => {
    setReviews(
      reviews.map(review =>
        review.id === id ? { ...review, status: newStatus } : review
      )
    );
  };

  const handleUserStatusChange = (id, newStatus) => {
    setUsers(
      users.map(user =>
        user.id === id ? { ...user, status: newStatus } : user
      )
    );
  };

  const handleGadgetStatusChange = (id, newStatus) => {
    setGadgets(
      gadgets.map(gadget =>
        gadget.id === id ? { ...gadget, status: newStatus } : gadget
      )
    );
  };
  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-lg shadow-md">
                <svg className="h-8 w-8 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-indigo-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </span>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="focus:ring-pink-500 focus:border-pink-500 block w-full pl-10 sm:text-sm border-purple-300 rounded-lg shadow-sm bg-white bg-opacity-90"
                  placeholder="Search..."
                />
              </div>
              <button className="bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-2 rounded-lg text-white font-medium hover:from-pink-600 hover:to-rose-600 shadow-md transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        {/* Stats cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Total Gadgets */}
          <div className="bg-gradient-to-br from-indigo-500 to-blue-600 overflow-hidden shadow-lg rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="px-6 py-6 sm:p-8">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-white bg-opacity-30 backdrop-filter backdrop-blur-sm rounded-xl p-4">
                  <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-6 w-0 flex-1">
                  <dl>
                    <dt className="text-base font-medium text-indigo-100 truncate">Total Gadgets</dt>
                    <dd>
                      <div className="text-3xl font-bold text-white">{stats.totalGadgets}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="w-full bg-white bg-opacity-20 h-1"></div>
            <div className="px-6 py-3 bg-indigo-600 bg-opacity-80">
              <div className="text-xs text-indigo-100">Last updated: Today</div>
            </div>
          </div>

          {/* Total Users */}
          <div className="bg-gradient-to-br from-emerald-500 to-green-600 overflow-hidden shadow-lg rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="px-6 py-6 sm:p-8">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-white bg-opacity-30 backdrop-filter backdrop-blur-sm rounded-xl p-4">
                  <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="ml-6 w-0 flex-1">
                  <dl>
                    <dt className="text-base font-medium text-green-100 truncate">Total Users</dt>
                    <dd>
                      <div className="text-3xl font-bold text-white">{stats.totalUsers}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="w-full bg-white bg-opacity-20 h-1"></div>
            <div className="px-6 py-3 bg-green-600 bg-opacity-80">
              <div className="text-xs text-green-100">Last updated: Today</div>
            </div>
          </div>

          {/* Total Reviews */}
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 overflow-hidden shadow-lg rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="px-6 py-6 sm:p-8">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-white bg-opacity-30 backdrop-filter backdrop-blur-sm rounded-xl p-4">
                  <svg className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div className="ml-6 w-0 flex-1">
                  <dl>
                    <dt className="text-base font-medium text-amber-100 truncate">Total Reviews</dt>
                    <dd>
                      <div className="text-3xl font-bold text-white">{stats.totalReviews}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="w-full bg-white bg-opacity-20 h-1"></div>
            <div className="px-6 py-3 bg-orange-600 bg-opacity-80">
              <div className="text-xs text-amber-100">Last updated: Today</div>
            </div>
          </div>
        </div>        {/* Navigation tabs */}
        <div className="mt-8 bg-white shadow-md rounded-xl overflow-hidden">
          <div className="sm:hidden">
            <label htmlFor="tabs" className="sr-only">
              Select a tab
            </label>
            <select
              id="tabs"
              name="tabs"
              className="block w-full py-3 pl-4 pr-10 text-base border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gradient-to-r from-indigo-50 to-purple-50 sm:text-sm rounded-lg"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
            >
              <option value="overview">Overview</option>
              <option value="gadgets">Gadgets</option>
              <option value="users">Users</option>
              <option value="reviews">Reviews</option>
            </select>
          </div>
          <div className="hidden sm:block">
            <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 px-2 pt-2">
              <nav className="-mb-px flex space-x-2" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`${
                    activeTab === 'overview'
                      ? 'bg-white text-purple-700 shadow-md'
                      : 'bg-white bg-opacity-60 text-gray-600 hover:text-purple-700 hover:bg-white hover:bg-opacity-80'
                  } w-1/4 py-3 px-1 text-center rounded-t-lg font-medium text-sm transition-all duration-200`}
                >
                  <span className="flex items-center justify-center">
                    <svg className={`mr-2 h-5 w-5 ${activeTab === 'overview' ? 'text-purple-500' : 'text-gray-400'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                      <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                    </svg>
                    Overview
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('gadgets')}
                  className={`${
                    activeTab === 'gadgets'
                      ? 'bg-white text-blue-700 shadow-md'
                      : 'bg-white bg-opacity-60 text-gray-600 hover:text-blue-700 hover:bg-white hover:bg-opacity-80'
                  } w-1/4 py-3 px-1 text-center rounded-t-lg font-medium text-sm transition-all duration-200`}
                >
                  <span className="flex items-center justify-center">
                    <svg className={`mr-2 h-5 w-5 ${activeTab === 'gadgets' ? 'text-blue-500' : 'text-gray-400'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                    </svg>
                    Gadgets
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`${
                    activeTab === 'users'
                      ? 'bg-white text-green-700 shadow-md'
                      : 'bg-white bg-opacity-60 text-gray-600 hover:text-green-700 hover:bg-white hover:bg-opacity-80'
                  } w-1/4 py-3 px-1 text-center rounded-t-lg font-medium text-sm transition-all duration-200`}
                >
                  <span className="flex items-center justify-center">
                    <svg className={`mr-2 h-5 w-5 ${activeTab === 'users' ? 'text-green-500' : 'text-gray-400'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    Users
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`${
                    activeTab === 'reviews'
                      ? 'bg-white text-amber-700 shadow-md'
                      : 'bg-white bg-opacity-60 text-gray-600 hover:text-amber-700 hover:bg-white hover:bg-opacity-80'
                  } w-1/4 py-3 px-1 text-center rounded-t-lg font-medium text-sm transition-all duration-200`}
                >
                  <span className="flex items-center justify-center">
                    <svg className={`mr-2 h-5 w-5 ${activeTab === 'reviews' ? 'text-amber-500' : 'text-gray-400'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Reviews
                  </span>
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Tab content */}
        <div className="mt-6">
          {/* Overview */}
          {activeTab === 'overview' && (
            <div>              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Pending Reviews */}
                <div className="bg-gradient-to-r from-rose-400 to-pink-500 overflow-hidden shadow-lg rounded-xl transform transition-all duration-300 hover:shadow-xl">
                  <div className="px-5 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-white bg-opacity-30 backdrop-filter backdrop-blur-sm rounded-lg p-3">
                        <svg className="h-7 w-7 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-semibold text-rose-100 truncate">Pending Reviews</dt>
                          <dd>
                            <div className="text-2xl font-bold text-white">{stats.pendingReviews}</div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-rose-300 border-opacity-30">
                      <span className="inline-flex items-center text-xs font-medium text-rose-100">
                        <svg className="mr-1.5 h-3 w-3 text-rose-100" fill="currentColor" viewBox="0 0 8 8">
                          <circle cx="4" cy="4" r="3" />
                        </svg>
                        Needs attention
                      </span>
                    </div>
                  </div>
                </div>

                {/* Active Users */}
                <div className="bg-gradient-to-r from-teal-400 to-cyan-500 overflow-hidden shadow-lg rounded-xl transform transition-all duration-300 hover:shadow-xl">
                  <div className="px-5 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-white bg-opacity-30 backdrop-filter backdrop-blur-sm rounded-lg p-3">
                        <svg className="h-7 w-7 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-semibold text-teal-100 truncate">Active Users</dt>
                          <dd>
                            <div className="text-2xl font-bold text-white">{stats.activeUsers}</div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-teal-300 border-opacity-30">
                      <span className="inline-flex items-center text-xs font-medium text-teal-100">
                        <svg className="mr-1.5 h-3 w-3 text-teal-100" fill="currentColor" viewBox="0 0 8 8">
                          <circle cx="4" cy="4" r="3" />
                        </svg>
                        Active now
                      </span>
                    </div>
                  </div>
                </div>

                {/* Suspended Users */}
                <div className="bg-gradient-to-r from-gray-600 to-gray-700 overflow-hidden shadow-lg rounded-xl transform transition-all duration-300 hover:shadow-xl">
                  <div className="px-5 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-lg p-3">
                        <svg className="h-7 w-7 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-semibold text-gray-300 truncate">Suspended Users</dt>
                          <dd>
                            <div className="text-2xl font-bold text-white">{stats.suspendedUsers}</div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-400 border-opacity-30">
                      <span className="inline-flex items-center text-xs font-medium text-gray-300">
                        <svg className="mr-1.5 h-3 w-3 text-gray-300" fill="currentColor" viewBox="0 0 8 8">
                          <circle cx="4" cy="4" r="3" />
                        </svg>
                        Review needed
                      </span>
                    </div>
                  </div>
                </div>
              </div>              <div className="mt-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                  <button className="text-sm font-medium text-purple-600 hover:text-purple-800 flex items-center">
                    View all
                    <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    <li className="px-6 py-5 hover:bg-indigo-50 transition-colors duration-200">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-4">
                          <div className="h-10 w-10 rounded-full bg-yellow-500 flex items-center justify-center">
                            <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-indigo-600 truncate">New review posted</p>
                          <p className="text-sm text-gray-600">Michael Johnson reviewed iPad Air</p>
                          <div className="mt-1 flex items-center">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <p className="ml-2 text-xs text-gray-500">2 hours ago</p>
                          </div>
                        </div>
                        <div>
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300">
                            Pending
                          </span>
                        </div>
                      </div>
                    </li>
                    <li className="px-6 py-5 hover:bg-indigo-50 transition-colors duration-200">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-4">
                          <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                            <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                            </svg>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-indigo-600 truncate">New user registered</p>
                          <p className="text-sm text-gray-600">David Brown (david.brown@example.com)</p>
                          <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                        </div>
                        <div>
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 border border-green-300">
                            New
                          </span>
                        </div>
                      </div>
                    </li>
                    <li className="px-6 py-5 hover:bg-indigo-50 transition-colors duration-200">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-4">
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                            <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-indigo-600 truncate">Gadget added</p>
                          <p className="text-sm text-gray-600">Dell XPS 15 added to Laptops category</p>
                          <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                        </div>
                        <div>
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                            Draft
                          </span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Gadgets */}
          {activeTab === 'gadgets' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="sm:flex sm:items-center">
                  <div className="sm:flex-auto">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">All Gadgets</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      A list of all the gadgets in your account including their name, category, rating, and status.
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Add Gadget
                    </button>
                  </div>
                </div>
                <div className="mt-8 flex flex-col">
                  <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                Name
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Category
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Rating
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Status
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Added
                              </th>
                              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                <span className="sr-only">Actions</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {gadgets.map((gadget) => (
                              <tr key={gadget.id}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                  {gadget.name}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{gadget.category}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{gadget.rating}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      gadget.status === 'Published'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}
                                  >
                                    {gadget.status}
                                  </span>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{gadget.added}</td>
                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                  <div className="flex space-x-2 justify-end">
                                    <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                      Edit
                                    </a>
                                    {gadget.status === 'Draft' ? (
                                      <button
                                        onClick={() => handleGadgetStatusChange(gadget.id, 'Published')}
                                        className="text-green-600 hover:text-green-900"
                                      >
                                        Publish
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => handleGadgetStatusChange(gadget.id, 'Draft')}
                                        className="text-yellow-600 hover:text-yellow-900"
                                      >
                                        Unpublish
                                      </button>
                                    )}
                                    <button className="text-red-600 hover:text-red-900">Delete</button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users */}
          {activeTab === 'users' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="sm:flex sm:items-center">
                  <div className="sm:flex-auto">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">All Users</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      A list of all the users in your account including their name, email, role, and status.
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Add User
                    </button>
                  </div>
                </div>
                <div className="mt-8 flex flex-col">
                  <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                Name
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Email
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Role
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Reviews
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Joined
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Status
                              </th>
                              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                <span className="sr-only">Actions</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {users.map((user) => (
                              <tr key={user.id}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                  {user.name}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.email}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      user.role === 'Admin'
                                        ? 'bg-purple-100 text-purple-800'
                                        : user.role === 'Moderator'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}
                                  >
                                    {user.role}
                                  </span>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.reviews}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.joined}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      user.status === 'Active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}
                                  >
                                    {user.status}
                                  </span>
                                </td>
                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                  <div className="flex space-x-2 justify-end">
                                    <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                      Edit
                                    </a>
                                    {user.status === 'Active' ? (
                                      <button
                                        onClick={() => handleUserStatusChange(user.id, 'Suspended')}
                                        className="text-red-600 hover:text-red-900"
                                      >
                                        Suspend
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => handleUserStatusChange(user.id, 'Active')}
                                        className="text-green-600 hover:text-green-900"
                                      >
                                        Activate
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reviews */}
          {activeTab === 'reviews' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="sm:flex sm:items-center">
                  <div className="sm:flex-auto">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">All Reviews</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      A list of all the reviews submitted by users, with moderation options.
                    </p>
                  </div>
                </div>
                <div className="mt-8 flex flex-col">
                  <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                User
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Gadget
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Rating
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Status
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Date
                              </th>
                              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                <span className="sr-only">Actions</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {reviews.map((review) => (
                              <tr key={review.id}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                  {review.user}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{review.gadget}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{review.rating}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      review.status === 'Approved'
                                        ? 'bg-green-100 text-green-800'
                                        : review.status === 'Pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}
                                  >
                                    {review.status}
                                  </span>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{review.date}</td>
                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                  <div className="flex space-x-2 justify-end">
                                    <button
                                      onClick={() => handleReviewStatusChange(review.id, 'Approved')}
                                      className="text-green-600 hover:text-green-900"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => handleReviewStatusChange(review.id, 'Rejected')}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      Reject
                                    </button>
                                    <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                      View
                                    </a>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
