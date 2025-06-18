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
import { getProductPlaceholder } from '../../utils/placeholderImage';

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
  const [activeTab, setActiveTab] = useState('profile');

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
    <div className="min-h-screen bg-base-200 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Profile header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-primary">
              Your Profile
            </h1>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-primary"
              >
                Edit Profile
              </button>
            )}
          </div>
          
          {/* Profile tabs */}
          <div className="tabs tabs-boxed mb-6">
            <button 
              className={`tab ${activeTab === 'profile' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button 
              className={`tab ${activeTab === 'activity' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('activity')}
            >
              Activity
            </button>
          </div>
        </div>

        {/* Profile content */}
        {activeTab === 'profile' && (
          !isEditing ? (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div className="avatar">
                    <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      {userData.avatar ? (
                        <img src={URL.createObjectURL(userData.avatar)} alt="Profile" />
                      ) : (
                        <div className="bg-primary text-primary-content w-full h-full flex items-center justify-center text-4xl font-bold">
                          {userData.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-grow text-center sm:text-left">
                    <h2 className="text-2xl font-bold">{userData.name}</h2>
                    <p className="text-base-content/70">{userData.email}</p>
                    <div className="badge badge-outline mt-2">Member since {userData.joinDate}</div>
                    <div className="mt-4 bg-base-200 p-3 rounded-lg">
                      <p>{userData.bio || "No bio yet."}</p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <div className="badge badge-primary badge-lg gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                        </svg>
                        6 Reviews
                      </div>
                      <div className="badge badge-secondary badge-lg gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                        </svg>
                        3 Comments
                      </div>
                    </div>
                  </div>
                </div>

                <div className="divider"></div>

                <h3 className="text-lg font-semibold mb-3">Preferences</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                    <span>Receive notifications</span>
                    <div className={`badge ${userData.preferences.notifications ? 'badge-success' : 'badge-error'}`}>
                      {userData.preferences.notifications ? 'On' : 'Off'}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                    <span>Subscribe to newsletter</span>
                    <div className={`badge ${userData.preferences.newsletter ? 'badge-success' : 'badge-error'}`}>
                      {userData.preferences.newsletter ? 'On' : 'Off'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex flex-col items-center">
                    <div className="avatar">
                      <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        {filePreview ? (
                          <img src={filePreview} alt="Profile Preview" />
                        ) : userData.avatar ? (
                          <img src={URL.createObjectURL(userData.avatar)} alt="Profile" />
                        ) : (
                          <div className="bg-primary text-primary-content w-full h-full flex items-center justify-center text-4xl font-bold">
                            {formData.name.charAt(0)}
                          </div>
                        )}
                      </div>
                    </div>
                    <label className="btn btn-sm btn-outline btn-primary mt-3">
                      Change Photo
                      <input
                        id="avatar"
                        name="avatar"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  
                  <div className="flex-grow">
                    <div className="grid grid-cols-1 gap-6">
                      <label className="form-control w-full">
                        <div className="label">
                          <span className="label-text">Name</span>
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="input input-bordered w-full"
                          required
                        />
                      </label>
                      
                      <label className="form-control w-full">
                        <div className="label">
                          <span className="label-text">Email</span>
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="input input-bordered w-full"
                          required
                        />
                      </label>
                      
                      <label className="form-control w-full">
                        <div className="label">
                          <span className="label-text">Bio</span>
                        </div>
                        <textarea
                          name="bio"
                          rows={3}
                          value={formData.bio}
                          onChange={handleChange}
                          className="textarea textarea-bordered w-full"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="divider"></div>

                <h3 className="text-lg font-semibold mb-3">Preferences</h3>
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-3">
                    <input
                      type="checkbox"
                      name="notifications"
                      className="checkbox checkbox-primary"
                      checked={formData.preferences.notifications}
                      onChange={handleChange}
                    />
                    <span className="label-text">Receive notifications</span>
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-3">
                    <input
                      type="checkbox"
                      name="newsletter"
                      className="checkbox checkbox-primary"
                      checked={formData.preferences.newsletter}
                      onChange={handleChange}
                    />
                    <span className="label-text">Subscribe to newsletter</span>
                  </label>
                </div>

                <div className="card-actions justify-end mt-6">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? <span className="loading loading-spinner loading-sm"></span> : null}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          )
        )}

        {/* Recent Activity Section */}
        {activeTab === 'activity' && (
          <div className="card bg-base-100 shadow-xl overflow-hidden">
            <div className="card-body p-0">
              <ul className="menu bg-base-100 w-full p-0">
                <li className="border-b border-base-200">
                  <div className="flex items-center py-3 px-4">
                    <div className="avatar mr-4">
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold">
                        R
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">
                        You reviewed iPhone 15 Pro
                      </p>
                      <p className="text-sm opacity-70">
                        "Amazing camera quality and performance!"
                      </p>
                      <div className="rating rating-sm mt-1">
                        <input type="radio" name="rating-1" className="mask mask-star-2 bg-orange-400" readOnly checked />
                        <input type="radio" name="rating-1" className="mask mask-star-2 bg-orange-400" readOnly checked />
                        <input type="radio" name="rating-1" className="mask mask-star-2 bg-orange-400" readOnly checked />
                        <input type="radio" name="rating-1" className="mask mask-star-2 bg-orange-400" readOnly checked />
                        <input type="radio" name="rating-1" className="mask mask-star-2 bg-orange-400" readOnly checked />
                      </div>
                      <div className="badge badge-sm mt-1">2 days ago</div>
                    </div>
                  </div>
                </li>
                <li className="border-b border-base-200">
                  <div className="flex items-center py-3 px-4">
                    <div className="avatar mr-4">
                      <div className="w-12 h-12 rounded-full bg-secondary text-secondary-content flex items-center justify-center font-bold">
                        C
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">
                        You commented on Samsung Galaxy Book Pro review
                      </p>
                      <p className="text-sm opacity-70">
                        "How's the battery life compared to the previous model?"
                      </p>
                      <div className="badge badge-sm mt-1">5 days ago</div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="flex items-center py-3 px-4">
                    <div className="avatar mr-4">
                      <div className="w-12 h-12 rounded-full bg-accent text-accent-content flex items-center justify-center font-bold">
                        L
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">
                        You liked iPad Air review
                      </p>
                      <p className="text-sm opacity-70">
                        Review by Sarah Smith
                      </p>
                      <div className="badge badge-sm mt-1">1 week ago</div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
