/**
 * Komponen Home - Halaman beranda aplikasi
 * 
 * Fitur utama:
 * - Hero section dengan banner utama
 * - Daftar gadget unggulan berdasarkan rating tertinggi dan review terbanyak
 * - Ulasan terbaru dari pengguna
 * - Navigasi ke kategori gadget (smartphones, laptops, tablets)
 * 
 * API yang digunakan:
 * - GET /api/gadgets/all - Mengambil semua gadget untuk kalkulasi featured
 * - GET /api/reviews/recent - Mengambil ulasan terbaru
 * 
 * Logic Featured Gadgets:
 * 1. Mengambil semua gadget dengan getAllGadgets()
 * 2. Filter gadget yang memiliki rating dan review
 * 3. Sort berdasarkan rating tertinggi, kemudian jumlah review terbanyak
 * 4. Ambil 4 gadget teratas sebagai featured
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gadgetAPI, reviewAPI } from '../../utils/api';

const Home = () => {
  // State for data
  const [featuredGadgets, setFeaturedGadgets] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to get full profile photo URL
  const getProfilePhotoUrl = (photoPath) => {
    if (!photoPath) return null;
    if (photoPath.startsWith('http')) return photoPath; // Already full URL
    return `http://localhost:8000${photoPath}`; // Add API base URL
  };

  // Debug log
  useEffect(() => {
    console.log('Home component mounted, fetching data from backend...');
  }, []);

  // Load data from API when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching all gadgets to calculate featured based on rating and reviews...');
        console.log('Fetching recent reviews from:', 'http://localhost:8000/api/reviews/recent');

        // Fetch all gadgets and recent reviews simultaneously
        const [allGadgetsResponse, reviewsResponse] = await Promise.all([
          gadgetAPI.getAllGadgets(50), // Get up to 50 gadgets to calculate featured
          reviewAPI.getRecentReviews(6) // Get 6 recent reviews
        ]);

        console.log('All gadgets response:', allGadgetsResponse);
        console.log('Recent reviews response:', reviewsResponse);

        // Calculate featured gadgets based on rating and review count
        let featuredList = [];
        if (allGadgetsResponse && allGadgetsResponse.length > 0) {
          // Sort gadgets by a combination of rating and review count
          featuredList = allGadgetsResponse
            .filter(gadget => gadget.average_rating > 0) // Only gadgets with rating > 0
            .sort((a, b) => {
              // Primary sort: average rating (higher is better)
              const ratingDiff = (b.average_rating || 0) - (a.average_rating || 0);
              if (Math.abs(ratingDiff) > 0.1) return ratingDiff;
              
              // Secondary sort: review count (more reviews is better, but treat 0 as having some value)
              return (b.review_count || 0) - (a.review_count || 0);
            })
            .slice(0, 4); // Take top 4 as featured
          
          // If no gadgets have good ratings, just take first 4 gadgets
          if (featuredList.length === 0) {
            featuredList = allGadgetsResponse.slice(0, 4);
          }

          // Fetch real review count for featured gadgets to show accurate data
          try {
            const featuredWithRealCounts = await Promise.all(
              featuredList.map(async (gadget) => {
                try {
                  const reviews = await gadgetAPI.getGadgetReviews(gadget.id);
                  return {
                    ...gadget,
                    real_review_count: reviews ? reviews.length : 0
                  };
                } catch (err) {
                  console.warn(`Failed to fetch reviews for gadget ${gadget.id}:`, err);
                  return {
                    ...gadget,
                    real_review_count: gadget.review_count || 0
                  };
                }
              })
            );
            featuredList = featuredWithRealCounts;
          } catch (err) {
            console.warn('Failed to fetch real review counts:', err);
          }
        }

        setFeaturedGadgets(featuredList);
        setRecentReviews(reviewsResponse || []);
        
        if (featuredList.length > 0) {
          console.log('✅ Successfully calculated', featuredList.length, 'featured gadgets based on rating and reviews');
          console.log('Featured gadgets:', featuredList.map(g => ({
            name: g.name,
            rating: g.average_rating,
            reviews: g.review_count
          })));
        } else {
          console.log('⚠️ No gadgets found to feature');
        }
        
        if (reviewsResponse && reviewsResponse.length > 0) {
          console.log('✅ Successfully loaded', reviewsResponse.length, 'recent reviews from backend');
        } else {
          console.log('⚠️ No recent reviews found from backend');
        }
        
      } catch (err) {
        console.error('❌ Error fetching data from backend:', err);
        setError(`Failed to load data: ${err.message}. Please check if the backend is running on http://localhost:8000`);
        
        // Keep empty arrays to clearly show backend integration is required
        setFeaturedGadgets([]);
        setRecentReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
      return date.toLocaleDateString();
    } catch (error) {
      return 'Recently';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading data from backend...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-red-800 mb-2">Failed to Load Data</h3>
              <p className="text-red-600 text-sm mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Amazing <span className="text-yellow-400">Gadgets</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Find honest reviews and discover the perfect tech for your needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/search" 
                className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-colors"
              >
                Browse Gadgets
              </Link>
              <Link 
                to="/browse-reviews" 
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors"
              >
                Read Reviews
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Gadgets Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Gadgets
            </h2>
            <p className="text-xl text-gray-600">
              Top-rated devices based on user reviews and ratings
            </p>
          </div>

          {featuredGadgets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredGadgets.map((gadget) => (
                <Link
                  key={gadget.id}
                  to={`/gadget/${gadget.id}`}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  <div className="aspect-w-16 aspect-h-12 overflow-hidden">
                    <img
                      src={gadget.image_url || `https://placehold.co/400x300/4F46E5/FFFFFF?text=${encodeURIComponent(gadget.name)}`}
                      alt={gadget.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {gadget.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {gadget.description || 'No description available.'}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <div className="flex text-yellow-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={star <= Math.round(gadget.average_rating || 0) ? 'text-yellow-400' : 'text-gray-300'}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-1">
                          {(gadget.average_rating || 0).toFixed(1)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {gadget.real_review_count || gadget.review_count || 0} reviews
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No featured gadgets available from backend.</p>
              <p className="text-sm text-gray-500 mt-2">Featured gadgets will appear here once data is loaded from the backend.</p>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-xl text-gray-600">
              Find exactly what you're looking for
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link
              to="/search"
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 p-8 text-white hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105"
            >
              <div className="relative z-10">
                <div className="w-16 h-16 mb-4 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Browse Gadgets</h3>
                <p className="text-purple-100">Search and filter all gadgets</p>
              </div>
            </Link>

            <Link
              to="/laptops"
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-600 to-teal-600 p-8 text-white hover:from-green-700 hover:to-teal-700 transition-all transform hover:scale-105"
            >
              <div className="relative z-10">
                <div className="w-16 h-16 mb-4 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Laptops</h3>
                <p className="text-green-100">Powerful computing solutions</p>
              </div>
            </Link>

            <Link
              to="/tablets"
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-600 to-red-600 p-8 text-white hover:from-orange-700 hover:to-red-700 transition-all transform hover:scale-105"
            >
              <div className="relative z-10">
                <div className="w-16 h-16 mb-4 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2H5zm0 2h10v12H5V4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Tablets</h3>
                <p className="text-orange-100">Portable productivity and entertainment</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Reviews Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Recent Reviews
            </h2>
            <p className="text-xl text-gray-600">
              See what our community is saying
            </p>
          </div>

          {recentReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentReviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                      {review.user?.profile_photo ? (
                        <img
                          src={getProfilePhotoUrl(review.user.profile_photo)} 
                          alt={review.user?.full_name || review.user_name || 'User'}
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className={`w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold ${review.user?.profile_photo ? 'hidden' : 'flex'}`}
                      >
                        {(review.user?.full_name || review.user_name || 'U').charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {review.user?.full_name || review.user_name || 'Anonymous'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(review.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="flex items-center mb-1">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {review.rating}/5
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {review.title}
                    </p>
                    <p className="text-sm font-medium text-blue-600">
                      {review.gadget?.name || 'Unknown Gadget'}
                    </p>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {review.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No recent reviews available from backend.</p>
              <p className="text-sm text-gray-500 mt-2">Reviews will appear here once users start reviewing gadgets.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
