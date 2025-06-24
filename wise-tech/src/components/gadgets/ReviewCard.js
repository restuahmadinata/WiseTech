/**
 * Komponen ReviewCard - Menampilkan satu review gadget
 *
 * Fitur utama:
 * - Menampilkan rating dengan stars
 * - User info dan tanggal dengan foto profile
 * - Review title dan content
 * - Pros dan cons jika ada
 * - Actions untuk edit/delete (jika review milik user)
 * - Desain yang konsisten dengan BrowseReviews
 */

import React from "react";
import { authUtils } from "../../utils/api";

const ReviewCard = ({ review, onEdit, onDelete, showActions = true }) => {
  const currentUser = authUtils.getUserInfo();

  // More robust ID comparison - handle both string and number types
  const currentUserId = currentUser?.id?.toString();
  const reviewUserId = review?.user_id?.toString();

  // Also check if current user's ID matches the review's user ID from user object
  const reviewUserIdFromUserObj = review?.user?.id?.toString();

  const isOwner =
    currentUserId &&
    ((reviewUserId && currentUserId === reviewUserId) ||
      (reviewUserIdFromUserObj && currentUserId === reviewUserIdFromUserObj));
  const isAdmin = authUtils.isAdmin();

  // Debug logging
  console.log("🔍 ReviewCard Debug:", {
    currentUserId,
    reviewUserId,
    reviewUserIdFromUserObj,
    isOwner,
    isAdmin,
    showActions,
    hasOnEdit: !!onEdit,
    hasOnDelete: !!onDelete,
    reviewTitle: review.title,
    reviewId: review.id,
    currentUserInfo: currentUser,
    reviewUser: review.user,
  });

  // Format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Recently";
    }
  };

  // Helper function to get full profile photo URL
  const getProfilePhotoUrl = (photoPath) => {
    if (!photoPath) return null;
    if (photoPath.startsWith("http")) return photoPath; // Already full URL
    return `http://localhost:8000${photoPath}`; // Add API base URL
  };

  // Get user avatar initials
  const getUserInitials = (user) => {
    if (user?.full_name) {
      const names = user.full_name.split(" ");
      if (names.length >= 2) {
        return (names[0][0] + names[1][0]).toUpperCase();
      }
      return user.full_name[0].toUpperCase();
    }
    if (user?.username) {
      return user.username[0].toUpperCase();
    }
    if (review.user_name) {
      return review.user_name[0].toUpperCase();
    }
    return "U";
  };

  // Get display name for user (show "You" if it's current user's review)
  const getDisplayName = () => {
    if (isOwner) {
      return "You";
    }
    return (
      review.user?.full_name ||
      review.user?.username ||
      review.user_name ||
      "Anonymous User"
    );
  };

  // Render stars
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <svg
            key={i}
            className="h-5 w-5 text-yellow-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <svg
            key={i}
            className="h-5 w-5 text-yellow-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <defs>
              <linearGradient id={`half-star-${review.id}`}>
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#D1D5DB" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#half-star-${review.id})`}
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        );
      } else {
        stars.push(
          <svg
            key={i}
            className="h-5 w-5 text-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      }
    }

    return stars;
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden">
      {/* Header dengan User Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start space-x-4">
            {/* User Avatar - Lebih besar dengan foto profile */}
            {review.user?.profile_photo ? (
              <div className="w-14 h-14 rounded-full overflow-hidden border-4 border-indigo-200 shadow-lg flex-shrink-0">
                <img
                  src={getProfilePhotoUrl(review.user.profile_photo)}
                  alt={
                    review.user?.full_name ||
                    review.user?.username ||
                    review.user_name ||
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
                  className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
                  style={{ display: "none" }}
                >
                  {getUserInitials(review.user)}
                </div>
              </div>
            ) : (
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
                {getUserInitials(review.user)}
              </div>
            )}

            {/* User Info */}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {getDisplayName()}
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                Reviewed on {formatDate(review.created_at)}
              </p>

              {/* Rating */}
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {renderStars(review.rating)}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {review.rating}/5
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          {showActions && (isOwner || isAdmin) && (
            <div className="flex space-x-2">
              {isOwner && onEdit && (
                <button
                  onClick={() => onEdit(review)}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors px-3 py-1 rounded-lg hover:bg-indigo-50"
                >
                  Edit
                </button>
              )}
              {(isOwner || isAdmin) && onDelete && (
                <button
                  onClick={() => onDelete(review)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors px-3 py-1 rounded-lg hover:bg-red-50"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>

        {/* Title */}
        {review.title && (
          <h4 className="text-xl font-bold text-gray-900 mb-3">
            {review.title}
          </h4>
        )}

        {/* Content */}
        <p className="text-gray-700 mb-4 leading-relaxed text-base">
          {review.content}
        </p>

        {/* Pros and Cons */}
        {(review.pros || review.cons) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-200">
            {review.pros && (
              <div className="bg-green-50 rounded-lg p-4">
                <h5 className="text-sm font-semibold text-green-700 mb-2 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Pros
                </h5>
                <p className="text-sm text-green-800">{review.pros}</p>
              </div>
            )}
            {review.cons && (
              <div className="bg-red-50 rounded-lg p-4">
                <h5 className="text-sm font-semibold text-red-700 mb-2 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Cons
                </h5>
                <p className="text-sm text-red-800">{review.cons}</p>
              </div>
            )}
          </div>
        )}

        {/* Gadget info (if available) */}
        {review.gadget_name && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Review for:{" "}
              <span className="font-medium text-gray-700">
                {review.gadget_name}
              </span>
              {review.gadget_brand && (
                <span className="text-gray-500"> by {review.gadget_brand}</span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
