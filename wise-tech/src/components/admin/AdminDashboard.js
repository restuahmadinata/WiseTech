/**
 * Komponen AdminDashboard - Panel kontrol admin platform
 */
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { authUtils, adminAPI, authAPI } from "../../utils/api";
import Alert from "../common/Alert";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // API data states
  const [stats, setStats] = useState({});
  const [gadgets, setGadgets] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [dataLoading, setDataLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  // Admin user info state
  const [currentAdmin, setCurrentAdmin] = useState(null);

  // Modal state for viewing review details
  const [selectedReview, setSelectedReview] = useState(null);

  // Modal state for editing user details
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editUserForm, setEditUserForm] = useState({
    full_name: "",
    email: "",
    username: "",
    is_admin: false,
  });

  // Modal state for adding new user
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [addUserForm, setAddUserForm] = useState({
    full_name: "",
    email: "",
    username: "",
    password: "",
    bio: "",
    is_admin: false,
  });

  // Modal state for editing review
  const [showEditReviewModal, setShowEditReviewModal] = useState(false);
  const [editReviewForm, setEditReviewForm] = useState({
    title: "",
    content: "",
    rating: 5,
    pros: "",
    cons: "",
  });

  // Modal state for gadget management
  const [selectedGadget, setSelectedGadget] = useState(null);
  const [showGadgetModal, setShowGadgetModal] = useState(false);
  const [showAddGadgetModal, setShowAddGadgetModal] = useState(false);
  const [editGadgetForm, setEditGadgetForm] = useState({
    name: "",
    category: "",
    brand: "",
    price: "",
    description: "",
    image_url: "",
    release_date: "",
  });
  const [addGadgetForm, setAddGadgetForm] = useState({
    name: "",
    category: "",
    brand: "",
    price: "",
    description: "",
    image_url: "",
    release_date: "",
  });
  const [addGadgetFormErrors, setAddGadgetFormErrors] = useState({});

  // Logout confirmation state
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Delete confirmation state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteModalData, setDeleteModalData] = useState({
    type: "", // 'user', 'review', 'gadget'
    id: null,
    title: "",
    message: "",
    onConfirm: null,
  });

  // Search and filter states
  const [userSearch, setUserSearch] = useState("");
  const [userFilter, setUserFilter] = useState("all"); // all, admin, regular
  const [userSort, setUserSort] = useState("full_name"); // name, email, created_at, role
  const [userSortOrder, setUserSortOrder] = useState("asc"); // asc, desc

  const [gadgetSearch, setGadgetSearch] = useState("");
  const [gadgetFilter, setGadgetFilter] = useState("all"); // all, smartphones, laptops, tablets, wearables, audio, gaming
  const [gadgetSort, setGadgetSort] = useState("name"); // name, brand, category, price, created_at
  const [gadgetSortOrder, setGadgetSortOrder] = useState("asc"); // asc, desc

  const [reviewSearch, setReviewSearch] = useState("");
  const [reviewFilter, setReviewFilter] = useState("all"); // all, 5, 4, 3, 2, 1 (by rating)
  const [reviewDateFilter, setReviewDateFilter] = useState("all"); // all, today, week, month, year
  const [reviewSort, setReviewSort] = useState("created_at"); // title, user_name, gadget_name, rating, created_at
  const [reviewSortOrder, setReviewSortOrder] = useState("desc"); // asc, desc

  // Calculate stats dynamically from current data
  const calculateStats = () => {
    const totalGadgets = gadgets.length;
    const totalUsers = users.length;
    const totalReviews = reviews.length;

    return {
      totalGadgets,
      totalUsers,
      totalReviews,
    };
  };

  // Helper function to sort array by field
  const sortData = (data, sortField, sortOrder) => {
    return [...data].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle nested object properties (e.g., user.username)
      if (sortField.includes(".")) {
        const fields = sortField.split(".");
        aValue = fields.reduce((obj, field) => obj?.[field], a);
        bValue = fields.reduce((obj, field) => obj?.[field], b);
      }

      // Handle null/undefined values
      if (!aValue && !bValue) return 0;
      if (!aValue) return sortOrder === "asc" ? -1 : 1;
      if (!bValue) return sortOrder === "asc" ? 1 : -1;

      // Handle different data types
      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };

  // Handle sort column click
  const handleSort = (section, field) => {
    if (section === "users") {
      if (userSort === field) {
        setUserSortOrder(userSortOrder === "asc" ? "desc" : "asc");
      } else {
        setUserSort(field);
        setUserSortOrder("asc");
      }
    } else if (section === "gadgets") {
      if (gadgetSort === field) {
        setGadgetSortOrder(gadgetSortOrder === "asc" ? "desc" : "asc");
      } else {
        setGadgetSort(field);
        setGadgetSortOrder("asc");
      }
    } else if (section === "reviews") {
      if (reviewSort === field) {
        setReviewSortOrder(reviewSortOrder === "asc" ? "desc" : "asc");
      } else {
        setReviewSort(field);
        setReviewSortOrder("asc");
      }
    }
  };

  // Helper function to render sort icon
  const renderSortIcon = (section, field) => {
    let currentSort, currentOrder;

    if (section === "users") {
      currentSort = userSort;
      currentOrder = userSortOrder;
    } else if (section === "gadgets") {
      currentSort = gadgetSort;
      currentOrder = gadgetSortOrder;
    } else if (section === "reviews") {
      currentSort = reviewSort;
      currentOrder = reviewSortOrder;
    }

    if (currentSort !== field) {
      return (
        <svg
          className="h-4 w-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 9l4-4 4 4m0 6l-4 4-4-4"
          />
        </svg>
      );
    }

    return currentOrder === "asc" ? (
      <svg
        className="h-4 w-4 text-indigo-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    ) : (
      <svg
        className="h-4 w-4 text-indigo-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    );
  };

  // Filter and search functions
  const filteredUsers = (() => {
    const filtered = users.filter((user) => {
      const matchesSearch =
        userSearch === "" ||
        user.username?.toLowerCase().includes(userSearch.toLowerCase()) ||
        user.full_name?.toLowerCase().includes(userSearch.toLowerCase()) ||
        user.email?.toLowerCase().includes(userSearch.toLowerCase());

      const matchesFilter =
        userFilter === "all" ||
        (userFilter === "admin" && user.is_admin) ||
        (userFilter === "regular" && !user.is_admin);

      return matchesSearch && matchesFilter;
    });

    return sortData(
      filtered,
      userSort === "role" ? "is_admin" : userSort,
      userSortOrder
    );
  })();

  const filteredGadgets = (() => {
    const filtered = gadgets.filter((gadget) => {
      const matchesSearch =
        gadgetSearch === "" ||
        gadget.name?.toLowerCase().includes(gadgetSearch.toLowerCase()) ||
        gadget.brand?.toLowerCase().includes(gadgetSearch.toLowerCase()) ||
        gadget.description?.toLowerCase().includes(gadgetSearch.toLowerCase());

      const matchesFilter =
        gadgetFilter === "all" ||
        gadget.category?.toLowerCase() === gadgetFilter.toLowerCase();

      return matchesSearch && matchesFilter;
    });

    return sortData(filtered, gadgetSort, gadgetSortOrder);
  })();

  const filteredReviews = (() => {
    const filtered = reviews.filter((review) => {
      const matchesSearch =
        reviewSearch === "" ||
        review.title?.toLowerCase().includes(reviewSearch.toLowerCase()) ||
        review.content?.toLowerCase().includes(reviewSearch.toLowerCase()) ||
        review.user_name?.toLowerCase().includes(reviewSearch.toLowerCase()) ||
        review.gadget?.name?.toLowerCase().includes(reviewSearch.toLowerCase());

      const matchesRating =
        reviewFilter === "all" || review.rating === parseInt(reviewFilter);

      // Date filter
      const matchesDate =
        reviewDateFilter === "all" ||
        (() => {
          if (!review.created_at) return true;

          const reviewDate = new Date(review.created_at);
          const now = new Date();
          const today = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          );

          switch (reviewDateFilter) {
            case "today":
              return reviewDate >= today;
            case "week":
              const weekAgo = new Date(today);
              weekAgo.setDate(weekAgo.getDate() - 7);
              return reviewDate >= weekAgo;
            case "month":
              const monthAgo = new Date(today);
              monthAgo.setMonth(monthAgo.getMonth() - 1);
              return reviewDate >= monthAgo;
            case "year":
              const yearAgo = new Date(today);
              yearAgo.setFullYear(yearAgo.getFullYear() - 1);
              return reviewDate >= yearAgo;
            default:
              return true;
          }
        })();

      return matchesSearch && matchesRating && matchesDate;
    });

    // Use user_name for sorting if sort field is user_name
    const sortField =
      reviewSort === "user_name"
        ? "user_name"
        : reviewSort === "gadget_name"
        ? "gadget.name"
        : reviewSort;
    return sortData(filtered, sortField, reviewSortOrder);
  })();

  // Clear search and filters
  const clearUserFilters = () => {
    setUserSearch("");
    setUserFilter("all");
    setUserSort("name");
    setUserSortOrder("asc");
  };

  const clearGadgetFilters = () => {
    setGadgetSearch("");
    setGadgetFilter("all");
    setGadgetSort("name");
    setGadgetSortOrder("asc");
  };

  const clearReviewFilters = () => {
    setReviewSearch("");
    setReviewFilter("all");
    setReviewDateFilter("all");
    setReviewSort("created_at");
    setReviewSortOrder("desc");
  };

  // Helper function to show success alerts
  const showSuccessAlert = (message) => {
    setAlert({ show: true, type: "success", message });
  };

  // Helper function to show error alerts
  const showErrorAlert = (message) => {
    setAlert({ show: true, type: "error", message });
  };

  // Helper function to show delete confirmation modal
  const showDeleteConfirmation = (type, id, title, message, onConfirm) => {
    setDeleteModalData({ type, id, title, message, onConfirm });
    setShowDeleteModal(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (deleteModalData.onConfirm) {
      deleteModalData.onConfirm();
    }
    setShowDeleteModal(false);
  };

  // Handle delete cancel
  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  // Validate Add Gadget Form
  const validateAddGadgetForm = () => {
    const errors = {};

    if (!addGadgetForm.name.trim()) {
      errors.name = "Name is required";
    }

    if (!addGadgetForm.category) {
      errors.category = "Category is required";
    }

    if (!addGadgetForm.brand.trim()) {
      errors.brand = "Brand is required";
    }

    if (!addGadgetForm.price || parseFloat(addGadgetForm.price) <= 0) {
      errors.price = "Valid price is required";
    }

    if (!addGadgetForm.description.trim()) {
      errors.description = "Description is required";
    }

    if (!addGadgetForm.image_url.trim()) {
      errors.image_url = "Image URL is required";
    } else {
      // Basic URL validation
      try {
        new URL(addGadgetForm.image_url);
      } catch {
        errors.image_url = "Valid image URL is required";
      }
    }

    if (!addGadgetForm.release_date) {
      errors.release_date = "Release date is required";
    }

    setAddGadgetFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Check if Add Gadget form is valid (for button disable)
  const isAddGadgetFormValid = () => {
    return (
      addGadgetForm.name.trim() &&
      addGadgetForm.category &&
      addGadgetForm.brand.trim() &&
      addGadgetForm.price &&
      parseFloat(addGadgetForm.price) > 0 &&
      addGadgetForm.description.trim() &&
      addGadgetForm.image_url.trim() &&
      addGadgetForm.release_date
    );
  };

  // API Functions
  const fetchDashboardStats = async () => {
    try {
      setDataLoading(true);
      setError("");
      const data = await adminAPI.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      setError("Failed to load dashboard statistics");
      setStats({
        totalGadgets: 0,
        totalUsers: 0,
        totalReviews: 0,
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
      console.error("Error fetching users:", error);
      setError("Failed to load users");
      setUsers([]);
    } finally {
      setDataLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setDataLoading(true);
      console.log("🔄 AdminDashboard - Fetching reviews...");

      const data = await adminAPI.getReviews({ pageSize: 50 });
      const reviewsData = data.reviews || data || [];

      console.log(
        "✅ AdminDashboard - Reviews fetched:",
        reviewsData.length,
        "reviews"
      );
      console.log("📋 AdminDashboard - Review data:", reviewsData);

      // Sort reviews by creation date (newest first) - basic sort for initial load
      const sortedReviews = [...reviewsData].sort((a, b) => {
        const dateA = new Date(a.created_at || a.date || 0);
        const dateB = new Date(b.created_at || b.date || 0);
        return dateB - dateA; // Newest first
      });
      setReviews(sortedReviews);

      console.log("✅ AdminDashboard - Reviews sorted and set to state");
    } catch (error) {
      console.error("❌ AdminDashboard - Error fetching reviews:", error);
      setError("Failed to load reviews");
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
      console.error("Error fetching gadgets:", error);
      setError("Failed to load gadgets");
      setGadgets([]);
    } finally {
      setDataLoading(false);
    }
  };

  // User CRUD handlers
  const handleAddUser = () => {
    setAddUserForm({
      full_name: "",
      email: "",
      username: "",
      password: "",
      is_admin: false,
    });
    setShowAddUserModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditUserForm({
      full_name: user.full_name || "",
      email: user.email || "",
      username: user.username || "",
      is_admin: user.is_admin || false,
    });
    setShowUserModal(true);
  };

  const handleSaveNewUser = async () => {
    try {
      // Validate required fields
      if (!addUserForm.full_name || !addUserForm.full_name.trim()) {
        showErrorAlert("Full name is required");
        return;
      }

      if (!addUserForm.email || !addUserForm.email.trim()) {
        showErrorAlert("Email is required");
        return;
      }

      if (!addUserForm.username || !addUserForm.username.trim()) {
        showErrorAlert("Username is required");
        return;
      }

      if (!addUserForm.password || !addUserForm.password.trim()) {
        showErrorAlert("Password is required");
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(addUserForm.email)) {
        showErrorAlert("Please enter a valid email address");
        return;
      }

      // Validate password strength
      if (addUserForm.password.length < 6) {
        showErrorAlert("Password must be at least 6 characters long");
        return;
      }

      setDataLoading(true);
      const response = await adminAPI.createUser(addUserForm);
      setUsers([...users, response]);
      setShowAddUserModal(false);
      showSuccessAlert("User created successfully!");

      // Reset form
      setAddUserForm({
        full_name: "",
        email: "",
        username: "",
        password: "",
        bio: "",
        is_admin: false,
      });

      // Refresh stats
      const calculatedStats = calculateStats();
      setStats(calculatedStats);
    } catch (error) {
      console.error("❌ Error creating user:", error);
      showErrorAlert(
        "Failed to create user: " + (error.message || "Unknown error")
      );
    } finally {
      setDataLoading(false);
    }
  };

  const handleSaveUser = async () => {
    try {
      setDataLoading(true);
      const response = await adminAPI.updateUser(selectedUser.id, editUserForm);
      setUsers(
        users.map((user) => (user.id === selectedUser.id ? response : user))
      );
      setShowUserModal(false);
      showSuccessAlert("User updated successfully!");
    } catch (error) {
      console.error("❌ Error updating user:", error);
      showErrorAlert(
        "Failed to update user: " + (error.message || "Unknown error")
      );
    } finally {
      setDataLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    const performDelete = async () => {
      try {
        setDataLoading(true);
        await adminAPI.deleteUser(userId);
        setUsers(users.filter((user) => user.id !== userId));
        showSuccessAlert("User deleted successfully!");

        // Refresh stats
        const calculatedStats = calculateStats();
        setStats(calculatedStats);
      } catch (error) {
        console.error("❌ Error deleting user:", error);
        showErrorAlert(
          "Failed to delete user: " + (error.message || "Unknown error")
        );
      } finally {
        setDataLoading(false);
      }
    };

    showDeleteConfirmation(
      "user",
      userId,
      "Delete User",
      "Are you sure you want to delete this user? This action cannot be undone.",
      performDelete
    );
  };

  // Review CRUD handlers
  const handleEditReview = (review) => {
    setSelectedReview(review);
    setEditReviewForm({
      title: review.title || "",
      content: review.content || review.comment || "",
      rating: review.rating || 5,
      pros: review.pros || "",
      cons: review.cons || "",
    });
    setShowEditReviewModal(true);
  };

  const handleSaveReview = async () => {
    try {
      setDataLoading(true);
      const response = await adminAPI.updateReview(
        selectedReview.id,
        editReviewForm
      );

      // Update the review in the list
      const updatedReviews = reviews.map((review) =>
        review.id === selectedReview.id ? response : review
      );

      setReviews(updatedReviews);
      setShowEditReviewModal(false);
      showSuccessAlert("Review updated successfully!");
    } catch (error) {
      console.error("❌ Error updating review:", error);
      showErrorAlert(
        "Failed to update review: " + (error.message || "Unknown error")
      );
    } finally {
      setDataLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const performDelete = async () => {
      try {
        setDataLoading(true);
        await adminAPI.deleteReview(reviewId);

        // Filter out the deleted review (sorting is maintained as it's a filter operation)
        setReviews(reviews.filter((review) => review.id !== reviewId));
        showSuccessAlert("Review deleted successfully!");

        // Refresh stats
        const calculatedStats = calculateStats();
        setStats(calculatedStats);
      } catch (error) {
        console.error("❌ Error deleting review:", error);
        showErrorAlert(
          "Failed to delete review: " + (error.message || "Unknown error")
        );
      } finally {
        setDataLoading(false);
      }
    };

    showDeleteConfirmation(
      "review",
      reviewId,
      "Delete Review",
      "Are you sure you want to delete this review? This action cannot be undone.",
      performDelete
    );
  };

  // Gadget CRUD handlers
  const handleAddGadget = () => {
    setAddGadgetForm({
      name: "",
      category: "",
      brand: "",
      price: "",
      description: "",
      image_url: "",
      release_date: "",
    });
    setShowAddGadgetModal(true);
  };

  const handleEditGadget = (gadget) => {
    setSelectedGadget(gadget);
    setEditGadgetForm({
      name: gadget.name || "",
      category: gadget.category || "",
      brand: gadget.brand || "",
      price: gadget.price || "",
      description: gadget.description || "",
      image_url: gadget.image_url || "",
      release_date: gadget.release_date
        ? gadget.release_date.split("T")[0]
        : "",
    });
    setShowGadgetModal(true);
  };

  const handleSaveNewGadget = async () => {
    // Validate form first
    if (!validateAddGadgetForm()) {
      showErrorAlert("Please fill in all required fields correctly");
      return;
    }

    try {
      setDataLoading(true);

      // Convert release_date to proper datetime format
      let releaseDatetime;
      if (addGadgetForm.release_date) {
        // Convert YYYY-MM-DD to YYYY-MM-DDTHH:MM:SSZ format
        releaseDatetime = new Date(
          addGadgetForm.release_date + "T00:00:00Z"
        ).toISOString();
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

      console.log("🚀 Sending gadget data:", gadgetData);
      const response = await adminAPI.createGadget(gadgetData);
      setGadgets([...gadgets, response]);
      setShowAddGadgetModal(false);
      showSuccessAlert("Gadget created successfully!");

      // Refresh stats
      const calculatedStats = calculateStats();
      setStats(calculatedStats);
    } catch (error) {
      console.error("❌ Error creating gadget:", error);
      showErrorAlert(
        "Failed to create gadget: " + (error.message || "Unknown error")
      );
    } finally {
      setDataLoading(false);
    }
  };

  const handleSaveGadget = async () => {
    try {
      setDataLoading(true);

      // Validate price is not negative
      const price = parseFloat(editGadgetForm.price);
      if (isNaN(price) || price < 0) {
        showErrorAlert("Price must be a valid positive number");
        setDataLoading(false);
        return;
      }

      // Convert release_date to proper datetime format
      let releaseDatetime;
      if (editGadgetForm.release_date) {
        // Convert YYYY-MM-DD to YYYY-MM-DDTHH:MM:SSZ format
        releaseDatetime = new Date(
          editGadgetForm.release_date + "T00:00:00Z"
        ).toISOString();
      } else {
        releaseDatetime = new Date().toISOString();
      }

      const gadgetData = {
        name: editGadgetForm.name,
        brand: editGadgetForm.brand,
        category: editGadgetForm.category,
        description: editGadgetForm.description,
        price: price,
        image_url: editGadgetForm.image_url || null,
        release_date: releaseDatetime,
      };

      const response = await adminAPI.updateGadget(
        selectedGadget.id,
        gadgetData
      );
      setGadgets(
        gadgets.map((gadget) =>
          gadget.id === selectedGadget.id ? response : gadget
        )
      );
      setShowGadgetModal(false);
      showSuccessAlert("Gadget updated successfully!");
    } catch (error) {
      console.error("❌ Error updating gadget:", error);
      showErrorAlert(
        "Failed to update gadget: " + (error.message || "Unknown error")
      );
    } finally {
      setDataLoading(false);
    }
  };

  const handleDeleteGadget = async (gadgetId) => {
    const performDelete = async () => {
      try {
        setDataLoading(true);
        await adminAPI.deleteGadget(gadgetId);
        setGadgets(gadgets.filter((gadget) => gadget.id !== gadgetId));
        showSuccessAlert("Gadget deleted successfully!");

        // Refresh stats
        const calculatedStats = calculateStats();
        setStats(calculatedStats);
      } catch (error) {
        console.error("❌ Error deleting gadget:", error);
        showErrorAlert(
          "Failed to delete gadget: " + (error.message || "Unknown error")
        );
      } finally {
        setDataLoading(false);
      }
    };

    showDeleteConfirmation(
      "gadget",
      gadgetId,
      "Delete Gadget",
      "Are you sure you want to delete this gadget? This action cannot be undone and will also delete all associated reviews.",
      performDelete
    );
  };

  // Modal handlers
  const closeAddUserModal = () => {
    setShowAddUserModal(false);
    setAddUserForm({
      full_name: "",
      email: "",
      username: "",
      password: "",
      bio: "",
      is_admin: false,
    });
  };

  const closeUserModal = () => {
    setSelectedUser(null);
    setShowUserModal(false);
    setEditUserForm({
      full_name: "",
      email: "",
      username: "",
      is_admin: false,
    });
  };

  const closeEditReviewModal = () => {
    setSelectedReview(null);
    setShowEditReviewModal(false);
    setEditReviewForm({
      title: "",
      content: "",
      rating: 5,
      pros: "",
      cons: "",
    });
  };

  const closeAddGadgetModal = () => {
    setShowAddGadgetModal(false);
    setAddGadgetForm({
      name: "",
      category: "",
      brand: "",
      price: "",
      description: "",
      image_url: "",
      release_date: "",
    });
    setAddGadgetFormErrors({});
  };

  const closeGadgetModal = () => {
    setSelectedGadget(null);
    setShowGadgetModal(false);
    setEditGadgetForm({
      name: "",
      category: "",
      brand: "",
      price: "",
      description: "",
      image_url: "",
      release_date: "",
    });
  };

  // Handle logout with confirmation
  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    authUtils.removeToken();
    authUtils.clearUserInfo();
    localStorage.removeItem("isAuthenticated");
    console.log("🔓 Admin logged out at:", new Date().toISOString());
    window.location.href = "/login";
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Function to fetch current admin information
  const fetchCurrentAdminInfo = async () => {
    try {
      console.log("🔄 AdminDashboard - Fetching current admin info...");

      // Get admin info from localStorage first
      const userInfo = authUtils.getUserInfo();
      if (userInfo) {
        setCurrentAdmin({
          id: userInfo.id,
          username: userInfo.username,
          email: userInfo.email,
          full_name: userInfo.full_name,
          profile_photo: userInfo.profile_photo,
          last_login:
            localStorage.getItem("adminLastLogin") || new Date().toISOString(),
        });
        console.log("✅ AdminDashboard - Admin info loaded:", userInfo);
      }

      // Optionally fetch fresh data from API
      try {
        const freshUserInfo = await authAPI.getCurrentUser();
        if (freshUserInfo && freshUserInfo.is_admin) {
          setCurrentAdmin({
            id: freshUserInfo.id,
            username: freshUserInfo.username,
            email: freshUserInfo.email,
            full_name: freshUserInfo.full_name,
            profile_photo: freshUserInfo.profile_photo,
            last_login:
              localStorage.getItem("adminLastLogin") ||
              new Date().toISOString(),
          });
          console.log(
            "✅ AdminDashboard - Fresh admin info loaded:",
            freshUserInfo
          );
        }
      } catch (apiError) {
        console.log(
          "⚠️ AdminDashboard - Could not fetch fresh admin info, using cached data"
        );
      }
    } catch (error) {
      console.error("❌ AdminDashboard - Error fetching admin info:", error);
      // Fallback to basic info from localStorage
      const userInfo = authUtils.getUserInfo();
      if (userInfo) {
        setCurrentAdmin({
          id: userInfo.id,
          username: userInfo.username || userInfo.email,
          email: userInfo.email,
          full_name: userInfo.full_name || "Admin User",
          profile_photo: null,
          last_login:
            localStorage.getItem("adminLastLogin") || new Date().toISOString(),
        });
      }
    }
  };

  // Helper function to get admin profile photo URL
  const getAdminProfilePhotoUrl = (photoPath) => {
    if (!photoPath) return null;
    if (photoPath.startsWith("http")) return photoPath; // Already full URL
    return `http://localhost:8000${photoPath}`; // Add API base URL
  };

  // Helper function to get admin display name
  const getAdminDisplayName = () => {
    if (!currentAdmin) return "Admin";
    return (
      currentAdmin.full_name ||
      currentAdmin.username ||
      currentAdmin.email ||
      "Admin"
    );
  };

  // Helper function to get admin initials
  const getAdminInitials = () => {
    if (!currentAdmin) return "A";

    if (currentAdmin.full_name) {
      const names = currentAdmin.full_name.split(" ");
      if (names.length >= 2) {
        return (names[0][0] + names[1][0]).toUpperCase();
      }
      return currentAdmin.full_name[0].toUpperCase();
    }

    if (currentAdmin.username) {
      return currentAdmin.username[0].toUpperCase();
    }

    if (currentAdmin.email) {
      return currentAdmin.email[0].toUpperCase();
    }

    return "A";
  };

  // Helper function to format last login time
  const formatLastLogin = () => {
    if (!currentAdmin?.last_login) return "Recently";

    try {
      const loginDate = new Date(currentAdmin.last_login);
      const now = new Date();
      const diffMs = now - loginDate;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;

      return loginDate.toLocaleDateString();
    } catch (error) {
      return "Recently";
    }
  };

  // Check if user is admin and fetch data
  useEffect(() => {
    const fetchAllData = async () => {
      await Promise.all([
        fetchDashboardStats(),
        fetchUsers(),
        fetchReviews(),
        fetchGadgets(),
      ]);
    };

    const checkAdminAccess = async () => {
      try {
        setIsLoading(true);

        console.log("🔍 AdminDashboard - Checking admin access...");
        console.log(
          "🔍 AdminDashboard - authUtils.isAuthenticated():",
          authUtils.isAuthenticated()
        );
        console.log(
          "🔍 AdminDashboard - authUtils.isAdmin():",
          authUtils.isAdmin()
        );
        console.log(
          "🔍 AdminDashboard - localStorage userInfo:",
          localStorage.getItem("userInfo")
        );
        console.log(
          "🔍 AdminDashboard - localStorage user_is_admin:",
          localStorage.getItem("user_is_admin")
        );

        if (!authUtils.isAuthenticated()) {
          console.log("❌ AdminDashboard - User not authenticated");
          setIsAuthorized(false);
          return;
        }

        if (!authUtils.isAdmin()) {
          console.log("❌ AdminDashboard - User not admin");
          setIsAuthorized(false);
          return;
        }

        console.log("✅ AdminDashboard - Admin access granted");
        setIsAuthorized(true);

        // Get current admin info
        await fetchCurrentAdminInfo();
        await fetchAllData();
      } catch (error) {
        console.error(
          "❌ AdminDashboard - Error checking admin access:",
          error
        );
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAccess();
  }, []);

  // Listen for new reviews being submitted to refresh the review list
  useEffect(() => {
    const handleNewReview = async (event) => {
      console.log("🔄 AdminDashboard - New review submitted event received");
      console.log("📋 AdminDashboard - Event detail:", event.detail);

      try {
        // If event contains the new review data, add it directly to state as fallback
        if (event.detail && event.detail.review) {
          const newReview = event.detail.review;
          console.log(
            "📝 AdminDashboard - Adding new review to state:",
            newReview
          );

          // Add the new review to the beginning of the list (newest first)
          setReviews((prevReviews) => {
            // Check if review already exists to prevent duplicates
            const exists = prevReviews.some((r) => r.id === newReview.id);
            if (exists) {
              console.log(
                "⚠️ AdminDashboard - Review already exists, skipping"
              );
              return prevReviews;
            }

            return [newReview, ...prevReviews];
          });
        }

        // Refresh reviews from backend to ensure consistency
        console.log(
          "🔄 AdminDashboard - Refreshing review list from backend..."
        );
        await fetchReviews();

        // Also refresh stats since total review count might have changed
        const updatedStats = calculateStats();
        setStats(updatedStats);

        console.log("✅ AdminDashboard - Review list refreshed successfully");
      } catch (error) {
        console.error(
          "❌ AdminDashboard - Failed to refresh review list:",
          error
        );
      }
    };

    // Listen for review submission events
    window.addEventListener("reviewSubmitted", handleNewReview);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("reviewSubmitted", handleNewReview);
    };
  }, [fetchReviews, calculateStats]);

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
                <svg
                  className="h-8 w-8 text-purple-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Admin Dashboard
                </h1>
                <p className="text-indigo-200 text-sm">
                  WiseTech Platform Management
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Admin Profile Info */}
              {currentAdmin && (
                <div className="flex items-center space-x-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg px-4 py-2">
                  {/* Profile Photo */}
                  <div className="flex-shrink-0">
                    {getAdminProfilePhotoUrl(currentAdmin.profile_photo) ? (
                      <img
                        className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-md"
                        src={getAdminProfilePhotoUrl(
                          currentAdmin.profile_photo
                        )}
                        alt={getAdminDisplayName()}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className={`h-10 w-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white font-semibold text-sm border-2 border-white shadow-md ${
                        getAdminProfilePhotoUrl(currentAdmin.profile_photo)
                          ? "hidden"
                          : "flex"
                      }`}
                    >
                      {getAdminInitials()}
                    </div>
                  </div>

                  {/* Admin Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {getAdminDisplayName()}
                    </p>
                    <p className="text-xs text-indigo-200 truncate">
                      Last login: {formatLastLogin()}
                    </p>
                  </div>
                </div>
              )}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2"
              >
                <svg
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span>Logout</span>
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
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
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
            {["overview", "users", "gadgets", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
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
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Welcome Section */}
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-xl shadow-lg p-8">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {currentAdmin
                      ? `Welcome back, ${getAdminDisplayName()}!`
                      : "Welcome to WiseTech Admin Dashboard"}
                  </h2>
                  <p className="text-blue-100 text-lg">
                    {currentAdmin
                      ? "Manage your platform with powerful tools and insights"
                      : "Loading admin information..."}
                  </p>
                  {currentAdmin && (
                    <div className="mt-4 flex items-center justify-center space-x-4 text-blue-100 text-sm">
                      <div className="flex items-center space-x-1">
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Last login: {formatLastLogin()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <span>{currentAdmin.email}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Cards */}
              <div className="flex justify-center">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl">
                  {/* Total Users Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="bg-blue-500 rounded-lg p-4">
                            <svg
                              className="h-8 w-8 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-6 flex-1">
                          <dl>
                            <dt className="text-sm font-semibold text-blue-600 truncate">
                              Total Users
                            </dt>
                            <dd className="text-2xl font-bold text-blue-800 mt-1">
                              {stats.totalUsers || 0}
                            </dd>
                            <dt className="text-xs text-blue-500 mt-1">
                              Active members
                            </dt>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Total Reviews Card */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="bg-green-500 rounded-lg p-4">
                            <svg
                              className="h-8 w-8 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-6 flex-1">
                          <dl>
                            <dt className="text-sm font-semibold text-green-600 truncate">
                              Total Reviews
                            </dt>
                            <dd className="text-2xl font-bold text-green-800 mt-1">
                              {stats.totalReviews || 0}
                            </dd>
                            <dt className="text-xs text-green-500 mt-1">
                              User feedback
                            </dt>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Total Gadgets Card */}
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="bg-purple-500 rounded-lg p-4">
                            <svg
                              className="h-8 w-8 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-6 flex-1">
                          <dl>
                            <dt className="text-sm font-semibold text-purple-600 truncate">
                              Total Gadgets
                            </dt>
                            <dd className="text-2xl font-bold text-purple-800 mt-1">
                              {stats.totalGadgets || 0}
                            </dd>
                            <dt className="text-xs text-purple-500 mt-1">
                              Available products
                            </dt>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <svg
                      className="h-5 w-5 text-indigo-600 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Quick Actions
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Perform common administrative tasks quickly
                  </p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Add User Button */}
                    <button
                      onClick={handleAddUser}
                      className="group flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg hover:from-blue-100 hover:to-blue-200 hover:border-blue-300 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="bg-blue-500 rounded-full p-3 mb-3 group-hover:bg-blue-600 transition-colors">
                        <svg
                          className="h-6 w-6 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-blue-700 group-hover:text-blue-800">
                        Add User
                      </span>
                    </button>

                    {/* Add Gadget Button */}
                    <button
                      onClick={() => setShowAddGadgetModal(true)}
                      className="group flex flex-col items-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg hover:from-purple-100 hover:to-purple-200 hover:border-purple-300 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="bg-purple-500 rounded-full p-3 mb-3 group-hover:bg-purple-600 transition-colors">
                        <svg
                          className="h-6 w-6 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-purple-700 group-hover:text-purple-800">
                        Add Gadget
                      </span>
                    </button>

                    {/* Manage Users Button */}
                    <button
                      onClick={() => setActiveTab("users")}
                      className="group flex flex-col items-center p-4 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg hover:from-green-100 hover:to-green-200 hover:border-green-300 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="bg-green-500 rounded-full p-3 mb-3 group-hover:bg-green-600 transition-colors">
                        <svg
                          className="h-6 w-6 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-green-700 group-hover:text-green-800">
                        Manage Users
                      </span>
                    </button>

                    {/* Manage Reviews Button */}
                    <button
                      onClick={() => setActiveTab("reviews")}
                      className="group flex flex-col items-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg hover:from-orange-100 hover:to-orange-200 hover:border-orange-300 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="bg-orange-500 rounded-full p-3 mb-3 group-hover:bg-orange-600 transition-colors">
                        <svg
                          className="h-6 w-6 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-orange-700 group-hover:text-orange-800">
                        Manage Reviews
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* System Status */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <svg
                      className="h-5 w-5 text-indigo-600 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    System Status
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                        <svg
                          className="w-6 h-6 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        Database
                      </p>
                      <p className="text-xs text-green-600 mt-1">Online</p>
                    </div>
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                        <svg
                          className="w-6 h-6 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        API Server
                      </p>
                      <p className="text-xs text-green-600 mt-1">Running</p>
                    </div>
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                        <svg
                          className="w-6 h-6 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        File Storage
                      </p>
                      <p className="text-xs text-green-600 mt-1">Available</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="sm:flex sm:items-center">
                  <div className="sm:flex-auto">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      All Users
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      A list of all the users in your account including their
                      name, email, and role.
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

                {/* Search and Filter Controls */}
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
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
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <select
                      value={userFilter}
                      onChange={(e) => setUserFilter(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="all">All Users</option>
                      <option value="admin">Admins</option>
                      <option value="regular">Regular Users</option>
                    </select>
                  </div>

                  {/* Results Count */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {filteredUsers.length} of {users.length} users
                    </span>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={clearUserFilters}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Clear Filters
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
                              <th
                                scope="col"
                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort("users", "full_name")}
                              >
                                <div className="flex items-center space-x-1">
                                  <span>Name & Username</span>
                                  {renderSortIcon("users", "full_name")}
                                </div>
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort("users", "email")}
                              >
                                <div className="flex items-center space-x-1">
                                  <span>Email</span>
                                  {renderSortIcon("users", "email")}
                                </div>
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort("users", "role")}
                              >
                                <div className="flex items-center space-x-1">
                                  <span>Role</span>
                                  {renderSortIcon("users", "role")}
                                </div>
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                                onClick={() =>
                                  handleSort("users", "created_at")
                                }
                              >
                                <div className="flex items-center space-x-1">
                                  <span>Joined</span>
                                  {renderSortIcon("users", "created_at")}
                                </div>
                              </th>
                              <th
                                scope="col"
                                className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                              >
                                <span className="sr-only">Actions</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {filteredUsers.map((user) => (
                              <tr key={user.id}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {user.full_name || user.username || "N/A"}
                                    </span>
                                    {user.full_name && user.username && (
                                      <span className="text-sm text-gray-500">
                                        {user.username}
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  {user.email}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      user.is_admin
                                        ? "bg-purple-100 text-purple-800"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {user.is_admin ? "Admin" : "User"}
                                  </span>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  {new Date(
                                    user.joined_date
                                  ).toLocaleDateString()}
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
          {activeTab === "gadgets" && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="sm:flex sm:items-center">
                  <div className="sm:flex-auto">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      All Gadgets
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      A list of all the gadgets in your platform including their
                      details and specifications.
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

                {/* Search and Filter Controls */}
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
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
                    <input
                      type="text"
                      placeholder="Search gadgets..."
                      value={gadgetSearch}
                      onChange={(e) => setGadgetSearch(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <select
                      value={gadgetFilter}
                      onChange={(e) => setGadgetFilter(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="all">All Categories</option>
                      <option value="smartphones">Smartphones</option>
                      <option value="laptops">Laptops</option>
                      <option value="tablets">Tablets</option>
                      <option value="wearables">Wearables</option>
                      <option value="audio">Audio</option>
                      <option value="gaming">Gaming</option>
                    </select>
                  </div>

                  {/* Results Count */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {filteredGadgets.length} of {gadgets.length} gadgets
                    </span>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={clearGadgetFilters}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Clear Filters
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
                              <th
                                scope="col"
                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort("gadgets", "name")}
                              >
                                <div className="flex items-center space-x-1">
                                  <span>Name</span>
                                  {renderSortIcon("gadgets", "name")}
                                </div>
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                                onClick={() =>
                                  handleSort("gadgets", "category")
                                }
                              >
                                <div className="flex items-center space-x-1">
                                  <span>Category</span>
                                  {renderSortIcon("gadgets", "category")}
                                </div>
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort("gadgets", "brand")}
                              >
                                <div className="flex items-center space-x-1">
                                  <span>Brand</span>
                                  {renderSortIcon("gadgets", "brand")}
                                </div>
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort("gadgets", "price")}
                              >
                                <div className="flex items-center space-x-1">
                                  <span>Price</span>
                                  {renderSortIcon("gadgets", "price")}
                                </div>
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                                onClick={() =>
                                  handleSort("gadgets", "created_at")
                                }
                              >
                                <div className="flex items-center space-x-1">
                                  <span>Created</span>
                                  {renderSortIcon("gadgets", "created_at")}
                                </div>
                              </th>
                              <th
                                scope="col"
                                className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                              >
                                <span className="sr-only">Actions</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {filteredGadgets.map((gadget) => (
                              <tr key={gadget.id}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                  {gadget.name}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  {gadget.category}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  {gadget.brand}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  $
                                  {gadget.price
                                    ? parseFloat(gadget.price).toLocaleString()
                                    : "N/A"}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  {new Date(
                                    gadget.created_at || Date.now()
                                  ).toLocaleDateString()}
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
                                      onClick={() =>
                                        handleDeleteGadget(gadget.id)
                                      }
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
          {activeTab === "reviews" && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="sm:flex sm:items-center">
                  <div className="sm:flex-auto">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      All Reviews
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      A list of all the reviews submitted by users.
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                      type="button"
                      onClick={fetchReviews}
                      disabled={dataLoading}
                      className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                      {dataLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Refreshing...
                        </>
                      ) : (
                        <>
                          <svg
                            className="-ml-1 mr-2 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                          Refresh Reviews
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Search and Filter Controls */}
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
                  <div className="relative lg:col-span-2">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
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
                    <input
                      type="text"
                      placeholder="Search reviews..."
                      value={reviewSearch}
                      onChange={(e) => setReviewSearch(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <select
                      value={reviewFilter}
                      onChange={(e) => setReviewFilter(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="all">All Ratings</option>
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                  </div>

                  <div>
                    <select
                      value={reviewDateFilter}
                      onChange={(e) => setReviewDateFilter(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="year">This Year</option>
                    </select>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={clearReviewFilters}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>

                {/* Results Count */}
                <div className="mt-4">
                  <span className="text-sm text-gray-500">
                    {filteredReviews.length} of {reviews.length} reviews
                  </span>
                </div>
                <div className="mt-8 flex flex-col">
                  <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 cursor-pointer hover:bg-gray-100"
                                onClick={() =>
                                  handleSort("reviews", "user_name")
                                }
                              >
                                <div className="flex items-center space-x-1">
                                  <span>User & Username</span>
                                  {renderSortIcon("reviews", "user_name")}
                                </div>
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                                onClick={() =>
                                  handleSort("reviews", "gadget_name")
                                }
                              >
                                <div className="flex items-center space-x-1">
                                  <span>Gadget</span>
                                  {renderSortIcon("reviews", "gadget_name")}
                                </div>
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort("reviews", "rating")}
                              >
                                <div className="flex items-center space-x-1">
                                  <span>Rating</span>
                                  {renderSortIcon("reviews", "rating")}
                                </div>
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                                onClick={() =>
                                  handleSort("reviews", "created_at")
                                }
                              >
                                <div className="flex items-center space-x-1">
                                  <span>Date</span>
                                  {renderSortIcon("reviews", "created_at")}
                                </div>
                              </th>
                              <th
                                scope="col"
                                className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                              >
                                <span className="sr-only">Actions</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {filteredReviews.map((review) => (
                              <tr key={review.id}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {review.user?.full_name ||
                                        review.user_name ||
                                        review.user?.username ||
                                        "Unknown User"}
                                    </span>
                                    {(review.user?.username ||
                                      review.user_name) && (
                                      <span className="text-sm text-gray-500">
                                        {review.user?.username ||
                                          review.user_name}
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  {review.gadget_name ||
                                    review.gadget?.name ||
                                    "Unknown Gadget"}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <svg
                                        key={i}
                                        className={`h-4 w-4 ${
                                          i < Math.floor(review.rating)
                                            ? "text-yellow-400"
                                            : "text-gray-200"
                                        }`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                    ))}
                                    <span className="ml-2 text-sm text-gray-500">
                                      {review.rating}
                                    </span>
                                  </div>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                  <div className="flex flex-col">
                                    <span>
                                      {new Date(
                                        review.created_at || review.date
                                      ).toLocaleDateString()}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                      {new Date(
                                        review.created_at || review.date
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                  </div>
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
                                      onClick={() =>
                                        handleDeleteReview(review.id)
                                      }
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
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Add New User
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={addUserForm.full_name}
                    onChange={(e) =>
                      setAddUserForm({
                        ...addUserForm,
                        full_name: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    value={addUserForm.username}
                    onChange={(e) =>
                      setAddUserForm({
                        ...addUserForm,
                        username: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={addUserForm.email}
                    onChange={(e) =>
                      setAddUserForm({ ...addUserForm, email: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    value={addUserForm.password}
                    onChange={(e) =>
                      setAddUserForm({
                        ...addUserForm,
                        password: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Bio (Optional)
                  </label>
                  <textarea
                    value={addUserForm.bio}
                    onChange={(e) =>
                      setAddUserForm({
                        ...addUserForm,
                        bio: e.target.value,
                      })
                    }
                    rows="3"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter user bio..."
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_admin"
                    checked={addUserForm.is_admin}
                    onChange={(e) =>
                      setAddUserForm({
                        ...addUserForm,
                        is_admin: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="is_admin"
                    className="ml-2 block text-sm text-gray-900"
                  >
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
                  {dataLoading ? "Creating..." : "Create User"}
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
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Edit User
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editUserForm.full_name}
                    onChange={(e) =>
                      setEditUserForm({
                        ...editUserForm,
                        full_name: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editUserForm.email}
                    onChange={(e) =>
                      setEditUserForm({
                        ...editUserForm,
                        email: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="edit_is_admin"
                    checked={editUserForm.is_admin}
                    onChange={(e) =>
                      setEditUserForm({
                        ...editUserForm,
                        is_admin: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="edit_is_admin"
                    className="ml-2 block text-sm text-gray-900"
                  >
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
                  {dataLoading ? "Saving..." : "Save Changes"}
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
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Edit Review
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editReviewForm.title}
                    onChange={(e) =>
                      setEditReviewForm({
                        ...editReviewForm,
                        title: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Content
                  </label>
                  <textarea
                    value={editReviewForm.content}
                    onChange={(e) =>
                      setEditReviewForm({
                        ...editReviewForm,
                        content: e.target.value,
                      })
                    }
                    rows={4}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Rating
                  </label>
                  <select
                    value={editReviewForm.rating}
                    onChange={(e) =>
                      setEditReviewForm({
                        ...editReviewForm,
                        rating: parseInt(e.target.value),
                      })
                    }
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
                  {dataLoading ? "Saving..." : "Save Changes"}
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
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Add New Gadget
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addGadgetForm.name}
                    onChange={(e) => {
                      setAddGadgetForm({
                        ...addGadgetForm,
                        name: e.target.value,
                      });
                      // Clear error when user starts typing
                      if (addGadgetFormErrors.name) {
                        setAddGadgetFormErrors({
                          ...addGadgetFormErrors,
                          name: "",
                        });
                      }
                    }}
                    className={`mt-1 block w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                      addGadgetFormErrors.name
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    }`}
                    required
                  />
                  {addGadgetFormErrors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {addGadgetFormErrors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={addGadgetForm.category}
                    onChange={(e) => {
                      setAddGadgetForm({
                        ...addGadgetForm,
                        category: e.target.value,
                      });
                      // Clear error when user selects
                      if (addGadgetFormErrors.category) {
                        setAddGadgetFormErrors({
                          ...addGadgetFormErrors,
                          category: "",
                        });
                      }
                    }}
                    className={`mt-1 block w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                      addGadgetFormErrors.category
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    }`}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Smartphones">Smartphones</option>
                    <option value="Laptops">Laptops</option>
                    <option value="Tablets">Tablets</option>
                    <option value="Wearables">Wearables</option>
                    <option value="Audio">Audio</option>
                    <option value="Gaming">Gaming</option>
                  </select>
                  {addGadgetFormErrors.category && (
                    <p className="mt-1 text-sm text-red-600">
                      {addGadgetFormErrors.category}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Brand <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addGadgetForm.brand}
                    onChange={(e) => {
                      setAddGadgetForm({
                        ...addGadgetForm,
                        brand: e.target.value,
                      });
                      // Clear error when user starts typing
                      if (addGadgetFormErrors.brand) {
                        setAddGadgetFormErrors({
                          ...addGadgetFormErrors,
                          brand: "",
                        });
                      }
                    }}
                    className={`mt-1 block w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                      addGadgetFormErrors.brand
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    }`}
                    required
                  />
                  {addGadgetFormErrors.brand && (
                    <p className="mt-1 text-sm text-red-600">
                      {addGadgetFormErrors.brand}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={addGadgetForm.price}
                    onChange={(e) => {
                      setAddGadgetForm({
                        ...addGadgetForm,
                        price: e.target.value,
                      });
                      // Clear error when user starts typing
                      if (addGadgetFormErrors.price) {
                        setAddGadgetFormErrors({
                          ...addGadgetFormErrors,
                          price: "",
                        });
                      }
                    }}
                    className={`mt-1 block w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                      addGadgetFormErrors.price
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    }`}
                    required
                  />
                  {addGadgetFormErrors.price && (
                    <p className="mt-1 text-sm text-red-600">
                      {addGadgetFormErrors.price}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={addGadgetForm.description}
                    onChange={(e) => {
                      setAddGadgetForm({
                        ...addGadgetForm,
                        description: e.target.value,
                      });
                      // Clear error when user starts typing
                      if (addGadgetFormErrors.description) {
                        setAddGadgetFormErrors({
                          ...addGadgetFormErrors,
                          description: "",
                        });
                      }
                    }}
                    rows={3}
                    className={`mt-1 block w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                      addGadgetFormErrors.description
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    }`}
                    required
                  />
                  {addGadgetFormErrors.description && (
                    <p className="mt-1 text-sm text-red-600">
                      {addGadgetFormErrors.description}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Image URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={addGadgetForm.image_url}
                    onChange={(e) => {
                      setAddGadgetForm({
                        ...addGadgetForm,
                        image_url: e.target.value,
                      });
                      // Clear error when user starts typing
                      if (addGadgetFormErrors.image_url) {
                        setAddGadgetFormErrors({
                          ...addGadgetFormErrors,
                          image_url: "",
                        });
                      }
                    }}
                    className={`mt-1 block w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                      addGadgetFormErrors.image_url
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    }`}
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                  {addGadgetFormErrors.image_url && (
                    <p className="mt-1 text-sm text-red-600">
                      {addGadgetFormErrors.image_url}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Release Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={addGadgetForm.release_date}
                    onChange={(e) => {
                      setAddGadgetForm({
                        ...addGadgetForm,
                        release_date: e.target.value,
                      });
                      // Clear error when user selects
                      if (addGadgetFormErrors.release_date) {
                        setAddGadgetFormErrors({
                          ...addGadgetFormErrors,
                          release_date: "",
                        });
                      }
                    }}
                    className={`mt-1 block w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                      addGadgetFormErrors.release_date
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    }`}
                    required
                  />
                  {addGadgetFormErrors.release_date && (
                    <p className="mt-1 text-sm text-red-600">
                      {addGadgetFormErrors.release_date}
                    </p>
                  )}
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
                  disabled={dataLoading || !isAddGadgetFormValid()}
                  className={`px-4 py-2 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    dataLoading || !isAddGadgetFormValid()
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {dataLoading ? "Creating..." : "Create Gadget"}
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
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Edit Gadget
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editGadgetForm.name}
                    onChange={(e) =>
                      setEditGadgetForm({
                        ...editGadgetForm,
                        name: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    value={editGadgetForm.category}
                    onChange={(e) =>
                      setEditGadgetForm({
                        ...editGadgetForm,
                        category: e.target.value,
                      })
                    }
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
                  <label className="block text-sm font-medium text-gray-700">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={editGadgetForm.brand}
                    onChange={(e) =>
                      setEditGadgetForm({
                        ...editGadgetForm,
                        brand: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editGadgetForm.price}
                    onChange={(e) =>
                      setEditGadgetForm({
                        ...editGadgetForm,
                        price: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={editGadgetForm.description}
                    onChange={(e) =>
                      setEditGadgetForm({
                        ...editGadgetForm,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={editGadgetForm.image_url}
                    onChange={(e) =>
                      setEditGadgetForm({
                        ...editGadgetForm,
                        image_url: e.target.value,
                      })
                    }
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
                  {dataLoading ? "Saving..." : "Save Changes"}
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
              <h3 className="text-lg font-medium text-gray-900">
                Confirm Logout
              </h3>
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              {/* Icon */}
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
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
                {deleteModalData.title}
              </h3>

              {/* Message */}
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  {deleteModalData.message}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex justify-center space-x-4 px-4 py-3">
                <button
                  onClick={handleDeleteCancel}
                  className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Alert
        type={alert.type}
        message={alert.message}
        show={alert.show}
        onClose={() => setAlert({ show: false, type: "", message: "" })}
      />
    </div>
  );
};

export default AdminDashboard;
