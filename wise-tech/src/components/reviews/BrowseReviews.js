/**
 * Komponen BrowseReviews - Halaman untuk menjelajahi semua review
 *
 * Fitur utama:
 * - Menampilkan semua review dari pengguna dengan pagination
 * - Filter berdasarkan rating (1-5 bintang)
 * - Filter berdasarkan kategori gadget
 * - Search review berdasarkan komentar atau nama gadget
 * - Sort berdasarkan tanggal (terbaru/terlama) dan rating
 * - Tampilan grid yang menarik dengan card review
 *
 * API yang digunakan:
 * - GET /api/reviews - Mengambil semua review dengan filter dan sort
 */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { reviewAPI, authUtils } from "../../utils/api";
import "./BrowseReviews.css";

const BrowseReviews = () => {
  // State for reviews data
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for filters and search
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const reviewsPerPage = 12;

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  // Helper function to get full profile photo URL
  const getProfilePhotoUrl = (photoPath) => {
    if (!photoPath) return null;
    if (photoPath.startsWith("http")) return photoPath; // Already full URL
    return `http://localhost:8000${photoPath}`; // Add API base URL
  };

  // Load reviews with filters
  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching reviews with filters:", {
        search: searchQuery,
        rating: ratingFilter,
        category: categoryFilter,
        sort: sortBy,
        page: currentPage,
      });

      // Call API with filters
      const params = {
        page: currentPage,
        limit: reviewsPerPage,
        ...(searchQuery && { search: searchQuery }),
        ...(ratingFilter !== "all" && { rating: ratingFilter }),
        ...(categoryFilter !== "all" && { category: categoryFilter }),
        sort: sortBy,
      };

      const response = await reviewAPI.getAllReviews(params);
      console.log("Browse reviews response:", response);

      if (response) {
        setReviews(response.reviews || response || []);
        setTotalPages(
          response.total_pages ||
            Math.ceil((response.total || response.length) / reviewsPerPage)
        );
        setTotalReviews(response.total || response.length || 0);
      } else {
        setReviews([]);
        setTotalPages(1);
        setTotalReviews(0);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError("Failed to load reviews. Please try again.");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch reviews when component mounts or filters change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchReviews();
  }, [currentPage, searchQuery, ratingFilter, categoryFilter, sortBy]);

  // Reset to first page when filters change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchQuery, ratingFilter, categoryFilter, sortBy]);

  // Handle search with debounce
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle filter changes
  const handleRatingFilterChange = (rating) => {
    setRatingFilter(rating);
  };

  const handleCategoryFilterChange = (category) => {
    setCategoryFilter(category);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate star rating display
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span
        key={i}
        className={i < rating ? "text-yellow-400" : "text-gray-300"}
      >
        ★
      </span>
    ));
  };

  // Get user avatar initials
  const getUserInitials = (user) => {
    if (user?.full_name) {
      return user.full_name
        .split(" ")
        .map((name) => name.charAt(0))
        .join("")
        .substring(0, 2);
    }
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return "U";
  };

  // Helper function to get display name (show "You" if it's current user's review)
  const getDisplayName = (review) => {
    const currentUser = authUtils.getUserInfo();
    const currentUserId = currentUser?.id?.toString();
    const reviewUserId = review.user_id?.toString();

    if (currentUserId && reviewUserId && currentUserId === reviewUserId) {
      return "You";
    }

    return review.user?.full_name || review.user?.username || "Anonymous User";
  };

  // Get category badge color
  const getCategoryBadgeColor = (category) => {
    switch (category?.toLowerCase()) {
      case "smartphones":
      case "smartphone":
        return "bg-blue-100 text-blue-800";
      case "laptops":
      case "laptop":
        return "bg-green-100 text-green-800";
      case "tablets":
      case "tablet":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              User Reviews
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Read authentic reviews from our community members about their
              gadget experiences
            </p>
            <div className="mt-8 flex justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span>Authentic User Reviews</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span>Real Experiences</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
                <span>Detailed Insights</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search Section */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search reviews, users, or content..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                />
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
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center space-x-4">
              {/* Rating Filter */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">
                  Rating:
                </label>
                <select
                  value={ratingFilter}
                  onChange={(e) => handleRatingFilterChange(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                  <option value="1">1+ Stars</option>
                </select>
              </div>

              {/* Category Filter */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">
                  Category:
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => handleCategoryFilterChange(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
                >
                  <option value="all">All Categories</option>
                  <option value="smartphone">Smartphones</option>
                  <option value="laptop">Laptops</option>
                  <option value="tablet">Tablets</option>
                </select>
              </div>

              {/* Sort */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">
                  Sort:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="rating_high">Highest Rating</option>
                  <option value="rating_low">Lowest Rating</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
              <span className="text-gray-600 font-medium">
                Loading amazing reviews...
              </span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-red-800 mb-2">
                Error Loading Reviews
              </h3>
              <p className="text-red-600 text-sm mb-4">{error}</p>
              <button
                onClick={fetchReviews}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Reviews Grid */}
        {!loading && !error && (
          <>
            {/* Results Summary */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    User Reviews & Experiences
                  </h2>
                  <p className="text-gray-600">
                    Showing{" "}
                    <span className="font-semibold text-blue-600">
                      {reviews.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-blue-600">
                      {totalReviews}
                    </span>{" "}
                    reviews from our community
                    {searchQuery && (
                      <span>
                        {" "}
                        matching "
                        <span className="font-medium text-purple-600">
                          {searchQuery}
                        </span>
                        "
                      </span>
                    )}
                    {ratingFilter !== "all" && (
                      <span>
                        {" "}
                        with{" "}
                        <span className="font-medium text-yellow-600">
                          {ratingFilter}+ stars
                        </span>
                      </span>
                    )}
                    {categoryFilter !== "all" && (
                      <span>
                        {" "}
                        about{" "}
                        <span className="font-medium text-green-600">
                          {categoryFilter}s
                        </span>
                      </span>
                    )}
                  </p>
                </div>
                {(searchQuery ||
                  ratingFilter !== "all" ||
                  categoryFilter !== "all") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setRatingFilter("all");
                      setCategoryFilter("all");
                      setSortBy("newest");
                    }}
                    className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {reviews.length > 0 ? (
              <div className="space-y-8">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden"
                  >
                    {/* Review Header - User sebagai fokus utama */}
                    <div className="p-6">
                      <div className="flex items-start space-x-4 mb-6">
                        {/* User Avatar - Lebih besar dengan foto profile */}
                        {review.user?.profile_photo ? (
                          <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-blue-200 shadow-lg flex-shrink-0">
                            <img
                              src={getProfilePhotoUrl(
                                review.user.profile_photo
                              )}
                              alt={
                                review.user?.full_name ||
                                review.user?.username ||
                                "User"
                              }
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback to gradient avatar if image fails to load
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                            <div
                              className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
                              style={{ display: "none" }}
                            >
                              {getUserInitials(review.user)}
                            </div>
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0">
                            {getUserInitials(review.user)}
                          </div>
                        )}

                        {/* User Info dan Rating */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1">
                                {getDisplayName(review)}
                              </h3>
                              <p className="text-sm text-gray-500 mb-3">
                                Shared their experience on{" "}
                                {formatDate(review.created_at)}
                              </p>
                              {/* Product yang direview */}
                              <div className="flex items-center space-x-2 text-sm">
                                <span className="text-gray-600">Reviewed:</span>
                                <Link
                                  to={`/gadget/${review.gadget?.id}`}
                                  className="font-medium text-blue-600 hover:text-blue-800 transition-colors hover:underline"
                                >
                                  {review.gadget?.name || "Unknown Gadget"}
                                </Link>
                                {review.gadget?.category && (
                                  <span
                                    className={`px-2 py-1 text-xs rounded-full font-medium capitalize ${getCategoryBadgeColor(
                                      review.gadget.category
                                    )}`}
                                  >
                                    {review.gadget.category}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Rating - Lebih prominent */}
                            <div className="text-right">
                              <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl px-4 py-3 border border-yellow-200">
                                <div className="flex items-center space-x-1">
                                  {renderStars(review.rating)}
                                </div>
                                <span className="text-2xl font-bold text-gray-800 ml-2">
                                  {review.rating}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                out of 5 stars
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Review Title - Lebih prominent */}
                      {review.title && (
                        <div className="mb-4">
                          <h4 className="text-2xl font-bold text-gray-900 leading-tight">
                            "{review.title}"
                          </h4>
                        </div>
                      )}

                      {/* Review Content - Main Focus */}
                      <div className="bg-gray-50 rounded-xl p-6 mb-6">
                        <div className="flex items-start space-x-3">
                          <div className="w-1 h-full bg-blue-500 rounded-full flex-shrink-0"></div>
                          <div className="flex-1">
                            <p className="text-gray-800 text-lg leading-relaxed">
                              {review.content}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Pros and Cons - Enhanced Design */}
                      {(review.pros || review.cons) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          {review.pros && (
                            <div className="bg-green-50 rounded-xl p-5 border-l-4 border-green-400">
                              <div className="flex items-center space-x-3 mb-3">
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                  <svg
                                    className="w-4 h-4 text-white"
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
                                <h5 className="font-bold text-green-800 text-lg">
                                  What I Loved
                                </h5>
                              </div>
                              <p className="text-green-700 leading-relaxed">
                                {review.pros}
                              </p>
                            </div>
                          )}

                          {review.cons && (
                            <div className="bg-red-50 rounded-xl p-5 border-l-4 border-red-400">
                              <div className="flex items-center space-x-3 mb-3">
                                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                  <svg
                                    className="w-4 h-4 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                                <h5 className="font-bold text-red-800 text-lg">
                                  Could Be Better
                                </h5>
                              </div>
                              <p className="text-red-700 leading-relaxed">
                                {review.cons}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Review Footer */}
                      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            <span>Review #{review.id}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                              />
                            </svg>
                            <span>
                              {review.gadget?.brand || "Unknown Brand"}
                            </span>
                          </div>
                        </div>

                        <Link
                          to={`/gadget/${review.gadget?.id}`}
                          className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-800 font-medium text-sm px-4 py-2 rounded-lg transition-all duration-200 group"
                        >
                          <span>View Product Details</span>
                          <svg
                            className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mx-auto mb-6">
                    <svg
                      className="w-10 h-10 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    No Reviews Found
                  </h3>
                  <p className="text-gray-600 text-lg mb-8">
                    {searchQuery ||
                    ratingFilter !== "all" ||
                    categoryFilter !== "all"
                      ? "Try adjusting your filters or search terms to find more reviews."
                      : "No reviews have been posted yet. Be the first to share your thoughts!"}
                  </p>
                  {searchQuery ||
                  ratingFilter !== "all" ||
                  categoryFilter !== "all" ? (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setRatingFilter("all");
                        setCategoryFilter("all");
                        setSortBy("newest");
                      }}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg text-sm hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      Clear All Filters
                    </button>
                  ) : (
                    <Link
                      to="/"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg text-sm hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg inline-block"
                    >
                      Explore Gadgets
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Pagination */}
            {reviews.length > 0 && totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center space-x-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      currentPage === 1
                        ? "text-gray-400 cursor-not-allowed bg-gray-100"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 bg-white border border-gray-300 shadow-sm"
                    }`}
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                            currentPage === page
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                              : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 bg-white border border-gray-300 shadow-sm"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <span key={page} className="px-2 py-2 text-gray-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed bg-gray-100"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 bg-white border border-gray-300 shadow-sm"
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BrowseReviews;
