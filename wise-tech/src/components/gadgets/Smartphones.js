/**
 * Komponen Smartphones - Halaman daftar smartphone
 * 
 * Fitur utama:
 * - Menampilkan daftar smartphone dengan gambar dan informasi ringkas
 * - Filter berdasarkan brand, range harga
 * - Sorting berdasarkan terbaru, rating, harga (rendah-tinggi, tinggi-rendah)
 * - Navigasi ke halaman detail smartphone
 * 
 * API yang dibutuhkan:
 * - GET /api/gadgets?category=smartphone
 * 
 * Parameter filter API:
 * - brands[]: Array brand untuk filter (opsional)
 * - priceMin: Harga minimum (opsional)
 * - priceMax: Harga maksimum (opsional)
 * - sortBy: Kriteria pengurutan - "newest", "rating", "price-low", "price-high" (opsional)
 * 
 * Format data smartphone yang diharapkan dari API:
 * Array dari objek smartphone dengan properti minimum:
 * id, name, brand, price, rating, image, description, releaseDate
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProductPlaceholder } from '../../utils/placeholderImage';

const Smartphones = () => {
  const [smartphones, setSmartphones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    brands: [],
    priceRange: [0, 2000],
    sortBy: 'newest'
  });
    useEffect(() => {
    // In a real application, this would be an API call
    const fetchSmartphones = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data for demonstration
        let mockSmartphones = [
          {            id: 1,
            name: 'iPhone 15 Pro',
            brand: 'Apple',
            price: 999,
            rating: 4.8,
            image: '',
            releaseDate: '2023-09-22',
            description: 'The latest iPhone with enhanced camera capabilities and powerful A17 chip.'
          },
          {            id: 4,
            name: 'Google Pixel 8',
            brand: 'Google',
            price: 699,
            rating: 4.6,
            image: '',
            releaseDate: '2023-10-12',
            description: 'Pure Android experience with outstanding camera quality and AI features.'
          },
          {
            id: 5,
            name: 'Samsung Galaxy S23 Ultra',
            brand: 'Samsung',
            price: 1199,
            rating: 4.7,
            image: 'https://placehold.co/300x200/4F46E5/FFFFFF?text=Galaxy+S23+Ultra',
            releaseDate: '2023-02-17',
            description: 'Premium flagship with S-Pen support and exceptional camera system.'
          },
          {
            id: 6,
            name: 'OnePlus 11',
            brand: 'OnePlus',
            price: 699,
            rating: 4.5,
            image: 'https://placehold.co/300x200/4F46E5/FFFFFF?text=OnePlus+11',
            releaseDate: '2023-02-07',
            description: 'Fast performance with Hasselblad camera system and rapid charging.'
          },
          {
            id: 7,
            name: 'Xiaomi 13 Pro',
            brand: 'Xiaomi',
            price: 899,
            rating: 4.4,
            image: 'https://placehold.co/300x200/4F46E5/FFFFFF?text=Xiaomi+13+Pro',
            releaseDate: '2023-03-10',
            description: 'Feature-packed with Leica optics and powerful specifications.'
          },
          {
            id: 8,
            name: 'Nothing Phone 2',
            brand: 'Nothing',
            price: 599,
            rating: 4.3,
            image: 'https://placehold.co/300x200/4F46E5/FFFFFF?text=Nothing+Phone+2',
            releaseDate: '2023-07-11',
            description: 'Unique Glyph interface with clean software and solid performance.'
          }
        ];
        
        setSmartphones(mockSmartphones);
      } catch (error) {
        console.error('Error fetching smartphones:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSmartphones();
  }, []);

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`h-4 w-4 ${
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

  // Function to handle filter changes
  const handleFilterChange = (e, filterType) => {
    const { value, checked } = e.target;
    
    if (filterType === 'brand') {
      setFilters(prev => {
        if (checked) {
          return { ...prev, brands: [...prev.brands, value] };
        } else {
          return { ...prev, brands: prev.brands.filter(brand => brand !== value) };
        }
      });
    } else if (filterType === 'sortBy') {
      setFilters(prev => ({ ...prev, sortBy: value }));
    }
  };

  // Get unique brands for filter
  const availableBrands = [...new Set(smartphones.map(item => item.brand))];

  // Apply filters and sorting
  const filteredAndSortedSmartphones = smartphones
    .filter(phone => filters.brands.length === 0 || filters.brands.includes(phone.brand))
    .filter(phone => phone.price >= filters.priceRange[0] && phone.price <= filters.priceRange[1])
    .sort((a, b) => {
      if (filters.sortBy === 'newest') {
        return new Date(b.releaseDate) - new Date(a.releaseDate);
      } else if (filters.sortBy === 'price-low') {
        return a.price - b.price;
      } else if (filters.sortBy === 'price-high') {
        return b.price - a.price;
      } else if (filters.sortBy === 'rating') {
        return b.rating - a.rating;
      }
      return 0;
    });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero section */}
        <div className="rounded-xl overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
          <div className="px-6 py-12 sm:px-12 sm:py-16 lg:py-20">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
                Discover the Latest Smartphones
              </h1>
              <p className="mt-4 text-lg text-indigo-100">
                Compare features, read expert reviews, and find the perfect smartphone for your needs.
              </p>
            </div>
          </div>
        </div>

        {/* Filters and product grid */}
        <div className="mt-8 lg:grid lg:grid-cols-4 lg:gap-x-8 xl:gap-x-10">
          {/* Filters */}
          <div className="hidden lg:block">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
              <h2 className="font-semibold text-gray-900 text-lg mb-4">Filters</h2>
              
              {/* Brand filter */}
              <div className="py-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Brand</h3>
                <div className="space-y-2">
                  {availableBrands.map((brand) => (
                    <div key={brand} className="flex items-center">
                      <input
                        id={`brand-${brand}`}
                        name="brand"
                        value={brand}
                        type="checkbox"
                        checked={filters.brands.includes(brand)}
                        onChange={(e) => handleFilterChange(e, 'brand')}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`brand-${brand}`} className="ml-2 text-sm text-gray-700">
                        {brand}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Price range filter */}
              <div className="py-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range</h3>
                <div className="mt-2 px-1">
                  <div className="text-xs text-gray-500 flex justify-between">
                    <span>${filters.priceRange[0]}</span>
                    <span>${filters.priceRange[1]}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="2000" 
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], parseInt(e.target.value)] }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
                  />
                </div>
              </div>

              {/* Sort options */}
              <div className="py-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Sort By</h3>
                <div className="space-y-2">
                  {[
                    { value: 'newest', label: 'Newest' },
                    { value: 'rating', label: 'Highest Rated' },
                    { value: 'price-low', label: 'Price: Low to High' },
                    { value: 'price-high', label: 'Price: High to Low' }
                  ].map((option) => (
                    <div key={option.value} className="flex items-center">
                      <input
                        id={`sort-${option.value}`}
                        name="sortBy"
                        value={option.value}
                        type="radio"
                        checked={filters.sortBy === option.value}
                        onChange={(e) => handleFilterChange(e, 'sortBy')}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <label htmlFor={`sort-${option.value}`} className="ml-2 text-sm text-gray-700">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product grid */}
          <div className="mt-6 lg:mt-0 lg:col-span-3">
            {/* Mobile filters */}
            <div className="flex items-center justify-between mb-4 lg:hidden">
              <div>                <select
                  className="select select-bordered select-sm w-full"
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                >
                  <option value="newest">Sort by: Newest</option>
                  <option value="rating">Sort by: Highest Rated</option>
                  <option value="price-low">Sort by: Price Low to High</option>
                  <option value="price-high">Sort by: Price High to Low</option>
                </select>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
              >
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                </svg>
                Filters
              </button>
            </div>

            {/* Results count */}
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Showing {filteredAndSortedSmartphones.length} smartphones
              </p>
            </div>            {/* Products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedSmartphones.map((phone) => (
                <Link 
                  to={`/gadget/${phone.id}`}
                  key={phone.id}
                >
                  <div className="card card-compact bg-base-100 shadow-xl h-full hover:shadow-2xl transition-all duration-300">
                    <figure className="bg-base-200">
                      <img 
                        src={phone.image} 
                        alt={phone.name}
                        className="h-48 w-full object-cover"
                      />
                    </figure>
                    <div className="card-body">
                      <h2 className="card-title text-primary">
                        {phone.name}
                        <div className="badge badge-secondary">{phone.brand}</div>                      </h2>
                      <div className="rating rating-sm">
                        {[1, 2, 3, 4, 5].map(star => (
                          <input 
                            key={star} 
                            type="radio" 
                            name={`rating-${phone.id}`} 
                            className={`mask mask-star-2 ${star <= Math.round(phone.rating) ? 'bg-warning' : 'bg-base-300'}`} 
                            disabled 
                            checked={star === Math.round(phone.rating)}
                          />
                        ))}
                        <span className="ml-2 text-xs">({phone.rating})</span>
                      </div>
                      <p className="text-sm line-clamp-2">{phone.description}</p>
                      <div className="card-actions justify-between items-center mt-2">
                        <span className="text-lg font-semibold">${phone.price}</span>
                        <button className="btn btn-primary btn-sm">View Details</button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Smartphones;
