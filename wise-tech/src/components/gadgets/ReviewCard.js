/**
 * Komponen ReviewCard - Menampilkan satu review gadget
 * 
 * Fitur utama:
 * - Menampilkan rating dengan stars
 * - User info dan tanggal
 * - Review title dan content
 * - Pros dan cons jika ada
 * - Actions untuk edit/delete (jika review milik user)
 */

import React from 'react';
import { authUtils } from '../../utils/api';

const ReviewCard = ({ review, onEdit, onDelete, showActions = true }) => {
  const currentUser = authUtils.getUserInfo();
  const isOwner = currentUser.id === review.user_id?.toString();
  const isAdmin = authUtils.isAdmin();

  // Format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Recently';
    }
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
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {review.user?.profile_photo ? (
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-200">
              <img 
                src={`http://localhost:8000${review.user.profile_photo}`}
                alt={review.user?.full_name || review.user_name || 'User'} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to initial avatar if image fails to load
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm" style={{display: 'none'}}>
                {(review.user_name || review.user?.full_name || 'U')[0].toUpperCase()}
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {(review.user_name || review.user?.full_name || 'U')[0].toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900">
              {review.user_name || review.user?.full_name || 'Anonymous User'}
            </p>
            <p className="text-sm text-gray-500">
              {formatDate(review.created_at)}
            </p>
          </div>
        </div>
        
        {/* Actions */}
        {showActions && (isOwner || isAdmin) && (
          <div className="flex space-x-2">
            {isOwner && onEdit && (
              <button
                onClick={() => onEdit(review)}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
              >
                Edit
              </button>
            )}
            {(isOwner || isAdmin) && onDelete && (
              <button
                onClick={() => onDelete(review)}
                className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="flex items-center space-x-2 mb-3">
        <div className="flex space-x-1">
          {renderStars(review.rating)}
        </div>
        <span className="text-sm font-medium text-gray-700">
          {review.rating}/5
        </span>
      </div>

      {/* Title */}
      {review.title && (
        <h4 className="text-lg font-semibold text-gray-900 mb-2">
          {review.title}
        </h4>
      )}

      {/* Content */}
      <p className="text-gray-700 mb-4 leading-relaxed">
        {review.content}
      </p>

      {/* Pros and Cons */}
      {(review.pros || review.cons) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
          {review.pros && (
            <div>
              <h5 className="text-sm font-semibold text-green-700 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Pros
              </h5>
              <p className="text-sm text-gray-600">{review.pros}</p>
            </div>
          )}
          {review.cons && (
            <div>
              <h5 className="text-sm font-semibold text-red-700 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Cons
              </h5>
              <p className="text-sm text-gray-600">{review.cons}</p>
            </div>
          )}
        </div>
      )}

      {/* Gadget info (if available) */}
      {review.gadget_name && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Review for: <span className="font-medium text-gray-700">{review.gadget_name}</span>
            {review.gadget_brand && (
              <span className="text-gray-500"> by {review.gadget_brand}</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
