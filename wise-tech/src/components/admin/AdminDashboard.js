/**
 * Komponen AdminDashboard - Panel kontrol admin platform
 */
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { authUtils, adminAPI } from '../../utils/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  // API data states
  const [stats, setStats] = useState({});
  const [gadgets, setGadgets] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');
  const [dataLoading, setDataLoading] = useState(false);
  
  // Filters for reviews
  const [reviewFilter, setReviewFilter] = useState('all');
  
  // Modal state for viewing review details
  const [selectedReview, setSelectedReview] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  // Modal state for editing user details
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editUserForm, setEditUserForm] = useState({
    full_name: '',
    email: '',
    username: '',
    is_admin: false,
  });

  // Modal state for adding new user
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [addUserForm, setAddUserForm] = useState({
    full_name: '',
    email: '',
    username: '',
    password: '',
    is_admin: false,
  });

  // Modal state for editing review
  const [showEditReviewModal, setShowEditReviewModal] = useState(false);
  const [editReviewForm, setEditReviewForm] = useState({
    title: '',
    content: '',
    rating: 5,
    pros: '',
    cons: '',
  });

  // Modal state for gadget management
  const [selectedGadget, setSelectedGadget] = useState(null);
  const [showGadgetModal, setShowGadgetModal] = useState(false);
  const [showAddGadgetModal, setShowAddGadgetModal] = useState(false);
  const [editGadgetForm, setEditGadgetForm] = useState({
    name: '',
    category: '',
    brand: '',
    price: '',
    description: '',
    image_url: '',
    release_date: '',
  });
  const [addGadgetForm, setAddGadgetForm] = useState({
    name: '',
    category: '',
    brand: '',
    price: '',
    description: '',
    image_url: '',
    release_date: '',
  });

  // Logout confirmation state
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Calculate stats dynamically from current data
  const calculateStats = () => {
    const totalGadgets = gadgets.length;
    const totalUsers = users.length;
    const totalReviews = reviews.length;
    const pendingReviews = reviews.filter(r => r.status === 'Pending').length;

    return {
      totalGadgets,
      totalUsers,
      totalReviews,
      pendingReviews,
    };
  };

  // API Functions
  const fetchDashboardStats = async () => {
    try {
      setDataLoading(true);
      setError('');
      const data = await adminAPI.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Failed to load dashboard statistics');
      setStats({
        totalGadgets: 0,
        totalUsers: 0,
        totalReviews: 0,
        pendingReviews: 0,
      });
    } finally {
      setDataLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setDataLoading(true);
      const data = await adminAPI.getUsers({ pageSize: 50 });
      setUsers(data.users || data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users');
      setUsers([]);
    } finally {
      setDataLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setDataLoading(true);
      const data = await adminAPI.getReviews({ pageSize: 50 });
      setReviews(data.reviews || data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews');
      setReviews([]);
    } finally {
      setDataLoading(false);
    }
  };

  const fetchGadgets = async () => {
    try {
      setDataLoading(true);
      const data = await adminAPI.getGadgets({ pageSize: 50 });
      setGadgets(data.gadgets || data || []);
    } catch (error) {
      console.error('Error fetching gadgets:', error);
      setError('Failed to load gadgets');
      setGadgets([]);
    } finally {
      setDataLoading(false);
    }
  };

  const fetchAllData = async () => {
    await Promise.all([
      fetchDashboardStats(),
      fetchUsers(),
      fetchReviews(),
      fetchGadgets()
    ]);
  };

  // User CRUD handlers
  const handleAddUser = () => {
    setAddUserForm({
      full_name: '',
      email: '',
      username: '',
      password: '',
      is_admin: false,
    });
    setShowAddUserModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditUserForm({
      full_name: user.full_name || '',
      email: user.email || '',
      username: user.username || '',
      is_admin: user.is_admin || false,
    });
    setShowUserModal(true);
  };

  const handleSaveNewUser = async () => {
    try {
      setDataLoading(true);
      const response = await adminAPI.createUser(addUserForm);
      setUsers([...users, response]);
      setShowAddUserModal(false);
      console.log('✅ User created successfully');
      
      // Refresh stats
      const calculatedStats = calculateStats();
      setStats(calculatedStats);
    } catch (error) {
      console.error('❌ Error creating user:', error);
      setError('Failed to create user: ' + (error.message || 'Unknown error'));
    } finally {
      setDataLoading(false);
    }
  };

  const handleSaveUser = async () => {
    try {
      setDataLoading(true);
      const response = await adminAPI.updateUser(selectedUser.id, editUserForm);
      setUsers(users.map(user => user.id === selectedUser.id ? response : user));
      setShowUserModal(false);
      console.log('✅ User updated successfully');
    } catch (error) {
      console.error('❌ Error updating user:', error);
      setError('Failed to update user: ' + (error.message || 'Unknown error'));
    } finally {
      setDataLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      setDataLoading(true);
      await adminAPI.deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      console.log('✅ User deleted successfully');
      
      // Refresh stats
      const calculatedStats = calculateStats();
      setStats(calculatedStats);
    } catch (error) {
      console.error('❌ Error deleting user:', error);
      setError('Failed to delete user: ' + (error.message || 'Unknown error'));
    } finally {
      setDataLoading(false);
    }
  };

  // Review CRUD handlers
  const handleEditReview = (review) => {
    setSelectedReview(review);
    setEditReviewForm({
      title: review.title || '',
      content: review.content || review.comment || '',
      rating: review.rating || 5,
      pros: review.pros || '',
      cons: review.cons || '',
    });
    setShowEditReviewModal(true);
  };

  const handleSaveReview = async () => {
    try {
      setDataLoading(true);
      const response = await adminAPI.updateReview(selectedReview.id, editReviewForm);
      setReviews(reviews.map(review => review.id === selectedReview.id ? response : review));
      setShowEditReviewModal(false);
      console.log('✅ Review updated successfully');
    } catch (error) {
      console.error('❌ Error updating review:', error);
      setError('Failed to update review: ' + (error.message || 'Unknown error'));
    } finally {
      setDataLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }

    try {
      setDataLoading(true);
      await adminAPI.deleteReview(reviewId);
      setReviews(reviews.filter(review => review.id !== reviewId));
      console.log('✅ Review deleted successfully');
      
      // Refresh stats
      const calculatedStats = calculateStats();
      setStats(calculatedStats);
    } catch (error) {
      console.error('❌ Error deleting review:', error);
      setError('Failed to delete review: ' + (error.message || 'Unknown error'));
    } finally {
      setDataLoading(false);
    }
  };

  // Gadget CRUD handlers
  const handleAddGadget = () => {
    setAddGadgetForm({
      name: '',
      category: '',
      brand: '',
      price: '',
      description: '',
      image_url: '',
      release_date: '',
    });
    setShowAddGadgetModal(true);
  };

  const handleEditGadget = (gadget) => {
    setSelectedGadget(gadget);
    setEditGadgetForm({
      name: gadget.name || '',
      category: gadget.category || '',
      brand: gadget.brand || '',
      price: gadget.price || '',
      description: gadget.description || '',
      image_url: gadget.image_url || '',
      release_date: gadget.release_date ? gadget.release_date.split('T')[0] : '',
    });
    setShowGadgetModal(true);
  };

  const handleSaveNewGadget = async () => {
    try {
      setDataLoading(true);
      
      // Convert release_date to proper datetime format
      let releaseDatetime;
      if (addGadgetForm.release_date) {
        // Convert YYYY-MM-DD to YYYY-MM-DDTHH:MM:SSZ format
        releaseDatetime = new Date(addGadgetForm.release_date + 'T00:00:00Z').toISOString();
      } else {
        releaseDatetime = new Date().toISOString();
      }
      
      const gadgetData = {
        name: addGadgetForm.name,
        brand: addGadgetForm.brand,
        category: addGadgetForm.category,
        description: addGadgetForm.description,
        price: parseFloat(addGadgetForm.price) || 0,
        image_url: addGadgetForm.image_url || null,
        release_date: releaseDatetime,
      };
      
      console.log('🚀 Sending gadget data:', gadgetData);
      const response = await adminAPI.createGadget(gadgetData);
      setGadgets([...gadgets, response]);
      setShowAddGadgetModal(false);
      console.log('✅ Gadget created successfully');
      
      // Refresh stats
      const calculatedStats = calculateStats();
      setStats(calculatedStats);
    } catch (error) {
      console.error('❌ Error creating gadget:', error);
      setError('Failed to create gadget: ' + (error.message || 'Unknown error'));
    } finally {
      setDataLoading(false);
    }
  };

  const handleSaveGadget = async () => {
    try {
      setDataLoading(true);
      
      // Convert release_date to proper datetime format
      let releaseDatetime;
      if (editGadgetForm.release_date) {
        // Convert YYYY-MM-DD to YYYY-MM-DDTHH:MM:SSZ format
        releaseDatetime = new Date(editGadgetForm.release_date + 'T00:00:00Z').toISOString();
      } else {
        releaseDatetime = new Date().toISOString();
      }
      
      const gadgetData = {
        name: editGadgetForm.name,
        brand: editGadgetForm.brand,
        category: editGadgetForm.category,
        description: editGadgetForm.description,
        price: parseFloat(editGadgetForm.price) || 0,
        image_url: editGadgetForm.image_url || null,
        release_date: releaseDatetime,
      };
      
      const response = await adminAPI.updateGadget(selectedGadget.id, gadgetData);
      setGadgets(gadgets.map(gadget => gadget.id === selectedGadget.id ? response : gadget));
      setShowGadgetModal(false);
      console.log('✅ Gadget updated successfully');
    } catch (error) {
      console.error('❌ Error updating gadget:', error);
      setError('Failed to update gadget: ' + (error.message || 'Unknown error'));
    } finally {
      setDataLoading(false);
    }
  };

  const handleDeleteGadget = async (gadgetId) => {
    if (!window.confirm('Are you sure you want to delete this gadget? This action cannot be undone and will also delete all associated reviews.')) {
      return;
    }

    try {
      setDataLoading(true);
      await adminAPI.deleteGadget(gadgetId);
      setGadgets(gadgets.filter(gadget => gadget.id !== gadgetId));
      console.log('✅ Gadget deleted successfully');
      
      // Refresh stats
      const calculatedStats = calculateStats();
      setStats(calculatedStats);
    } catch (error) {
      console.error('❌ Error deleting gadget:', error);
      setError('Failed to delete gadget: ' + (error.message || 'Unknown error'));
    } finally {
      setDataLoading(false);
    }
  };

  // Modal handlers
  const closeAddUserModal = () => {
    setShowAddUserModal(false);
    setAddUserForm({
      full_name: '',
      email: '',
      username: '',
      password: '',
      is_admin: false,
    });
  };

  const closeUserModal = () => {
    setSelectedUser(null);
    setShowUserModal(false);
    setEditUserForm({
      full_name: '',
      email: '',
      username: '',
      is_admin: false,
    });
  };

  const closeEditReviewModal = () => {
    setSelectedReview(null);
    setShowEditReviewModal(false);
    setEditReviewForm({
      title: '',
      content: '',
      rating: 5,
      pros: '',
      cons: '',
    });
  };

  const closeAddGadgetModal = () => {
    setShowAddGadgetModal(false);
    setAddGadgetForm({
      name: '',
      category: '',
      brand: '',
      price: '',
      description: '',
      image_url: '',
      release_date: '',
    });
  };

  const closeGadgetModal = () => {
    setSelectedGadget(null);
    setShowGadgetModal(false);
    setEditGadgetForm({
      name: '',
      category: '',
      brand: '',
      price: '',
      description: '',
      image_url: '',
      release_date: '',
    });
  };

  // Handle logout with confirmation
  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    authUtils.removeToken();
    authUtils.clearUserInfo();
    localStorage.removeItem('isAuthenticated');
    console.log('🔓 Admin logged out at:', new Date().toISOString());
    window.location.href = '/login';
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Check if user is admin and fetch data
  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        setIsLoading(true);
        
        console.log('🔍 AdminDashboard - Checking admin access...');
        console.log('🔍 AdminDashboard - authUtils.isAuthenticated():', authUtils.isAuthenticated());
        console.log('🔍 AdminDashboard - authUtils.isAdmin():', authUtils.isAdmin());
        console.log('🔍 AdminDashboard - localStorage userInfo:', localStorage.getItem('userInfo'));
        console.log('🔍 AdminDashboard - localStorage user_is_admin:', localStorage.getItem('user_is_admin'));
        
        if (!authUtils.isAuthenticated()) {
          console.log('❌ AdminDashboard - User not authenticated');
          setIsAuthorized(false);
          return;
        }
        
        if (!authUtils.isAdmin()) {
          console.log('❌ AdminDashboard - User not admin');
          setIsAuthorized(false);
          return;
        }

        console.log('✅ AdminDashboard - Admin access granted');
        setIsAuthorized(true);
        await fetchAllData();
      } catch (error) {
        console.error('❌ AdminDashboard - Error checking admin access:', error);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAccess();
  }, []);

  // Show loading while checking authorization
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Checking admin access...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authorized
  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

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
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-indigo-200 text-sm">WiseTech Platform Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {['overview', 'users', 'gadgets', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Content based on active tab */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.totalUsers || 0}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Reviews</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.totalReviews || 0}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Gadgets</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.totalGadgets || 0}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Pending Reviews</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.pendingReviews || 0}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="sm:flex sm:items-center">
                  <div className="sm:flex-auto">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">All Users</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      A list of all the users in your account including their name, email, and role.
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                      type="button"
                      onClick={handleAddUser}
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
                                Joined
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
                                  {user.full_name || user.username}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.email}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      user.is_admin
                                        ? 'bg-purple-100 text-purple-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}
                                  >
                                    {user.is_admin ? 'Admin' : 'User'}
                                  </span>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  {new Date(user.joined_date).toLocaleDateString()}
                                </td>
                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                  <div className="flex space-x-2 justify-end">
                                    <button
                                      onClick={() => handleEditUser(user)}
                                      className="text-indigo-600 hover:text-indigo-900"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDeleteUser(user.id)}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      Delete
                                    </button>
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

          {/* Gadgets Tab */}
          {activeTab === 'gadgets' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="sm:flex sm:items-center">
                  <div className="sm:flex-auto">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">All Gadgets</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      A list of all the gadgets in your platform including their details and specifications.
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                      type="button"
                      onClick={handleAddGadget}
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
                                Brand
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Price
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                Created
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
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{gadget.brand}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  ${gadget.price ? parseFloat(gadget.price).toLocaleString() : 'N/A'}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  {new Date(gadget.created_at || Date.now()).toLocaleDateString()}
                                </td>
                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                  <div className="flex space-x-2 justify-end">
                                    <button
                                      onClick={() => handleEditGadget(gadget)}
                                      className="text-indigo-600 hover:text-indigo-900"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDeleteGadget(gadget.id)}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      Delete
                                    </button>
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

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="sm:flex sm:items-center">
                  <div className="sm:flex-auto">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">All Reviews</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      A list of all the reviews submitted by users.
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
                                  {review.user_name || review.user}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{review.gadget_name || review.gadget}</td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <svg
                                        key={i}
                                        className={`h-4 w-4 ${
                                          i < Math.floor(review.rating) ? 'text-yellow-400' : 'text-gray-200'
                                        }`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                    ))}
                                    <span className="ml-2 text-sm text-gray-500">{review.rating}</span>
                                  </div>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  {new Date(review.created_at || review.date).toLocaleDateString()}
                                </td>
                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                  <div className="flex space-x-2 justify-end">
                                    <button
                                      onClick={() => handleEditReview(review)}
                                      className="text-blue-600 hover:text-blue-900"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDeleteReview(review.id)}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      Delete
                                    </button>
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

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New User</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    value={addUserForm.full_name}
                    onChange={(e) => setAddUserForm({...addUserForm, full_name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    value={addUserForm.username}
                    onChange={(e) => setAddUserForm({...addUserForm, username: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={addUserForm.email}
                    onChange={(e) => setAddUserForm({...addUserForm, email: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    value={addUserForm.password}
                    onChange={(e) => setAddUserForm({...addUserForm, password: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_admin"
                    checked={addUserForm.is_admin}
                    onChange={(e) => setAddUserForm({...addUserForm, is_admin: e.target.checked})}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_admin" className="ml-2 block text-sm text-gray-900">
                    Admin User
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
                <button
                  onClick={closeAddUserModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNewUser}
                  disabled={dataLoading}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {dataLoading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit User</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    value={editUserForm.full_name}
                    onChange={(e) => setEditUserForm({...editUserForm, full_name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={editUserForm.email}
                    onChange={(e) => setEditUserForm({...editUserForm, email: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="edit_is_admin"
                    checked={editUserForm.is_admin}
                    onChange={(e) => setEditUserForm({...editUserForm, is_admin: e.target.checked})}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="edit_is_admin" className="ml-2 block text-sm text-gray-900">
                    Admin User
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
                <button
                  onClick={closeUserModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveUser}
                  disabled={dataLoading}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {dataLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Review Modal */}
      {showEditReviewModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Review</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={editReviewForm.title}
                    onChange={(e) => setEditReviewForm({...editReviewForm, title: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Content</label>
                  <textarea
                    value={editReviewForm.content}
                    onChange={(e) => setEditReviewForm({...editReviewForm, content: e.target.value})}
                    rows={4}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rating</label>
                  <select
                    value={editReviewForm.rating}
                    onChange={(e) => setEditReviewForm({...editReviewForm, rating: parseInt(e.target.value)})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value={1}>1 Star</option>
                    <option value={2}>2 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={5}>5 Stars</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
                <button
                  onClick={closeEditReviewModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveReview}
                  disabled={dataLoading}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {dataLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Gadget Modal */}
      {showAddGadgetModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-[500px] shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Gadget</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={addGadgetForm.name}
                    onChange={(e) => setAddGadgetForm({...addGadgetForm, name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={addGadgetForm.category}
                    onChange={(e) => setAddGadgetForm({...addGadgetForm, category: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select Category</option>
                    <option value="Smartphones">Smartphones</option>
                    <option value="Laptops">Laptops</option>
                    <option value="Tablets">Tablets</option>
                    <option value="Wearables">Wearables</option>
                    <option value="Audio">Audio</option>
                    <option value="Gaming">Gaming</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Brand</label>
                  <input
                    type="text"
                    value={addGadgetForm.brand}
                    onChange={(e) => setAddGadgetForm({...addGadgetForm, brand: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={addGadgetForm.price}
                    onChange={(e) => setAddGadgetForm({...addGadgetForm, price: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={addGadgetForm.description}
                    onChange={(e) => setAddGadgetForm({...addGadgetForm, description: e.target.value})}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Image URL</label>
                  <input
                    type="url"
                    value={addGadgetForm.image_url}
                    onChange={(e) => setAddGadgetForm({...addGadgetForm, image_url: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Release Date</label>
                  <input
                    type="date"
                    value={addGadgetForm.release_date}
                    onChange={(e) => setAddGadgetForm({...addGadgetForm, release_date: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
                <button
                  onClick={closeAddGadgetModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNewGadget}
                  disabled={dataLoading}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {dataLoading ? 'Creating...' : 'Create Gadget'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Gadget Modal */}
      {showGadgetModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-[500px] shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Gadget</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={editGadgetForm.name}
                    onChange={(e) => setEditGadgetForm({...editGadgetForm, name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={editGadgetForm.category}
                    onChange={(e) => setEditGadgetForm({...editGadgetForm, category: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select Category</option>
                    <option value="Smartphones">Smartphones</option>
                    <option value="Laptops">Laptops</option>
                    <option value="Tablets">Tablets</option>
                    <option value="Wearables">Wearables</option>
                    <option value="Audio">Audio</option>
                    <option value="Gaming">Gaming</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Brand</label>
                  <input
                    type="text"
                    value={editGadgetForm.brand}
                    onChange={(e) => setEditGadgetForm({...editGadgetForm, brand: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editGadgetForm.price}
                    onChange={(e) => setEditGadgetForm({...editGadgetForm, price: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={editGadgetForm.description}
                    onChange={(e) => setEditGadgetForm({...editGadgetForm, description: e.target.value})}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Image URL</label>
                  <input
                    type="url"
                    value={editGadgetForm.image_url}
                    onChange={(e) => setEditGadgetForm({...editGadgetForm, image_url: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
                <button
                  onClick={closeGadgetModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveGadget}
                  disabled={dataLoading}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {dataLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-80 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900">Confirm Logout</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to logout from the admin dashboard?
                </p>
              </div>
              <div className="flex justify-center space-x-3 pt-4">
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
    </div>
  );
};

export default AdminDashboard;
