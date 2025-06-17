/**
 * Komponen UserProfile - Profil dan pengaturan pengguna
 * 
 * Fitur utama:
 * - Melihat informasi profil pengguna (nama, email, foto profil, bio)
 * - Mengedit informasi profil dan mengunggah foto baru
 * - Mengelola preferensi notifikasi
 * - Melihat aktivitas terkini (ulasan, komentar, like)
 * 
 * API yang dibutuhkan:
 * - GET /api/users/profile - Mengambil data profil pengguna saat ini
 * - PUT /api/users/profile - Memperbarui data profil pengguna
 * - GET /api/users/:id/activity - Mengambil aktivitas terbaru pengguna
 * 
 * Format data profil yang diharapkan dari API:
 * {
 *   name: string,
 *   email: string,
 *   joinDate: string (format tanggal),
 *   avatar: string (URL),
 *   bio: string,
 *   preferences: {
 *     notifications: boolean,
 *     newsletter: boolean
 *   }
 * }
 * 
 * Format data aktivitas yang diharapkan dari API:
 * Array dari objek aktivitas (ulasan, komentar, like) dengan properti:
 * type, date, targetName, content, rating (opsional)
 */
import React, { useState } from 'react';

const UserProfile = () => {
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    joinDate: 'January 15, 2025',
    avatar: null,
    bio: 'Tech enthusiast and gadget lover.',
    preferences: {
      notifications: true,
      newsletter: true
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({...userData});
  const [filePreview, setFilePreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData, 
        preferences: {
          ...formData.preferences,
          [name]: checked
        }
      });
    } else if (name === 'bio') {
      setFormData({...formData, [name]: value});
    } else {
      setFormData({...formData, [name]: value});
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({...formData, avatar: file});
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // In a real app, this would be an API call to update the user profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUserData(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({...userData});
    setFilePreview(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Profile header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
            Your Profile
          </h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-lg font-medium ${
              isEditing
                ? 'bg-gray-200 text-gray-700'
                : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700'
            } transition-all duration-300`}
            disabled={isEditing}
          >
            {isEditing ? 'Editing...' : 'Edit Profile'}
          </button>
        </div>

        {/* Profile content */}
        {!isEditing ? (
          <div className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg p-6 rounded-xl shadow-md">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="flex-shrink-0 w-32 h-32 rounded-full overflow-hidden bg-gradient-to-r from-indigo-400 to-purple-500 shadow-lg">
                {userData.avatar ? (
                  <img src={URL.createObjectURL(userData.avatar)} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                    {userData.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-grow text-center sm:text-left">
                <h2 className="text-2xl font-bold text-gray-800">{userData.name}</h2>
                <p className="text-gray-600">{userData.email}</p>
                <p className="text-sm text-gray-500 mt-1">Member since {userData.joinDate}</p>
                <div className="mt-4 p-3 rounded-lg bg-indigo-50">
                  <p className="text-gray-700">{userData.bio || "No bio yet."}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <div className="px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-medium">
                    6 Reviews
                  </div>
                  <div className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium">
                    3 Comments
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Preferences</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Receive notifications</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    userData.preferences.notifications
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {userData.preferences.notifications ? 'On' : 'Off'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Subscribe to newsletter</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    userData.preferences.newsletter
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {userData.preferences.newsletter ? 'On' : 'Off'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg p-6 rounded-xl shadow-md">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-r from-indigo-400 to-purple-500 relative">
                  {filePreview ? (
                    <img src={filePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                  ) : userData.avatar ? (
                    <img src={URL.createObjectURL(userData.avatar)} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                      {formData.name.charAt(0)}
                    </div>
                  )}
                </div>
                <label htmlFor="avatar" className="mt-3 cursor-pointer text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  Change photo
                  <input
                    id="avatar"
                    name="avatar"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              <div className="flex-grow">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-indigo-700">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-indigo-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-indigo-700">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={3}
                      value={formData.bio}
                      onChange={handleChange}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="notifications"
                    name="notifications"
                    type="checkbox"
                    checked={formData.preferences.notifications}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="notifications" className="ml-2 block text-sm text-gray-700">
                    Receive notifications
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="newsletter"
                    name="newsletter"
                    type="checkbox"
                    checked={formData.preferences.newsletter}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-700">
                    Subscribe to newsletter
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        {/* Recent Activity Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-4">
            Recent Activity
          </h2>
          <div className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg rounded-xl shadow-md overflow-hidden">
            <ul className="divide-y divide-gray-200">
              <li className="p-4 hover:bg-indigo-50 transition-colors duration-150">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    R
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      You reviewed iPhone 15 Pro
                    </p>
                    <p className="text-sm text-gray-500">
                      "Amazing camera quality and performance!"
                    </p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    2 days ago
                  </div>
                </div>
              </li>
              <li className="p-4 hover:bg-indigo-50 transition-colors duration-150">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    C
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      You commented on Samsung Galaxy Book Pro review
                    </p>
                    <p className="text-sm text-gray-500">
                      "How's the battery life compared to the previous model?"
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    5 days ago
                  </div>
                </div>
              </li>
              <li className="p-4 hover:bg-indigo-50 transition-colors duration-150">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold">
                    L
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      You liked iPad Air review
                    </p>
                    <p className="text-sm text-gray-500">
                      Review by Sarah Smith
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    1 week ago
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
