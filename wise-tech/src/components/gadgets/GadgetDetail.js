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
import { getProductPlaceholder } from '../../utils/placeholderImage';

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
          image: getProductPlaceholder(
            id === '1' ? 'iPhone 15 Pro' : id === '2' ? 'Galaxy Book Pro' : id === '3' ? 'iPad Air' : 'Pixel 8', 
            parseInt(id)
          ),
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

  // Function to render rating using DaisyUI rating component
  const renderRating = (rating) => {
    return (
      <div className="rating rating-md">
        {[1, 2, 3, 4, 5].map((star) => (
          <input
            key={star}
            type="radio"
            name={`rating-${Math.random()}`}
            className={`mask mask-star-2 ${star <= Math.round(rating) ? 'bg-warning' : 'bg-opacity-20'}`}
            checked={star === Math.round(rating)}
            readOnly
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!gadget) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <div>
            <h3 className="font-bold">Gadget not found</h3>
            <p className="text-xs">The gadget you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-100">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="text-sm breadcrumbs mb-6">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href={`/${gadget.category.toLowerCase()}`}>{gadget.category}</a></li>
            <li className="font-medium">{gadget.name}</li>
          </ul>
        </div>

        {/* Product details */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* Product image */}
          <div className="lg:max-w-lg lg:self-end">
            <div className="card bg-base-100 shadow-lg">
              <figure className="px-4 pt-4">
                <img
                  src={gadget.image}
                  alt={gadget.name}
                  className="rounded-xl w-full h-full object-center object-cover"
                />
              </figure>
            </div>
          </div>

          {/* Product info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight">{gadget.name}</h1>
            
            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl text-primary font-bold">${gadget.price}</p>
            </div>

            <div className="mt-3">
              <div className="flex items-center gap-2">
                {renderRating(gadget.rating)}
                <p className="text-sm text-base-content/70">{gadget.rating} out of 5 stars</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="badge badge-lg badge-outline mb-2">{gadget.category}</div>
              <p className="text-base">{gadget.description}</p>
            </div>

            <div className="divider"></div>

            <div className="mt-4">
              <h2 className="text-lg font-medium mb-2">Specifications</h2>

              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <tbody>
                    {gadget.specs.map((spec, index) => (
                      <tr key={index}>
                        <td className="font-medium">{spec.name}</td>
                        <td>{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6">
              <button className="btn btn-primary w-full">
                Write a Review
              </button>
            </div>
          </div>
        </div>

        {/* Reviews section */}
        <section className="mt-16">
          <h2 className="text-xl font-medium mb-6">Customer Reviews</h2>
          
          {/* Review form */}
          <div className="mt-8 card bg-base-200">
            <div className="card-body">
              <h3 className="card-title">Write a Review</h3>
              <form onSubmit={handleSubmitReview}>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Rating</span>
                  </label>
                  <select
                    name="rating"
                    value={userReview.rating}
                    onChange={handleReviewChange}
                    className="select select-bordered w-full"
                  >
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Your Review</span>
                  </label>
                  <textarea
                    name="comment"
                    rows="4"
                    value={userReview.comment}
                    onChange={handleReviewChange}
                    placeholder="Share your thoughts about this product..."
                    className="textarea textarea-bordered"
                  ></textarea>
                </div>
                <div className="card-actions justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Reviews list */}
          <div className="mt-8 space-y-6">
            {gadget.reviews.map((review) => (
              <div key={review.id} className="card bg-base-100 shadow-sm border border-base-200">
                <div className="card-body">
                  <div className="flex items-center">
                    <div className="avatar placeholder">
                      <div className="bg-primary text-primary-content rounded-full w-12">
                        <span>{review.user.charAt(0)}</span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium">{review.user}</h4>
                      <div className="mt-1 flex items-center">
                        <div className="rating rating-sm">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <input
                              key={star}
                              type="radio"
                              name={`rating-${review.id}-${star}`}
                              className={`mask mask-star-2 ${star <= review.rating ? 'bg-warning' : 'bg-opacity-20'}`}
                              checked={star === review.rating}
                              readOnly
                            />
                          ))}
                        </div>
                        <p className="ml-2 text-xs text-base-content/70">{review.date}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-base">
                      {review.comment}
                    </p>
                  </div>
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
