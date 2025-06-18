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

  // Function to render rating using DaisyUI rating component
  const renderRating = (rating) => {
    return (
      <div className="rating rating-sm">
        {[1, 2, 3, 4, 5].map((star) => (
          <input
            key={star}
            type="radio"
            name={`rating-${Math.random()}`}
            className={`mask mask-star-2 ${star <= Math.round(rating) ? 'bg-warning' : 'bg-opacity-20'}`}
            checked={star === Math.round(rating)}
            readOnly
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
      <div className="navbar bg-gradient-to-r from-primary to-secondary text-primary-content shadow-lg">
        <div className="navbar-start">
          <div className="flex items-center space-x-3">
            <div className="bg-base-100 p-2 rounded-lg shadow-md">
              <svg className="h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
        </div>
        <div className="navbar-center hidden lg:flex">
          <div className="form-control">
            <div className="input-group">
              <input type="text" placeholder="Search..." className="input input-bordered" />
              <button className="btn btn-square">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
            </div>
          </div>
        </div>
        <div className="navbar-end">
          <button className="btn btn-ghost btn-circle">
            <div className="indicator">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="badge badge-sm badge-accent indicator-item">{stats.pendingReviews}</span>
            </div>
          </button>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img alt="Admin avatar" src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><a>Profile</a></li>
              <li><a>Settings</a></li>
              <li><a>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Stats cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Total Gadgets */}
          <div className="stats shadow bg-gradient-to-br from-primary to-primary-focus text-primary-content">
            <div className="stat">
              <div className="stat-figure text-primary-content">
                <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="stat-title">Total Gadgets</div>
              <div className="stat-value">{stats.totalGadgets}</div>
              <div className="stat-desc">Last updated: Today</div>
            </div>
          </div>

          {/* Total Users */}
          <div className="stats shadow bg-gradient-to-br from-secondary to-secondary-focus text-secondary-content">
            <div className="stat">
              <div className="stat-figure text-secondary-content">
                <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="stat-title">Total Users</div>
              <div className="stat-value">{stats.totalUsers}</div>
              <div className="stat-desc">Active: {stats.activeUsers} | Suspended: {stats.suspendedUsers}</div>
            </div>
          </div>

          {/* Total Reviews */}
          <div className="stats shadow bg-gradient-to-br from-accent to-accent-focus text-accent-content">
            <div className="stat">
              <div className="stat-figure text-accent-content">
                <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="stat-title">Total Reviews</div>
              <div className="stat-value">{stats.totalReviews}</div>
              <div className="stat-desc">Pending approval: {stats.pendingReviews}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="my-8">
          <div className="tabs tabs-boxed">
            <a 
              className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </a>
            <a 
              className={`tab ${activeTab === 'gadgets' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('gadgets')}
            >
              Gadgets
            </a>
            <a 
              className={`tab ${activeTab === 'reviews' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </a>
            <a 
              className={`tab ${activeTab === 'users' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Users
            </a>
            <a 
              className={`tab ${activeTab === 'analytics' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              Analytics
            </a>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {/* Gadgets Tab */}
          {activeTab === 'gadgets' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Manage Gadgets</h2>
                <button className="btn btn-primary">
                  <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add New Gadget
                </button>
              </div>

              <div className="card bg-base-100 shadow-xl">
                <div className="card-body p-0">
                  <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Category</th>
                          <th>Rating</th>
                          <th>Status</th>
                          <th>Date Added</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gadgets.map(gadget => (
                          <tr key={gadget.id}>
                            <td>{gadget.id}</td>
                            <td>{gadget.name}</td>
                            <td>
                              <div className="badge badge-ghost">{gadget.category}</div>
                            </td>
                            <td>
                              {renderRating(gadget.rating)}
                              <span className="ml-1 text-sm">{gadget.rating}</span>
                            </td>
                            <td>
                              <div className={`badge ${
                                gadget.status === 'Published' 
                                  ? 'badge-success' 
                                  : 'badge-warning'
                              }`}>
                                {gadget.status}
                              </div>
                            </td>
                            <td>{gadget.added}</td>
                            <td>
                              <div className="flex space-x-2">
                                <button className="btn btn-xs btn-ghost btn-circle">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                  </svg>
                                </button>
                                <button className="btn btn-xs btn-ghost btn-circle">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                  </svg>
                                </button>
                                <button className="btn btn-xs btn-ghost btn-circle text-error">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="card-footer bg-base-200 px-4 py-3 flex justify-between items-center">
                  <div className="text-sm text-base-content/70">
                    Showing 1 to {gadgets.length} of {gadgets.length} gadgets
                  </div>
                  <div className="join">
                    <button className="join-item btn btn-sm">«</button>
                    <button className="join-item btn btn-sm btn-active">1</button>
                    <button className="join-item btn btn-sm">»</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Manage Users</h2>
                <button className="btn btn-primary">
                  <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add New User
                </button>
              </div>

              <div className="card bg-base-100 shadow-xl">
                <div className="card-body p-0">
                  <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Reviews</th>
                          <th>Joined</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(user => (
                          <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>
                              <div className="flex items-center space-x-3">
                                <div className="avatar placeholder">
                                  <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                                    <span>{user.name.charAt(0)}</span>
                                  </div>
                                </div>
                                <div>{user.name}</div>
                              </div>
                            </td>
                            <td>{user.email}</td>
                            <td>
                              <div className={`badge ${
                                user.role === 'Admin' 
                                  ? 'badge-primary' 
                                  : user.role === 'Moderator'
                                  ? 'badge-secondary'
                                  : 'badge-ghost'
                              }`}>
                                {user.role}
                              </div>
                            </td>
                            <td>{user.reviews}</td>
                            <td>{user.joined}</td>
                            <td>
                              <div className={`badge ${
                                user.status === 'Active' 
                                  ? 'badge-success' 
                                  : 'badge-error'
                              }`}>
                                {user.status}
                              </div>
                            </td>
                            <td>
                              <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-xs btn-ghost m-1">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                  </svg>
                                </div>
                                <ul tabIndex={0} className="dropdown-content z-[1] menu menu-sm p-2 shadow bg-base-100 rounded-box w-32">
                                  <li><a>Edit</a></li>
                                  <li><a className={user.status === 'Active' ? 'text-error' : 'text-success'}>
                                    {user.status === 'Active' ? 'Suspend' : 'Activate'}
                                  </a></li>
                                  <li><a className="text-error">Delete</a></li>
                                </ul>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="card-footer bg-base-200 px-4 py-3 flex justify-between items-center">
                  <div className="text-sm text-base-content/70">
                    Showing 1 to {users.length} of {users.length} users
                  </div>
                  <div className="join">
                    <button className="join-item btn btn-sm">«</button>
                    <button className="join-item btn btn-sm btn-active">1</button>
                    <button className="join-item btn btn-sm">»</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Manage Reviews</h2>
                <div className="join">
                  <button className="btn join-item btn-sm">All</button>
                  <button className="btn join-item btn-sm">Pending</button>
                  <button className="btn join-item btn-sm">Approved</button>
                  <button className="btn join-item btn-sm">Rejected</button>
                </div>
              </div>

              <div className="card bg-base-100 shadow-xl">
                <div className="card-body p-0">
                  <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>User</th>
                          <th>Gadget</th>
                          <th>Rating</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reviews.map(review => (
                          <tr key={review.id}>
                            <td>{review.id}</td>
                            <td>{review.user}</td>
                            <td>{review.gadget}</td>
                            <td>
                              {renderRating(review.rating)}
                            </td>
                            <td>{review.date}</td>
                            <td>
                              <div className={`badge ${
                                review.status === 'Approved' 
                                  ? 'badge-success' 
                                  : review.status === 'Rejected'
                                  ? 'badge-error'
                                  : 'badge-warning'
                              }`}>
                                {review.status}
                              </div>
                            </td>
                            <td>
                              <div className="flex space-x-2">
                                <button className="btn btn-xs btn-ghost">
                                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                  </svg>
                                </button>
                                <button 
                                  className={`btn btn-xs ${review.status !== 'Approved' ? 'btn-success' : 'btn-ghost'}`}
                                  onClick={() => handleReviewStatusChange(review.id, 'Approved')}
                                  disabled={review.status === 'Approved'}
                                >
                                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </button>
                                <button 
                                  className={`btn btn-xs ${review.status !== 'Rejected' ? 'btn-error' : 'btn-ghost'}`}
                                  onClick={() => handleReviewStatusChange(review.id, 'Rejected')}
                                  disabled={review.status === 'Rejected'}
                                >
                                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="card-footer bg-base-200 px-4 py-3 flex justify-between items-center">
                  <div className="text-sm text-base-content/70">
                    Showing 1 to {reviews.length} of {reviews.length} reviews
                  </div>
                  <div className="join">
                    <button className="join-item btn btn-sm">«</button>
                    <button className="join-item btn btn-sm btn-active">1</button>
                    <button className="join-item btn btn-sm">»</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Overview Tab (Default) */}
          {(activeTab === 'overview' || activeTab === 'analytics') && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {activeTab === 'overview' ? 'Dashboard Overview' : 'Analytics Report'}
                </h2>
                <div className="join">
                  <button className="btn join-item btn-sm">Today</button>
                  <button className="btn join-item btn-sm btn-active">Week</button>
                  <button className="btn join-item btn-sm">Month</button>
                  <button className="btn join-item btn-sm">Year</button>
                </div>
              </div>

              <div className="card bg-base-100 shadow-xl p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4">Activity Overview</h3>
                <div className="h-64 w-full bg-base-200 flex items-center justify-center">
                  <p className="text-base-content/60">Charts and graphs would be displayed here</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title">Recent Gadget Additions</h3>
                    <div className="overflow-x-auto">
                      <table className="table table-zebra w-full">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Date Added</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gadgets.slice(0, 3).map((gadget) => (
                            <tr key={gadget.id}>
                              <td>{gadget.name}</td>
                              <td>{gadget.category}</td>
                              <td>{gadget.added}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="card-actions justify-end mt-4">
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => setActiveTab('gadgets')}
                      >
                        View All
                      </button>
                    </div>
                  </div>
                </div>

                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title">Recent Reviews</h3>
                    <div className="overflow-x-auto">
                      <table className="table table-zebra w-full">
                        <thead>
                          <tr>
                            <th>User</th>
                            <th>Gadget</th>
                            <th>Rating</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reviews.slice(0, 3).map((review) => (
                            <tr key={review.id}>
                              <td>{review.user}</td>
                              <td>{review.gadget}</td>
                              <td>{review.rating}/5</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="card-actions justify-end mt-4">
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => setActiveTab('reviews')}
                      >
                        View All
                      </button>
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
