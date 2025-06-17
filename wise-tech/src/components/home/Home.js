/**
 * Komponen Home - Halaman beranda aplikasi
 * 
 * Fitur utama:
 * - Hero section dengan banner utama
 * - Daftar gadget unggulan (featured)
 * - Ulasan terbaru dari pengguna
 * - Navigasi ke kategori gadget (smartphones, laptops, tablets)
 * 
 * API yang dibutuhkan:
 * - GET /api/gadgets/featured - Mengambil gadget unggulan
 * - GET /api/reviews/recent - Mengambil ulasan terbaru
 * 
 * Format data gadget unggulan yang diharapkan dari API:
 * Array dari objek gadget dengan properti minimum:
 * id, name, category, rating, image, description
 * 
 * Format data ulasan terbaru yang diharapkan dari API:
 * Array dari objek review dengan properti minimum:
 * id, user, gadget, rating, comment, date
 */
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  // Sample gadget data
  const featuredGadgets = [
    {
      id: 1,
      name: 'iPhone 15 Pro',
      category: 'Smartphones',
      rating: 4.8,
      image: 'https://placehold.co/300x200/4F46E5/FFFFFF?text=iPhone+15+Pro',
      description: 'The latest iPhone with enhanced camera capabilities and powerful A17 chip.',
    },
    {
      id: 2,
      name: 'Samsung Galaxy Book Pro',
      category: 'Laptops',
      rating: 4.5,
      image: 'https://placehold.co/300x200/4F46E5/FFFFFF?text=Galaxy+Book+Pro',
      description: 'Ultra-thin laptop with stunning AMOLED display and all-day battery life.',
    },
    {
      id: 3,
      name: 'iPad Air',
      category: 'Tablets',
      rating: 4.7,
      image: 'https://placehold.co/300x200/4F46E5/FFFFFF?text=iPad+Air',
      description: 'Powerful and versatile tablet with M1 chip and beautiful Retina display.',
    },
    {
      id: 4,
      name: 'Google Pixel 8',
      category: 'Smartphones',
      rating: 4.6,
      image: 'https://placehold.co/300x200/4F46E5/FFFFFF?text=Pixel+8',
      description: 'Pure Android experience with outstanding camera quality and AI features.',
    },
  ];

  const recentReviews = [
    {
      id: 1,
      user: 'John Doe',
      gadget: 'iPhone 15 Pro',
      rating: 5,
      comment: 'The camera quality is mind-blowing! Battery life is also much improved.',
      date: '2 days ago',
    },
    {
      id: 2,
      user: 'Sarah Smith',
      gadget: 'Samsung Galaxy Book Pro',
      rating: 4,
      comment: 'Great performance but the speakers could be better.',
      date: '4 days ago',
    },
    {
      id: 3,
      user: 'Mike Johnson',
      gadget: 'iPad Air',
      rating: 5,
      comment: 'Perfect for my digital art projects. The Apple Pencil integration is seamless.',
      date: '1 week ago',
    },
  ];

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

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative bg-indigo-600">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 mix-blend-multiply" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">WiseTech</h1>
          <p className="mt-6 max-w-3xl text-xl text-indigo-100">
            Discover, rate, and share reviews on the latest gadgets. Join our community of tech enthusiasts today!
          </p>
          <div className="mt-10">
            <div className="sm:flex">
              <div className="rounded-md shadow">
                <Link
                  to="/smartphones"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                >
                  Explore Gadgets
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured gadgets section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Featured Gadgets</h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Check out these top-rated gadgets reviewed by our community
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {featuredGadgets.map((gadget) => (
            <div key={gadget.id} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
              <div className="flex-shrink-0">
                <img className="h-48 w-full object-cover" src={gadget.image} alt={gadget.name} />
              </div>
              <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-indigo-600">
                    {gadget.category}
                  </p>
                  <Link to={`/gadget/${gadget.id}`} className="block mt-2">
                    <p className="text-xl font-semibold text-gray-900">{gadget.name}</p>
                    <p className="mt-3 text-base text-gray-500">{gadget.description}</p>
                  </Link>
                </div>
                <div className="mt-4">
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {renderStars(Math.round(gadget.rating))}
                    </div>
                    <p className="ml-2 text-sm text-gray-600">{gadget.rating} out of 5 stars</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent reviews section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Recent Reviews</h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              See what our community is saying about their latest gadgets
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {recentReviews.map((review) => (
              <div key={review.id} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-gray-900">{review.gadget}</p>
                    <div className="mt-2 flex items-center">
                      {renderStars(review.rating)}
                      <p className="ml-2 text-sm text-gray-600">{review.rating} out of 5 stars</p>
                    </div>
                    <p className="mt-4 text-base text-gray-500">{review.comment}</p>
                  </div>
                  <div className="mt-6 flex items-center">
                    <div className="flex-shrink-0">
                      <span className="sr-only">{review.user}</span>
                      <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                        <p className="text-white font-medium">{review.user.charAt(0)}</p>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{review.user}</p>
                      <div className="flex space-x-1 text-sm text-gray-500">
                        <span>{review.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
