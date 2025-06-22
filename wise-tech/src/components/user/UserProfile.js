/**
 * Komponen UserProfile - Profil dan pengaturan pengguna dengan integrasi backend
 * 
 * Fitur utama:
 * - Melihat dan mengedit informasi profil
 * - Melihat ulasan yang dibuat user
 * - Update bio dan informasi personal
 * - Integrasi penuh dengan backend API
 */

import React, { useState, useEffect } from 'react';
import { userAPI, reviewAPI, authUtils } from '../../utils/api';
import ReviewList from '../gadgets/ReviewList';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [userReviews, setUserReviews] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    email: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  
  // Photo upload states
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Helper function to get full profile photo URL
  const getProfilePhotoUrl = (photoPath) => {
    if (!photoPath) return null;
    if (photoPath.startsWith('http')) return photoPath; // Already full URL
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
      setError('');
      
      console.log('Fetching user profile from backend...');
      const profile = await userAPI.getProfile();
      
      console.log('✅ Profile fetched successfully:', profile);
      setUserData(profile);
      setFormData({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        email: profile.email || ''
      });
    } catch (err) {
      console.error('❌ Error fetching user profile:', err);
      setError('Failed to load profile. Please try again later.');
      
      // Fallback to stored user info
      const userInfo = authUtils.getUserInfo();
      const fallbackData = {
        id: userInfo.id || 1,
        email: userInfo.email || 'user@example.com',
        full_name: userInfo.name || 'User Name',
        bio: 'No bio available',
        joined_date: new Date().toISOString(),
      };
      setUserData(fallbackData);
      setFormData({
        full_name: fallbackData.full_name,
        bio: fallbackData.bio,
        email: fallbackData.email
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReviews = async () => {
    try {
      console.log('Fetching user reviews from backend...');
      const reviews = await reviewAPI.getUserReviews();
      
      console.log('✅ User reviews fetched:', reviews);
      setUserReviews(reviews || []);
    } catch (err) {
      console.error('❌ Error fetching user reviews:', err);
      // Set empty array if API fails
      setUserReviews([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      
      console.log('Updating user profile:', formData);
      const updatedProfile = await userAPI.updateProfile(formData);
      
      console.log('✅ Profile updated successfully:', updatedProfile);
      setUserData(updatedProfile);
      setIsEditing(false);
      
      // Update stored user info
      authUtils.setUserInfo(updatedProfile);
      
      alert('Profile updated successfully!');
      
    } catch (err) {
      console.error('❌ Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      full_name: userData.full_name || '',
      bio: userData.bio || '',
      email: userData.email || ''
    });
    setError('');
  };

  // Photo upload handlers
  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file.');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB.');
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
      setError('');
      
      console.log('📸 Starting photo upload for:', file.name, 'size:', file.size, 'type:', file.type);
      const result = await userAPI.uploadProfilePhoto(file);
      
      console.log('✅ Photo uploaded successfully:', result);
      console.log('🔗 Photo URL from backend:', result.photo_url);
      
      // Update user data with new photo URL
      setUserData(prev => ({
        ...prev,
        profile_photo: result.photo_url // Use backend field name
      }));
      
      // Clear preview
      setPhotoPreview(null);
      
      // Dispatch custom event to notify Header about profile update
      window.dispatchEvent(new CustomEvent('profileUpdated', {
        detail: { profile_photo: result.photo_url }
      }));
      
      alert('Profile photo updated successfully!');
      
    } catch (err) {
      console.error('❌ Error uploading photo:', err);
      console.error('❌ Error message:', err.message);
      console.error('❌ Error stack:', err.stack);
      setError('Failed to upload photo. Please try again.');
      setPhotoPreview(null);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePhotoDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your profile photo?')) {
      return;
    }
    
    try {
      setUploadingPhoto(true);
      setError('');
      
      console.log('Deleting profile photo...');
      await userAPI.deleteProfilePhoto();
      
      console.log('✅ Photo deleted successfully');
      
      // Update user data to remove photo URL
      setUserData(prev => ({
        ...prev,
        profile_photo: null // Use backend field name
      }));
      
      // Dispatch custom event to notify Header about profile update
      window.dispatchEvent(new CustomEvent('profileUpdated', {
        detail: { profile_photo: null }
      }));
      
      alert('Profile photo deleted successfully!');
      
    } catch (err) {
      console.error('❌ Error deleting photo:', err);
      setError('Failed to delete photo. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Helper function to format date
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
              <span className="block sm:inline">{error || 'Failed to load profile'}</span>
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
                      onLoad={() => console.log('✅ Profile photo loaded successfully:', getProfilePhotoUrl(userData.profile_photo))}
                      onError={(e) => {
                        console.error('❌ Failed to load profile photo:', userData.profile_photo);
                        console.error('❌ Full URL attempted:', getProfilePhotoUrl(userData.profile_photo));
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-indigo-600 border-4 border-white shadow-lg" style={{display: 'none'}}>
                      {userData.full_name ? userData.full_name[0].toUpperCase() : userData.email[0].toUpperCase()}
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
                      uploadingPhoto ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    title="Upload photo"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </label>
                  
                  {userData.profile_photo && (
                    <button
                      onClick={handlePhotoDelete}
                      disabled={uploadingPhoto}
                      className={`bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 transition-colors ${
                        uploadingPhoto ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      title="Delete photo"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
                <h1 className="text-3xl font-bold mb-2">{userData.full_name || 'User Profile'}</h1>
                <p className="text-indigo-100 text-lg mb-1">{userData.email}</p>
                <p className="text-indigo-200 text-sm">Member since {formatDate(userData.joined_date)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reviews'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Reviews ({userReviews.length})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'profile' && (
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
                      <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Profile Photo</h3>
                    <p className="text-sm text-blue-600 leading-relaxed max-w-md mx-auto">
                      Click the camera icon to upload a new profile photo.<br/>
                      <span className="font-medium">Supported formats:</span> JPG, PNG, GIF<br/>
                      <span className="font-medium">Maximum size:</span> 5MB
                    </p>
                  </div>
                </div>

                {!isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <p className="mt-1 text-lg text-gray-900">{userData.full_name || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-lg text-gray-900">{userData.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Bio</label>
                      <p className="mt-1 text-gray-700">{userData.bio || 'No bio provided'}</p>
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
                      <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
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
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
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
                          saving ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
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

            {activeTab === 'reviews' && (
              <div>
                <ReviewList
                  reviews={userReviews}
                  loading={false}
                  emptyMessage="You haven't written any reviews yet. Start exploring gadgets and share your thoughts!"
                  onEditReview={(review) => {
                    // TODO: Implement edit functionality
                    console.log('Edit review:', review);
                    alert('Edit functionality coming soon!');
                  }}
                  onDeleteReview={async (review) => {
                    if (window.confirm('Are you sure you want to delete this review?')) {
                      try {
                        await reviewAPI.deleteReview(review.id);
                        setUserReviews(prev => prev.filter(r => r.id !== review.id));
                        alert('Review deleted successfully!');
                      } catch (error) {
                        console.error('Error deleting review:', error);
                        alert('Failed to delete review. Please try again.');
                      }
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
