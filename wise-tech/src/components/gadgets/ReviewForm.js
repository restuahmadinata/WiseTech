/**
 * Komponen ReviewForm - Form untuk menulis review gadget
 *
 * Fitur utama:
 * - Form rating (1-5 stars)
 * - Judul review
 * - Konten review
 * - Pros dan cons (optional)
 * - Submit ke backend
 */

import React, { useState, useEffect } from "react";
import { reviewAPI, authUtils, userAPI } from "../../utils/api";
import Alert from "../common/Alert";

const ReviewForm = ({ gadgetId, onReviewSubmitted }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    rating: 5,
    pros: "",
    cons: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!authUtils.isAuthenticated()) {
        setProfileLoading(false);
        return;
      }

      try {
        const profile = await userAPI.getProfile();
        setUserProfile(profile);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        setError("Failed to load user information");
      } finally {
        setProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingChange = (rating) => {
    setFormData((prev) => ({
      ...prev,
      rating: rating,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authUtils.isAuthenticated()) {
      setError("Please login to write a review");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const reviewData = {
        gadget_id: parseInt(gadgetId),
        title: formData.title,
        content: formData.content,
        rating: formData.rating,
        pros: formData.pros || null,
        cons: formData.cons || null,
      };

      console.log("Submitting review:", reviewData);
      const newReview = await reviewAPI.createReview(reviewData);

      console.log("✅ Review submitted successfully:", newReview);

      // Reset form
      setFormData({
        title: "",
        content: "",
        rating: 5,
        pros: "",
        cons: "",
      });

      // Notify parent component
      if (onReviewSubmitted) {
        onReviewSubmitted(newReview);
      }

      // Emit global event to notify admin dashboard of new review
      console.log(
        "📢 ReviewForm - Dispatching reviewSubmitted event with data:",
        newReview
      );
      window.dispatchEvent(
        new CustomEvent("reviewSubmitted", {
          detail: { review: newReview },
        })
      );
      console.log("✅ ReviewForm - Event dispatched successfully");

      // Show success alert
      setAlert({
        show: true,
        type: "success",
        message: "Review submitted successfully!",
      });
    } catch (err) {
      console.error("❌ Error submitting review:", err);

      // Handle specific error messages from backend
      if (err.message.includes("403")) {
        setError("Unable to submit review. Please try again.");
      } else {
        setError("Failed to submit review. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!authUtils.isAuthenticated()) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-600 mb-4">Please login to write a review</p>
        <button
          onClick={() => (window.location.href = "/login")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Login
        </button>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 review-form">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Write a Review</h3>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(star)}
                className={`text-2xl ${
                  star <= formData.rating ? "text-yellow-400" : "text-gray-300"
                } hover:text-yellow-400 transition-colors`}
              >
                ★
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              ({formData.rating}/5)
            </span>
          </div>
        </div>

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Review Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            placeholder="Summary of your review"
          />
        </div>

        {/* Content */}
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Review Content
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Share your detailed experience with this gadget..."
          />
        </div>

        {/* Pros */}
        <div>
          <label
            htmlFor="pros"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Pros (Optional)
          </label>
          <textarea
            id="pros"
            name="pros"
            value={formData.pros}
            onChange={handleChange}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="What did you like about this gadget?"
          />
        </div>

        {/* Cons */}
        <div>
          <label
            htmlFor="cons"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Cons (Optional)
          </label>
          <textarea
            id="cons"
            name="cons"
            value={formData.cons}
            onChange={handleChange}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="What could be improved?"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
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
                Submitting...
              </div>
            ) : (
              "Submit Review"
            )}
          </button>
        </div>
      </form>

      <Alert
        type={alert.type}
        message={alert.message}
        show={alert.show}
        onClose={() => setAlert({ show: false, type: "", message: "" })}
      />
    </div>
  );
};

export default ReviewForm;
