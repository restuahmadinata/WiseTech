/**
 * Komponen GadgetDetail - Halaman detail gadget
 * 
 * Menampilkan informasi lengkap tentang gadget tertentu, termasuk:
 * - Gambar dan informasi dasar gadget
 * - Rating dan harga
 * - Deskripsi lengkap
 * - Spesifikasi teknis
 * - Daftar ulasan dari pengguna
 * - Form untuk menambahkan ulasan baru
 * 
 * API yang digunakan:
 * - GET /api/gadgets/:id - Untuk mengambil data gadget berdasarkan ID
 * - GET /api/gadgets/:id/reviews - Untuk mengambil ulasan gadget
 * - POST /api/reviews - Untuk mengirim ulasan baru
 */
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gadgetAPI, reviewAPI, authUtils } from '../../utils/api';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';

const GadgetDetail = () => {
  const { id } = useParams();
  const [gadget, setGadget] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [userReview, setUserReview] = useState({
    rating: 5,
    comment: '',
  });

  useEffect(() => {
    fetchGadgetDetails();
    fetchReviews();
  }, [id]);

  const fetchGadgetDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await gadgetAPI.getGadgetById(id);
      setGadget(response);
    } catch (err) {
      console.error('Error fetching gadget details:', err);
      setError('Failed to load gadget details. Please try again later.');
      
      // Fallback to mock data
      const mockGadget = {
        id: parseInt(id),
        name: id === '1' ? 'iPhone 15 Pro' : id === '2' ? 'Samsung Galaxy Book Pro' : id === '3' ? 'iPad Air' : 'Google Pixel 8',
        category: id === '1' || id === '4' ? 'Smartphones' : id === '2' ? 'Laptops' : 'Tablets',
        rating: id === '1' ? 4.8 : id === '2' ? 4.5 : id === '3' ? 4.7 : 4.6,
        price: id === '1' ? 999 : id === '2' ? 1299 : id === '3' ? 599 : 699,
        image_url: `https://placehold.co/600x400/4F46E5/FFFFFF?text=${id === '1' ? 'iPhone+15+Pro' : id === '2' ? 'Galaxy+Book+Pro' : id === '3' ? 'iPad+Air' : 'Pixel+8'}`,
        description: id === '1' 
          ? 'The latest iPhone with enhanced camera capabilities and powerful A17 chip. Featuring a stunning display, improved battery life, and the latest iOS features.'
          : id === '2'
          ? 'Ultra-thin laptop with stunning AMOLED display and all-day battery life. Perfect for creative professionals and business users who need a powerful yet portable device.'
          : id === '3'
          ? 'Powerful and versatile tablet with M1 chip and beautiful Retina display. Great for both productivity and entertainment with support for Apple Pencil and Magic Keyboard.'
          : 'Pure Android experience with outstanding camera quality and AI features. Known for its exceptional photo processing capabilities and clean software experience.',
        brand: id === '1' ? 'Apple' : id === '2' ? 'Samsung' : id === '3' ? 'Apple' : 'Google',
        release_date: '2023-09-22',
        specifications: {
          display: id === '1' ? '6.1" Super Retina XDR' : id === '2' ? '15.6" AMOLED FHD' : id === '3' ? '10.9" Liquid Retina' : '6.3" OLED FHD+',
          processor: id === '1' ? 'A17 Pro chip' : id === '2' ? 'Intel Core i7-1165G7' : id === '3' ? 'Apple M1' : 'Google Tensor G3',
          ram: id === '1' ? '8GB' : id === '2' ? '16GB' : id === '3' ? '8GB' : '8GB',
          storage: id === '1' ? '128GB/256GB/512GB/1TB' : id === '2' ? '512GB SSD' : id === '3' ? '64GB/256GB' : '128GB/256GB',
          camera: id === '1' ? 'Triple 48MP system' : id === '2' ? 'HD webcam' : id === '3' ? '12MP' : 'Dual 50MP system',
          battery: id === '1' ? '3,200 mAh' : id === '2' ? '68Wh' : id === '3' ? '28.6Wh' : '4,500 mAh'
        }
      };
      
      setGadget(mockGadget);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      console.log('Fetching reviews for gadget:', id);
      const response = await gadgetAPI.getGadgetReviews(id);
      console.log('✅ Reviews fetched:', response);
      setReviews(response || []);
    } catch (err) {
      console.error('❌ Error fetching reviews:', err);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setUserReview({
      ...userReview,
      [name]: name === 'rating' ? parseInt(value) : value,
    });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!authUtils.isAuthenticated()) {
      alert('Please log in to submit a review.');
      return;
    }

    if (!userReview.comment.trim()) {
      alert('Please write a comment for your review.');
      return;
    }

    try {
      setSubmittingReview(true);
      
      const reviewData = {
        gadget_id: parseInt(id),
        title: `Review for ${gadget?.name || 'this gadget'}`,
        content: userReview.comment.trim(),
        rating: userReview.rating,
        pros: '',
        cons: ''
      };

      await reviewAPI.createReview(reviewData);
      
      // Clear the form
      setUserReview({
        rating: 5,
        comment: '',
      });

      // Refresh reviews
      fetchReviews();
      
      alert('Review submitted successfully!');
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`h-5 w-5 ${
            i <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return stars;
  };

  // Helper function to format category
  const formatCategory = (category) => {
    const categoryMap = {
      'smartphone': 'Smartphones',
      'laptop': 'Laptops',
      'tablet': 'Tablets'
    };
    return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1);
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!gadget) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Gadget not found</h2>
          <p className="mt-2 text-gray-500">The gadget you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <div>
                <Link to="/" className="text-gray-400 hover:text-gray-500">
                  Home
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="flex-shrink-0 h-5 w-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
                <Link to={`/${gadget.category}`} className="ml-2 text-gray-400 hover:text-gray-500">
                  {formatCategory(gadget.category)}
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="flex-shrink-0 h-5 w-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
                <span className="ml-2 text-gray-500" aria-current="page">
                  {gadget.name}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Error message */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main product info */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 xl:gap-x-16">
          {/* Product image */}
          <div className="lg:max-w-lg lg:self-end">
            <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
              <img
                src={gadget.image_url || gadget.image || 'https://placehold.co/600x400/4F46E5/FFFFFF?text=' + encodeURIComponent(gadget.name)}
                alt={gadget.name}
                className="w-full h-full object-center object-cover"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/600x400/4F46E5/FFFFFF?text=' + encodeURIComponent(gadget.name);
                }}
              />
            </div>
          </div>

          {/* Product details */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{gadget.name}</h1>
            
            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl text-gray-900">${gadget.price}</p>
            </div>

            {/* Reviews */}
            <div className="mt-3">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {renderStars(Math.round(gadget.rating))}
                </div>
                <p className="sr-only">{gadget.rating} out of 5 stars</p>
                <span className="ml-2 text-sm text-gray-500">
                  {gadget.rating} out of 5 stars ({reviews.length} reviews)
                </span>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="text-base text-gray-700 space-y-6">
                <p>{gadget.description}</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center">
                <span className="text-sm text-gray-500">Brand:</span>
                <span className="ml-2 text-sm font-medium text-gray-900">{gadget.brand}</span>
              </div>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-500">Category:</span>
                <span className="ml-2 text-sm font-medium text-gray-900">{formatCategory(gadget.category)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        {gadget.specifications && (
          <div className="mt-16">
            <h2 className="text-2xl font-extrabold text-gray-900">Specifications</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Object.entries(gadget.specifications).map(([key, value]) => (
                <div key={key} className="border-t border-gray-200 pt-4">
                  <dt className="font-medium text-gray-900 capitalize">{key.replace('_', ' ')}</dt>
                  <dd className="mt-2 text-sm text-gray-500">{value}</dd>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews section */}
        <div className="mt-16">
          <h2 className="text-2xl font-extrabold text-gray-900">Reviews</h2>
          
          {/* Review form */}
          <div className="mt-6">
            <ReviewForm 
              gadgetId={id} 
              onReviewSubmitted={(newReview) => {
                setReviews(prev => [newReview, ...prev]);
                fetchReviews(); // Refresh reviews
              }} 
            />
          </div>

          {/* Reviews list */}
          <div className="mt-8">
            <ReviewList 
              reviews={reviews}
              loading={reviewsLoading}
              emptyMessage="No reviews yet. Be the first to review this gadget!"
              onEditReview={(review) => {
                // TODO: Implement edit functionality
                console.log('Edit review:', review);
              }}
              onDeleteReview={async (review) => {
                if (window.confirm('Are you sure you want to delete this review?')) {
                  try {
                    await reviewAPI.deleteReview(review.id);
                    setReviews(prev => prev.filter(r => r.id !== review.id));
                    alert('Review deleted successfully!');
                  } catch (error) {
                    console.error('Error deleting review:', error);
                    alert('Failed to delete review. Please try again.');
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GadgetDetail;
