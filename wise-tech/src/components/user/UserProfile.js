/**
 * Komponen UserProfile - Profil dan pengaturan pengguna dengan integrasi backend
 *
 * Fitur utama:
 * - Melihat dan mengedit informasi profil
 * - Melihat ulasan yang dibuat user
 * - Update bio dan informasi personal
 * - Integrasi penuh dengan backend API
 */

import React, { useState, useEffect } from "react";
import { userAPI, reviewAPI, authUtils } from "../../utils/api";
import ReviewList from "../gadgets/ReviewList";
import Alert from "../common/Alert";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [userReviews, setUserReviews] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    bio: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

  // Photo upload states
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Alert and confirmation states
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [deletePhotoModal, setDeletePhotoModal] = useState(false);
  const [deleteReviewModal, setDeleteReviewModal] = useState({
    show: false,
    review: null,
  });

  // Edit review modal states
  const [editReviewModal, setEditReviewModal] = useState({
    show: false,
    review: null,
  });
  const [editReviewForm, setEditReviewForm] = useState({
    title: "",
    content: "",
    rating: 5,
    pros: "",
    cons: "",
  });
  const [editReviewLoading, setEditReviewLoading] = useState(false);

  // Helper function to get full profile photo URL
  const getProfilePhotoUrl = (photoPath) => {
    if (!photoPath) return null;
    if (photoPath.startsWith("http")) return photoPath; // Already full URL
    return `http://localhost:8000${photoPath}`; // Add API base URL
  };

  // Load user profile when component mounts
  useEffect(() => {
    fetchUserProfile();
    fetchUserReviews();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("Fetching user profile from backend...");
      const profile = await userAPI.getProfile();

      console.log("✅ Profile fetched successfully:", profile);
      setUserData(profile);
      setFormData({
        full_name: profile.full_name || "",
        bio: profile.bio || "",
        email: profile.email || "",
      });
    } catch (err) {
      console.error("❌ Error fetching user profile:", err);
      setError("Failed to load profile. Please try again later.");

      // Fallback to stored user info
      const userInfo = authUtils.getUserInfo();
      const fallbackData = {
        id: userInfo.id || 1,
        email: userInfo.email || "user@example.com",
        full_name: userInfo.name || "User Name",
        bio: "No bio available",
        joined_date: new Date().toISOString(),
      };
      setUserData(fallbackData);
      setFormData({
        full_name: fallbackData.full_name,
        bio: fallbackData.bio,
        email: fallbackData.email,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReviews = async () => {
    try {
      console.log("Fetching user reviews from backend...");
      const reviews = await reviewAPI.getUserReviews();

      console.log("✅ User reviews fetched:", reviews);
      console.log("🔍 Current user info:", authUtils.getUserInfo());

      // Debug each review's user_id
      if (reviews && reviews.length > 0) {
        reviews.forEach((review, index) => {
          console.log(`Review ${index}:`, {
            id: review.id,
            title: review.title,
            user_id: review.user_id,
            user_id_type: typeof review.user_id,
            content: review.content?.substring(0, 50) + "...",
          });
        });
      }

      // Add current user data to each review to ensure user info is available
      const currentUserData = userData || authUtils.getUserInfo();
      const reviewsWithUserData = (reviews || []).map((review) => ({
        ...review,
        user: review.user || {
          id: currentUserData?.id,
          full_name: currentUserData?.full_name,
          username: currentUserData?.username,
          profile_photo: currentUserData?.profile_photo,
        },
        user_name:
          review.user_name ||
          currentUserData?.username ||
          currentUserData?.full_name,
      }));

      console.log("📝 Reviews with user data:", reviewsWithUserData);
      setUserReviews(reviewsWithUserData);
    } catch (err) {
      console.error("❌ Error fetching user reviews:", err);
      // Set empty array if API fails
      setUserReviews([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      console.log("Updating user profile:", formData);
      const updatedProfile = await userAPI.updateProfile(formData);

      console.log("✅ Profile updated successfully:", updatedProfile);
      setUserData(updatedProfile);
      setIsEditing(false);

      // Update stored user info
      authUtils.setUserInfo(updatedProfile);

      setAlert({
        show: true,
        type: "success",
        message: "Profile updated successfully!",
      });
    } catch (err) {
      console.error("❌ Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      full_name: userData.full_name || "",
      bio: userData.bio || "",
      email: userData.email || "",
    });
    setError("");
  };

  // Photo upload handlers
  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file.");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB.");
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload photo
      handlePhotoUpload(file);
    }
  };

  const handlePhotoUpload = async (file) => {
    try {
      setUploadingPhoto(true);
      setError("");

      console.log(
        "📸 Starting photo upload for:",
        file.name,
        "size:",
        file.size,
        "type:",
        file.type
      );
      const result = await userAPI.uploadProfilePhoto(file);

      console.log("✅ Photo uploaded successfully:", result);
      console.log("🔗 Photo URL from backend:", result.photo_url);

      // Update user data with new photo URL
      setUserData((prev) => ({
        ...prev,
        profile_photo: result.photo_url, // Use backend field name
      }));

      // Clear preview
      setPhotoPreview(null);

      // Dispatch custom event to notify Header about profile update
      window.dispatchEvent(
        new CustomEvent("profileUpdated", {
          detail: { profile_photo: result.photo_url },
        })
      );

      setAlert({
        show: true,
        type: "success",
        message: "Profile photo updated successfully!",
      });
    } catch (err) {
      console.error("❌ Error uploading photo:", err);
      console.error("❌ Error message:", err.message);
      console.error("❌ Error stack:", err.stack);
      setError("Failed to upload photo. Please try again.");
      setPhotoPreview(null);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePhotoDelete = async () => {
    setDeletePhotoModal(false);

    try {
      setUploadingPhoto(true);
      setError("");

      console.log("Deleting profile photo...");
      await userAPI.deleteProfilePhoto();

      console.log("✅ Photo deleted successfully");

      // Update user data to remove photo URL
      setUserData((prev) => ({
        ...prev,
        profile_photo: null, // Use backend field name
      }));

      // Dispatch custom event to notify Header about profile update
      window.dispatchEvent(
        new CustomEvent("profileUpdated", {
          detail: { profile_photo: null },
        })
      );

      setAlert({
        show: true,
        type: "success",
        message: "Profile photo deleted successfully!",
      });
    } catch (err) {
      console.error("❌ Error deleting photo:", err);
      setError("Failed to delete photo. Please try again.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleDeleteReview = async () => {
    const reviewToDelete = deleteReviewModal.review;
    setDeleteReviewModal({ show: false, review: null });

    try {
      await reviewAPI.deleteReview(reviewToDelete.id);
      setUserReviews((prev) => prev.filter((r) => r.id !== reviewToDelete.id));
      setAlert({
        show: true,
        type: "success",
        message: "Review deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting review:", error);
      setAlert({
        show: true,
        type: "error",
        message: "Failed to delete review. Please try again.",
      });
    }
  };

  // Handle edit review
  const handleEditReview = (review) => {
    setEditReviewModal({ show: true, review });
    setEditReviewForm({
      title: review.title || "",
      content: review.content || "",
      rating: review.rating || 5,
      pros: review.pros || "",
      cons: review.cons || "",
    });
  };

  const handleSaveReview = async () => {
    try {
      setEditReviewLoading(true);
      const reviewToEdit = editReviewModal.review;

      console.log("🔄 Saving review edit:", {
        reviewId: reviewToEdit.id,
        originalUser: reviewToEdit.user,
        originalUserName: reviewToEdit.user_name,
        formData: editReviewForm,
      });

      // Call API to update review
      const updatedReview = await reviewAPI.updateReview(
        reviewToEdit.id,
        editReviewForm
      );

      console.log("✅ Review updated from API:", updatedReview);

      // Update the review in the local state - preserve user data
      setUserReviews((prev) =>
        prev.map((review) => {
          if (review.id === reviewToEdit.id) {
            const currentUserData = userData || authUtils.getUserInfo();
            const updatedData = {
              ...review,
              ...updatedReview,
              // Preserve original user data including photo
              user: review.user || {
                id: currentUserData?.id,
                full_name: currentUserData?.full_name,
                username: currentUserData?.username,
                profile_photo: currentUserData?.profile_photo,
              },
              user_name:
                review.user_name ||
                currentUserData?.username ||
                currentUserData?.full_name,
            };
            console.log("🔄 Updated review data:", updatedData);
            return updatedData;
          }
          return review;
        })
      );

      // Close modal and show success message
      setEditReviewModal({ show: false, review: null });
      setAlert({
        show: true,
        type: "success",
        message: "Review updated successfully!",
      });
    } catch (error) {
      console.error("Error updating review:", error);
      setAlert({
        show: true,
        type: "error",
        message: "Failed to update review. Please try again.",
      });
    } finally {
      setEditReviewLoading(false);
    }
  };

  const handleCancelEditReview = () => {
    setEditReviewModal({ show: false, review: null });
    setEditReviewForm({
      title: "",
      content: "",
      rating: 5,
      pros: "",
      cons: "",
    });
  };

  // Helper function to format date
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">
                {error || "Failed to load profile"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-8">
            <div className="flex flex-col items-center text-center space-y-4 md:flex-row md:text-left md:space-y-0 md:space-x-6">
              {/* Profile Photo */}
              <div className="relative flex-shrink-0">
                {photoPreview ? (
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white relative">
                    <img
                      src={photoPreview}
                      alt="Photo preview"
                      className="w-full h-full object-cover"
                    />
                    {uploadingPhoto && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      </div>
                    )}
                  </div>
                ) : userData.profile_photo ? (
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white">
                    <img
                      src={getProfilePhotoUrl(userData.profile_photo)}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onLoad={() =>
                        console.log(
                          "✅ Profile photo loaded successfully:",
                          getProfilePhotoUrl(userData.profile_photo)
                        )
                      }
                      onError={(e) => {
                        console.error(
                          "❌ Failed to load profile photo:",
                          userData.profile_photo
                        );
                        console.error(
                          "❌ Full URL attempted:",
                          getProfilePhotoUrl(userData.profile_photo)
                        );
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    <div
                      className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-indigo-600 border-4 border-white shadow-lg"
                      style={{ display: "none" }}
                    >
                      {userData.full_name
                        ? userData.full_name[0].toUpperCase()
                        : userData.email[0].toUpperCase()}
                    </div>
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-indigo-600 border-4 border-white shadow-lg">
                    {(userData.full_name || userData.email)[0].toUpperCase()}
                  </div>
                )}

                {/* Photo upload/delete buttons */}
                <div className="absolute -bottom-2 -right-2 flex space-x-1">
                  <label
                    htmlFor="photo-upload"
                    className={`bg-white text-indigo-600 rounded-full p-2 shadow-lg cursor-pointer hover:bg-indigo-50 transition-colors ${
                      uploadingPhoto ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    title="Upload photo"
                  >
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
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </label>

                  {userData.profile_photo && (
                    <button
                      onClick={() => setDeletePhotoModal(true)}
                      disabled={uploadingPhoto}
                      className={`bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 transition-colors ${
                        uploadingPhoto ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      title="Delete photo"
                    >
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Hidden file input */}
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  disabled={uploadingPhoto}
                  className="hidden"
                />
              </div>

              <div className="text-white flex-1">
                <h1 className="text-3xl font-bold mb-2">
                  {userData.full_name || "User Profile"}
                </h1>
                <p className="text-indigo-100 text-lg mb-1">{userData.email}</p>
                <p className="text-indigo-200 text-sm">
                  Member since {formatDate(userData.joined_date)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "profile"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "reviews"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                My Reviews ({userReviews.length})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "profile" && (
              <div className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {/* Photo Upload Info */}
                {/* Profile Photo Info Card */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="text-center">
                    <div className="flex justify-center mb-3">
                      <svg
                        className="w-6 h-6 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">
                      Profile Photo
                    </h3>
                    <p className="text-sm text-blue-600 leading-relaxed max-w-md mx-auto">
                      Click the camera icon to upload a new profile photo.
                      <br />
                      <span className="font-medium">
                        Supported formats:
                      </span>{" "}
                      JPG, PNG, GIF
                      <br />
                      <span className="font-medium">Maximum size:</span> 5MB
                    </p>
                  </div>
                </div>

                {!isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <p className="mt-1 text-lg text-gray-900">
                        {userData.full_name || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <p className="mt-1 text-lg text-gray-900">
                        {userData.email}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Bio
                      </label>
                      <p className="mt-1 text-gray-700">
                        {userData.bio || "No bio provided"}
                      </p>
                    </div>
                    <div className="pt-4">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Edit Profile
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="full_name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="bio"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows={4}
                        value={formData.bio}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    <div className="flex space-x-4 pt-4">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors ${
                          saving ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <ReviewList
                  reviews={userReviews}
                  loading={false}
                  emptyMessage="You haven't written any reviews yet. Start exploring gadgets and share your thoughts!"
                  onEditReview={handleEditReview}
                  onDeleteReview={(review) => {
                    setDeleteReviewModal({ show: true, review });
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alert Component */}
      <Alert
        show={alert.show}
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ show: false, type: "", message: "" })}
      />

      {/* Delete Photo Confirmation Modal */}
      {deletePhotoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Delete Profile Photo
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete your profile photo? This action
              cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setDeletePhotoModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handlePhotoDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Review Confirmation Modal */}
      {deleteReviewModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Delete Review
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete this review? This action cannot be
              undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() =>
                  setDeleteReviewModal({ show: false, review: null })
                }
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteReview}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Review Modal */}
      {editReviewModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Edit Review
                </h3>
                <button
                  onClick={handleCancelEditReview}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Form */}
              <div className="space-y-6">
                {/* Review Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Title
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Give your review a title..."
                  />
                </div>

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
                        onClick={() =>
                          setEditReviewForm({ ...editReviewForm, rating: star })
                        }
                        className={`h-8 w-8 transition-colors ${
                          star <= editReviewForm.rating
                            ? "text-yellow-400 hover:text-yellow-500"
                            : "text-gray-300 hover:text-gray-400"
                        }`}
                      >
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {editReviewForm.rating}/5
                    </span>
                  </div>
                </div>

                {/* Review Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Content
                  </label>
                  <textarea
                    value={editReviewForm.content}
                    onChange={(e) =>
                      setEditReviewForm({
                        ...editReviewForm,
                        content: e.target.value,
                      })
                    }
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-vertical"
                    placeholder="Share your detailed thoughts about this gadget..."
                  />
                </div>

                {/* Pros */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pros (Optional)
                  </label>
                  <textarea
                    value={editReviewForm.pros}
                    onChange={(e) =>
                      setEditReviewForm({
                        ...editReviewForm,
                        pros: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-vertical"
                    placeholder="What did you like about this gadget?"
                  />
                </div>

                {/* Cons */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cons (Optional)
                  </label>
                  <textarea
                    value={editReviewForm.cons}
                    onChange={(e) =>
                      setEditReviewForm({
                        ...editReviewForm,
                        cons: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-vertical"
                    placeholder="What could be improved?"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCancelEditReview}
                  disabled={editReviewLoading}
                  className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveReview}
                  disabled={
                    editReviewLoading ||
                    !editReviewForm.title.trim() ||
                    !editReviewForm.content.trim()
                  }
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editReviewLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
