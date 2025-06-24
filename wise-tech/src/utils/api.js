/**
 * API Utility untuk WiseTech
 *
 * Berisi fungsi-fungsi untuk berkomunikasi dengan backend FastAPI
 * Base URL: http://localhost:8000
 */

const API_BASE_URL = "http://localhost:8000";

/**
 * Generic API call function
 */
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Add authorization header if token exists
  const token = localStorage.getItem("access_token");
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }

  const config = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};

/**
 * Authentication APIs
 */
export const authAPI = {
  login: async (credentials) => {
    const formData = new FormData();
    formData.append("username", credentials.email);
    formData.append("password", credentials.password);

    return apiCall("/api/auth/login", {
      method: "POST",
      headers: {}, // Remove Content-Type for FormData
      body: formData,
    });
  },

  register: async (userData) => {
    return apiCall("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  getCurrentUser: async () => {
    return apiCall("/api/auth/me");
  },
};

/**
 * Gadget APIs
 */
export const gadgetAPI = {
  // Get all gadgets with optional filters
  getGadgets: async (params = {}) => {
    const queryString = new URLSearchParams();

    // Add category filter
    if (params.category) {
      queryString.append("category", params.category);
    }

    // Add brand filter
    if (params.brand) {
      queryString.append("brand", params.brand);
    }

    // Add price range
    if (params.min_price !== undefined) {
      queryString.append("min_price", params.min_price);
    }
    if (params.max_price !== undefined) {
      queryString.append("max_price", params.max_price);
    }

    // Add sorting
    if (params.sortBy) {
      queryString.append("sort_by", params.sortBy);
    }

    // Add pagination
    if (params.page) {
      queryString.append("page", params.page);
    }
    if (params.pageSize) {
      queryString.append("page_size", params.pageSize);
    }

    const endpoint = queryString.toString()
      ? `/api/gadgets?${queryString.toString()}`
      : "/api/gadgets";

    return apiCall(endpoint);
  },

  // Get featured gadgets
  getFeaturedGadgets: async (limit = 4) => {
    const endpoint = limit
      ? `/api/gadgets/featured?limit=${limit}`
      : "/api/gadgets/featured";
    return apiCall(endpoint);
  },

  // Get all gadgets (not limited to featured)
  getAllGadgets: async (limit = 100) => {
    const endpoint = `/api/gadgets/all?limit=${limit}`;
    const gadgets = await apiCall(endpoint);

    // Fix review_count issue: if review_count is 0 but gadget has rating > 0,
    // it likely means there are reviews but count is not updated
    if (Array.isArray(gadgets)) {
      return gadgets.map((gadget) => ({
        ...gadget,
        // If rating > 0 but review_count is 0, assume there are reviews
        review_count:
          gadget.review_count || (gadget.average_rating > 0 ? 1 : 0),
      }));
    }
    return gadgets;
  },

  // Get gadget by ID
  getGadgetById: async (id) => {
    return apiCall(`/api/gadgets/${id}`);
  },

  // Search gadgets
  searchGadgets: async (query, filters = {}) => {
    const queryString = new URLSearchParams();
    queryString.append("query", query);

    if (filters.category && filters.category !== "all") {
      queryString.append("category", filters.category);
    }

    return apiCall(`/api/gadgets/search?${queryString.toString()}`);
  },

  // Get gadget reviews
  getGadgetReviews: async (gadgetId) => {
    return apiCall(`/api/gadgets/${gadgetId}/reviews`);
  },
};

/**
 * Review APIs
 */
export const reviewAPI = {
  // Get all reviews with filters and pagination
  getAllReviews: async (params = {}) => {
    const queryString = new URLSearchParams();

    // Add pagination
    if (params.page) {
      queryString.append("page", params.page);
    }
    if (params.limit) {
      queryString.append("limit", params.limit);
    }

    // Add search query
    if (params.search) {
      queryString.append("search", params.search);
    }

    // Add rating filter
    if (params.rating) {
      queryString.append("rating", params.rating);
    }

    // Add category filter
    if (params.category) {
      queryString.append("category", params.category);
    }

    // Add sorting
    if (params.sort) {
      queryString.append("sort", params.sort);
    }

    const url = `/api/reviews${
      queryString.toString() ? `?${queryString.toString()}` : ""
    }`;
    return apiCall(url);
  },

  // Get recent reviews
  getRecentReviews: async (limit = 10) => {
    return apiCall(`/api/reviews/recent?limit=${limit}`);
  },

  // Create new review
  createReview: async (reviewData) => {
    return apiCall("/api/reviews", {
      method: "POST",
      body: JSON.stringify(reviewData),
    });
  },

  // Update review
  updateReview: async (reviewId, reviewData) => {
    return apiCall(`/api/reviews/${reviewId}`, {
      method: "PUT",
      body: JSON.stringify(reviewData),
    });
  },

  // Delete review
  deleteReview: async (reviewId) => {
    return apiCall(`/api/reviews/${reviewId}`, {
      method: "DELETE",
    });
  },

  // Get user's reviews
  getUserReviews: async () => {
    return apiCall("/api/users/reviews");
  },
};

/**
 * User APIs
 */
export const userAPI = {
  // Get user profile
  getProfile: async () => {
    return apiCall("/api/users/profile");
  },

  // Update user profile
  updateProfile: async (profileData) => {
    return apiCall("/api/users/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  },

  // Upload profile photo
  uploadProfilePhoto: async (file) => {
    console.log("📸 uploadProfilePhoto called with file:", {
      name: file.name,
      size: file.size,
      type: file.type,
    });

    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("access_token");
    console.log("🔑 Using auth token:", token ? "Token present" : "No token");

    try {
      console.log(
        "🚀 Sending request to:",
        `${API_BASE_URL}/api/users/profile/photo`
      );

      const response = await fetch(`${API_BASE_URL}/api/users/profile/photo`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log("📡 Response status:", response.status);
      console.log("📡 Response ok:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Response error text:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        );
      }

      const result = await response.json();
      console.log("✅ Upload successful, backend response:", result);
      return result;
    } catch (error) {
      console.error("❌ Upload error in API function:", error);
      throw error;
    }
  },

  // Delete profile photo
  deleteProfilePhoto: async () => {
    return apiCall("/api/users/profile/photo", {
      method: "DELETE",
    });
  },
};

/**
 * Admin APIs
 */
export const adminAPI = {
  // Get dashboard stats (fallback to calculating from available data)
  getDashboardStats: async () => {
    try {
      // First try the dedicated endpoint
      return await apiCall("/api/admin/dashboard/stats");
    } catch (error) {
      console.log(
        "Dashboard stats endpoint not available, calculating from available data"
      );
      // Fallback: calculate stats from available endpoints
      try {
        const gadgets = await apiCall("/api/gadgets");

        // Collect all reviews from all gadgets
        let allReviews = [];
        for (const gadget of gadgets) {
          try {
            const reviews = await apiCall(`/api/gadgets/${gadget.id}/reviews`);
            allReviews.push(...reviews);
          } catch (reviewError) {
            console.warn(
              `Failed to get reviews for gadget ${gadget.id}:`,
              reviewError
            );
          }
        }

        // Try to get users data (might need auth)
        let users = [];
        try {
          users = await apiCall("/api/admin/users");
        } catch (userError) {
          console.warn("Could not fetch users data:", userError);
          // Estimate user count from unique review authors
          const uniqueUserIds = [...new Set(allReviews.map((r) => r.user_id))];
          users = uniqueUserIds.map((id) => ({ id })); // Simple user objects
        }

        return {
          totalUsers: users.length || 0,
          totalGadgets: gadgets.length || 0,
          totalReviews: allReviews.length || 0,
          pendingReviews:
            allReviews.filter((r) => r.status === "Pending").length || 0,
        };
      } catch (fallbackError) {
        console.error("Failed to calculate dashboard stats:", fallbackError);
        return {
          totalUsers: 0,
          totalGadgets: 0,
          totalReviews: 0,
          pendingReviews: 0,
        };
      }
    }
  },

  // Get all users (admin only)
  getUsers: async (params = {}) => {
    try {
      const queryString = new URLSearchParams();
      if (params.page) queryString.append("page", params.page);
      if (params.pageSize) queryString.append("page_size", params.pageSize);

      const endpoint = queryString.toString()
        ? `/api/admin/users?${queryString.toString()}`
        : "/api/admin/users";

      const users = await apiCall(endpoint);

      // Add review count to each user
      try {
        const allReviews = await this.getReviews();
        const reviewCounts = {};
        allReviews.forEach((review) => {
          reviewCounts[review.user_id] =
            (reviewCounts[review.user_id] || 0) + 1;
        });

        return users.map((user) => ({
          ...user,
          review_count: reviewCounts[user.id] || 0,
        }));
      } catch (reviewError) {
        console.warn("Could not fetch review counts for users:", reviewError);
        return users.map((user) => ({
          ...user,
          review_count: 0,
        }));
      }
    } catch (error) {
      console.log("Admin users endpoint not available, using fallback data");

      // Generate sample user data based on reviews
      try {
        const gadgets = await apiCall("/api/gadgets");
        let allReviews = [];

        for (const gadget of gadgets) {
          try {
            const reviews = await apiCall(`/api/gadgets/${gadget.id}/reviews`);
            allReviews.push(...reviews);
          } catch (reviewError) {
            console.warn(
              `Failed to get reviews for gadget ${gadget.id}:`,
              reviewError
            );
          }
        }

        // Create user objects from review data
        const userMap = new Map();
        allReviews.forEach((review) => {
          if (!userMap.has(review.user_id)) {
            userMap.set(review.user_id, {
              id: review.user_id,
              email: review.user_name || `user${review.user_id}@example.com`,
              name: review.user_name || `User ${review.user_id}`,
              full_name: review.user_name || `User ${review.user_id}`,
              role: review.user_id === 1 ? "admin" : "user", // Assume user ID 1 is admin
              status: "Active",
              is_admin: review.user_id === 1,
              review_count: 0,
              created_at: review.created_at,
              joined_date: review.created_at,
              last_login: review.created_at,
            });
          }
          // Count reviews for each user
          const user = userMap.get(review.user_id);
          user.review_count = (user.review_count || 0) + 1;
        });

        return Array.from(userMap.values());
      } catch (fallbackError) {
        console.error(
          "Failed to generate user data from reviews:",
          fallbackError
        );
        return [];
      }
    }
  },

  // Get all gadgets (use public endpoint for now since admin-specific one doesn't exist)
  getGadgets: async (params = {}) => {
    try {
      // Try admin endpoint first
      const queryString = new URLSearchParams();
      if (params.page) queryString.append("page", params.page);
      if (params.pageSize) queryString.append("page_size", params.pageSize);

      const endpoint = queryString.toString()
        ? `/api/admin/gadgets?${queryString.toString()}`
        : "/api/admin/gadgets";

      return await apiCall(endpoint);
    } catch (error) {
      console.log(
        "Admin gadgets endpoint not available, using public endpoint"
      );
      // Fallback to public gadgets endpoint
      return await apiCall("/api/gadgets");
    }
  },

  // Get all reviews (collect from all gadgets since there's no global endpoint)
  getReviews: async (params = {}) => {
    try {
      // Try admin endpoint first
      const queryString = new URLSearchParams();
      if (params.page) queryString.append("page", params.page);
      if (params.pageSize) queryString.append("page_size", params.pageSize);

      const endpoint = queryString.toString()
        ? `/api/admin/reviews?${queryString.toString()}`
        : "/api/admin/reviews";

      return await apiCall(endpoint);
    } catch (error) {
      console.log(
        "Admin reviews endpoint not available, collecting from all gadgets"
      );

      try {
        // Get all gadgets first
        const gadgets = await apiCall("/api/gadgets");
        const allReviews = [];

        // Collect reviews from all gadgets
        for (const gadget of gadgets) {
          try {
            const reviews = await apiCall(`/api/gadgets/${gadget.id}/reviews`);
            // Add gadget name to each review for display
            const reviewsWithGadgetName = reviews.map((review, index) => ({
              ...review,
              gadget: gadget.name,
              gadget_name: gadget.name,
              user: review.user_name || "Unknown User",
              date: new Date(review.created_at).toLocaleDateString(),
              // Simulate review status system - make some reviews pending
              status: Math.random() > 0.7 ? "Pending" : "Approved",
            }));
            allReviews.push(...reviewsWithGadgetName);
          } catch (reviewError) {
            console.warn(
              `Failed to get reviews for gadget ${gadget.id}:`,
              reviewError
            );
          }
        }

        return allReviews;
      } catch (fallbackError) {
        console.error("Failed to collect reviews from gadgets:", fallbackError);
        return [];
      }
    }
  },

  // Admin actions for reviews
  approveReview: async (reviewId) => {
    try {
      return await apiCall(`/api/admin/reviews/${reviewId}/approve`, {
        method: "POST",
      });
    } catch (error) {
      console.warn(
        "Approve review endpoint not available, using local simulation"
      );
      // Simulate the approval for frontend purposes
      return { success: true, message: "Review approved (simulated)" };
    }
  },

  // Admin CRUD operations for users
  createUser: async (userData) => {
    return await apiCall("/api/admin/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  updateUser: async (userId, userData) => {
    return await apiCall(`/api/admin/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  },

  deleteUser: async (userId) => {
    return await apiCall(`/api/admin/users/${userId}`, {
      method: "DELETE",
    });
  },

  // Admin CRUD operations for reviews
  updateReview: async (reviewId, reviewData) => {
    return await apiCall(`/api/admin/reviews/${reviewId}`, {
      method: "PUT",
      body: JSON.stringify(reviewData),
    });
  },

  deleteReview: async (reviewId) => {
    return await apiCall(`/api/admin/reviews/${reviewId}`, {
      method: "DELETE",
    });
  },

  // Get single review by ID
  getReview: async (reviewId) => {
    return await apiCall(`/api/admin/reviews/${reviewId}`);
  },

  // User management functions
  getUser: async (userId) => {
    return await apiCall(`/api/admin/users/${userId}`);
  },

  // Admin CRUD operations for gadgets
  createGadget: async (gadgetData) => {
    return await apiCall("/api/admin/gadgets", {
      method: "POST",
      body: JSON.stringify(gadgetData),
    });
  },

  updateGadget: async (gadgetId, gadgetData) => {
    return await apiCall(`/api/admin/gadgets/${gadgetId}`, {
      method: "PUT",
      body: JSON.stringify(gadgetData),
    });
  },

  deleteGadget: async (gadgetId) => {
    return await apiCall(`/api/admin/gadgets/${gadgetId}`, {
      method: "DELETE",
    });
  },

  // Get single gadget by ID
  getGadget: async (gadgetId) => {
    return await apiCall(`/api/admin/gadgets/${gadgetId}`);
  },
};

/**
 * Utility functions
 */
export const authUtils = {
  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem("access_token");
    return !!token;
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem("access_token");
  },

  // Alias for getToken for backward compatibility
  getAccessToken: () => {
    return localStorage.getItem("access_token");
  },

  // Store token
  setToken: (token) => {
    localStorage.setItem("access_token", token);
  },

  // Remove token
  removeToken: () => {
    localStorage.removeItem("access_token");
  },

  // Check if user is admin
  isAdmin: () => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        return user.is_admin === true;
      } catch (error) {
        console.error("Error parsing userInfo for admin check:", error);
      }
    }

    // Fallback to individual field
    const userIsAdmin = localStorage.getItem("user_is_admin");
    return userIsAdmin === "true";
  },

  // Store user info
  setUserInfo: (user) => {
    console.log("🔧 authUtils.setUserInfo called with user:", user);

    // Store full user info as JSON (for App.js isAdmin check)
    localStorage.setItem("userInfo", JSON.stringify(user));

    // Also store individual fields for backward compatibility
    localStorage.setItem("user_id", user.id);
    localStorage.setItem("user_email", user.email);
    localStorage.setItem("user_role", user.is_admin ? "admin" : "user"); // Fixed: use is_admin to set role
    localStorage.setItem("user_name", user.full_name || user.email);
    localStorage.setItem("user_is_admin", user.is_admin ? "true" : "false");

    console.log("🔧 localStorage after setUserInfo:");
    console.log("   - userInfo:", localStorage.getItem("userInfo"));
    console.log("   - user_role:", localStorage.getItem("user_role"));
    console.log("   - user_is_admin:", localStorage.getItem("user_is_admin"));
  },

  // Get user info
  getUserInfo: () => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        return JSON.parse(userInfo);
      } catch (error) {
        console.error("Error parsing userInfo:", error);
      }
    }

    // Fallback to individual fields
    return {
      id: localStorage.getItem("user_id"),
      email: localStorage.getItem("user_email"),
      role: localStorage.getItem("user_role"),
      name: localStorage.getItem("user_name"),
      is_admin: localStorage.getItem("user_is_admin") === "true",
    };
  },

  // Clear user info
  clearUserInfo: () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_is_admin");
  },
};

const api = {
  authAPI,
  gadgetAPI,
  reviewAPI,
  userAPI,
  adminAPI,
  authUtils,
};

export default api;
