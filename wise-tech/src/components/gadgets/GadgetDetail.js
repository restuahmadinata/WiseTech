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
 * API yang dibutuhkan:
 * - GET /api/gadgets/:id - Untuk mengambil data gadget berdasarkan ID
 * - GET /api/gadgets/:id/reviews - Untuk mengambil ulasan gadget
 * - POST /api/reviews - Untuk mengirim ulasan baru
 * 
 * Data yang dibutuhkan dari backend:
 * - Detail gadget (nama, brand, harga, deskripsi, spesifikasi)
 * - Informasi rating (rata-rata rating dan jumlah ulasan)
 * - Daftar ulasan dengan informasi pengguna
 */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const GadgetDetail = () => {
  const { id } = useParams();
  const [gadget, setGadget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userReview, setUserReview] = useState({
    rating: 5,
    comment: '',
  });

  useEffect(() => {
    // In a real application, this would be an API call
    const fetchGadget = async () => {
      try {
        // Simulating an API call with setTimeout
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data for demonstration
        const mockGadget = {
          id: parseInt(id),
          name: id === '1' ? 'iPhone 15 Pro' : id === '2' ? 'Samsung Galaxy Book Pro' : id === '3' ? 'iPad Air' : 'Google Pixel 8',
          category: id === '1' || id === '4' ? 'Smartphones' : id === '2' ? 'Laptops' : 'Tablets',
          rating: id === '1' ? 4.8 : id === '2' ? 4.5 : id === '3' ? 4.7 : 4.6,
          price: id === '1' ? 999 : id === '2' ? 1299 : id === '3' ? 599 : 699,
          image: `https://placehold.co/600x400/4F46E5/FFFFFF?text=${id === '1' ? 'iPhone+15+Pro' : id === '2' ? 'Galaxy+Book+Pro' : id === '3' ? 'iPad+Air' : 'Pixel+8'}`,
          description: id === '1' 
            ? 'The latest iPhone with enhanced camera capabilities and powerful A17 chip. Featuring a stunning display, improved battery life, and the latest iOS features.'
            : id === '2'
            ? 'Ultra-thin laptop with stunning AMOLED display and all-day battery life. Perfect for creative professionals and business users who need a powerful yet portable device.'
            : id === '3'
            ? 'Powerful and versatile tablet with M1 chip and beautiful Retina display. Great for both productivity and entertainment with support for Apple Pencil and Magic Keyboard.'
            : 'Pure Android experience with outstanding camera quality and AI features. Known for its exceptional photo processing capabilities and clean software experience.',
          specs: id === '1' 
            ? [
                { name: 'Display', value: '6.1" Super Retina XDR' },
                { name: 'Processor', value: 'A17 Pro chip' },
                { name: 'RAM', value: '8GB' },
                { name: 'Storage', value: '128GB/256GB/512GB/1TB' },
                { name: 'Camera', value: 'Triple 48MP system' },
                { name: 'Battery', value: '3,200 mAh' },
              ]
            : id === '2'
            ? [
                { name: 'Display', value: '15.6" AMOLED FHD' },
                { name: 'Processor', value: 'Intel Core i7-1165G7' },
                { name: 'RAM', value: '16GB' },
                { name: 'Storage', value: '512GB SSD' },
                { name: 'Graphics', value: 'Intel Iris Xe' },
                { name: 'Battery', value: '68Wh' },
              ]
            : id === '3'
            ? [
                { name: 'Display', value: '10.9" Liquid Retina' },
                { name: 'Processor', value: 'Apple M1' },
                { name: 'RAM', value: '8GB' },
                { name: 'Storage', value: '64GB/256GB' },
                { name: 'Camera', value: '12MP' },
                { name: 'Battery', value: '28.6Wh' },
              ]
            : [
                { name: 'Display', value: '6.3" OLED FHD+' },
                { name: 'Processor', value: 'Google Tensor G3' },
                { name: 'RAM', value: '8GB' },
                { name: 'Storage', value: '128GB/256GB' },
                { name: 'Camera', value: 'Dual 50MP system' },
                { name: 'Battery', value: '4,500 mAh' },
              ],
          reviews: [
            {
              id: 1,
              user: 'John Doe',
              rating: 5,
              comment: 'This is an amazing device that exceeded my expectations in every way!',
              date: '2023-05-15',
            },
            {
              id: 2,
              user: 'Sarah Johnson',
              rating: 4,
              comment: 'Very good overall, but there are a few minor issues that could be improved.',
              date: '2023-06-02',
            },
            {
              id: 3,
              user: 'Michael Smith',
              rating: 5,
              comment: 'Absolutely worth every penny. The performance is outstanding!',
              date: '2023-06-10',
            },
          ]
        };
        
        setGadget(mockGadget);
      } catch (error) {
        console.error('Error fetching gadget details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGadget();
  }, [id]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setUserReview({
      ...userReview,
      [name]: name === 'rating' ? parseInt(value) : value,
    });
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    
    // In a real application, this would be an API call to save the review
    alert('Review submitted successfully!');
    
    // Clear the form
    setUserReview({
      rating: 5,
      comment: '',
    });
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
                <a href="/" className="text-gray-400 hover:text-gray-500">
                  Home
                </a>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="flex-shrink-0 h-5 w-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
                <a href={`/${gadget.category.toLowerCase()}`} className="ml-2 text-gray-400 hover:text-gray-500">
                  {gadget.category}
                </a>
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

        {/* Product details */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* Product image */}
          <div className="lg:max-w-lg lg:self-end">
            <div className="rounded-lg overflow-hidden">
              <img
                src={gadget.image}
                alt={gadget.name}
                className="w-full h-full object-center object-cover"
              />
            </div>
          </div>

          {/* Product info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{gadget.name}</h1>
            
            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl text-gray-900">${gadget.price}</p>
            </div>

            <div className="mt-3">
              <div className="flex items-center">
                <div className="flex items-center">
                  {renderStars(Math.round(gadget.rating))}
                </div>
                <p className="ml-2 text-sm text-gray-600">{gadget.rating} out of 5 stars</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <p className="text-base text-gray-700">{gadget.description}</p>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-8">
              <h2 className="text-lg font-medium text-gray-900">Specifications</h2>

              <div className="mt-4 prose prose-sm text-gray-500">
                <table className="min-w-full">
                  <tbody>
                    {gadget.specs.map((spec, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">{spec.name}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Write a Review
              </button>
            </div>
          </div>
        </div>

        {/* Reviews section */}
        <section className="mt-16">
          <h2 className="text-xl font-medium text-gray-900">Customer Reviews</h2>
          
          {/* Review form */}
          <div className="mt-8 bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900">Write a Review</h3>
            <form onSubmit={handleSubmitReview} className="mt-4">
              <div className="mb-4">
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating</label>
                <select
                  id="rating"
                  name="rating"
                  value={userReview.rating}
                  onChange={handleReviewChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Your Review</label>
                <textarea
                  id="comment"
                  name="comment"
                  rows="4"
                  value={userReview.comment}
                  onChange={handleReviewChange}
                  placeholder="Share your thoughts about this product..."
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                ></textarea>
              </div>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit Review
              </button>
            </form>
          </div>
          
          {/* Reviews list */}
          <div className="mt-8 space-y-6">
            {gadget.reviews.map((review) => (
              <div key={review.id} className="border-t border-gray-200 pt-6">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                    <p className="text-white font-medium">{review.user.charAt(0)}</p>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900">{review.user}</h4>
                    <div className="mt-1 flex items-center">
                      {renderStars(review.rating)}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{review.date}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-base text-gray-700">
                    {review.comment}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default GadgetDetail;
