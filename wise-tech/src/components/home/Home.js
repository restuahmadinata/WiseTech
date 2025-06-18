/**
 * Komponen Home - Halaman beranda aplikasi menggunakan DaisyUI
 * 
 * Fitur utama:
 * - Hero section dengan banner utama
 * - Daftar gadget unggulan (featured)
 * - Ulasan terbaru dari pengguna
 * - Navigasi ke kategori gadget (smartphones, laptops, tablets)
 * 
 * Komponen DaisyUI yang digunakan:
 * - hero: Untuk bagian banner utama
 * - card: Untuk menampilkan gadget dan ulasan
 * - badge: Untuk kategori dan rating
 * - avatar: Untuk foto pengguna
 * - rating: Untuk menampilkan bintang penilaian
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
import { getProductPlaceholder } from '../../utils/placeholderImage';

const Home = () => {  // Sample gadget data
  const featuredGadgets = [
    {
      id: 1,
      name: 'iPhone 15 Pro',
      category: 'Smartphones',
      rating: 4.8,
      image: getProductPlaceholder('iPhone 15 Pro', 1),
      description: 'The latest iPhone with enhanced camera capabilities and powerful A17 chip.',
    },
    {      id: 2,
      name: 'Samsung Galaxy Book Pro',
      category: 'Laptops',
      rating: 4.5,
      image: getProductPlaceholder('Samsung Galaxy Book Pro', 2),
      description: 'Ultra-thin laptop with stunning AMOLED display and all-day battery life.',
    },
    {      id: 3,
      name: 'iPad Air',
      category: 'Tablets',
      rating: 4.7,
      image: getProductPlaceholder('iPad Air', 3),
      description: 'Powerful and versatile tablet with M1 chip and beautiful Retina display.',
    },
    {      id: 4,
      name: 'Google Pixel 8',
      category: 'Smartphones',
      rating: 4.6,
      image: getProductPlaceholder('Google Pixel 8', 4),
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
  // We no longer need the renderStars function as we're using DaisyUI rating component
  return (
    <div>
      {/* Hero section using DaisyUI */}      <div className="hero min-h-[60vh] bg-gradient-to-r from-primary to-secondary text-primary-content">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">WiseTech</h1>
            <p className="py-6 text-xl">Discover, rate, and share reviews on the latest gadgets. Join our community of tech enthusiasts today!</p>
            <Link to="/smartphones" className="btn btn-neutral">Explore Gadgets</Link>
          </div>
        </div>
      </div>{/* Featured gadgets section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold">Featured Gadgets</h2>
          <p className="mt-3 text-xl text-gray-500">
            Check out these top-rated gadgets reviewed by our community
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featuredGadgets.map((gadget) => (
            <div key={gadget.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <figure><img src={gadget.image} alt={gadget.name} /></figure>
              <div className="card-body">
                <h2 className="card-title">
                  {gadget.name}
                  <div className="badge badge-secondary">{gadget.category}</div>
                </h2>
                <p>{gadget.description}</p>
                <div className="flex items-center mt-2">
                  <div className="rating rating-sm rating-half">
                    {[...Array(10)].map((_, i) => (
                      <input 
                        key={i} 
                        type="radio" 
                        name={`rating-${gadget.id}`} 
                        className={`bg-orange-400 mask mask-star-2 ${i % 2 === 0 ? 'mask-half-1' : 'mask-half-2'}`} 
                        checked={i+1 === Math.round(gadget.rating * 2)} 
                        readOnly
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm">{gadget.rating}</span>
                </div>
                <div className="card-actions justify-end mt-2">
                  <Link to={`/gadget/${gadget.id}`} className="btn btn-primary btn-sm">View Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>      {/* Recent reviews section */}
      <div className="bg-base-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold">Recent Reviews</h2>
            <p className="mt-3 text-xl text-gray-500">
              See what our community is saying about their latest gadgets
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {recentReviews.map((review) => (
              <div key={review.id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">{review.gadget}</h3>
                  <div className="rating rating-sm">
                    {[...Array(5)].map((_, i) => (
                      <input 
                        key={i} 
                        type="radio" 
                        name={`review-rating-${review.id}`} 
                        className="mask mask-star-2 bg-orange-400" 
                        checked={i+1 === review.rating} 
                        readOnly
                      />
                    ))}
                  </div>
                  <p className="py-4">{review.comment}</p>
                  <div className="flex items-center mt-4">
                    <div className="avatar placeholder mr-3">
                      <div className="bg-primary text-neutral-content rounded-full w-10">
                        <span>{review.user.charAt(0)}</span>
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">{review.user}</div>
                      <div className="text-sm opacity-70">{review.date}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/search" className="btn btn-outline btn-primary">Browse All Reviews</Link>
          </div>
        </div>
      </div>
      
      {/* Category navigation */}
      <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold">Browse by Category</h2>
          <p className="mt-3 text-xl text-gray-500">
            Find the perfect gadget for your needs
          </p>
        </div>
          <div className="grid gap-6 md:grid-cols-3">
          <Link to="/smartphones" className="card bg-primary text-primary-content shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="card-body text-center">
              <h2 className="card-title justify-center text-2xl">Smartphones</h2>
              <p>Discover the latest mobile technology</p>
              <div className="card-actions justify-center">
                <div className="btn btn-circle btn-ghost btn-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
          
          <Link to="/laptops" className="card bg-secondary text-secondary-content shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="card-body text-center">
              <h2 className="card-title justify-center text-2xl">Laptops</h2>
              <p>Compare the best computers for work and play</p>
              <div className="card-actions justify-center">
                <div className="btn btn-ghost btn-circle">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
          
          <Link to="/tablets" className="card bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="card-body text-center">
              <h2 className="card-title justify-center text-2xl">Tablets</h2>
              <p>Find the perfect balance of mobility and power</p>
              <div className="card-actions justify-center">
                <div className="btn btn-ghost btn-circle">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
