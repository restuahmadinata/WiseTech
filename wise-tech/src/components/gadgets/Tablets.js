/**
 * Komponen Tablets - Halaman daftar tablet
 * 
 * Fitur utama:
 * - Menampilkan daftar tablet dengan gambar dan informasi ringkas
 * - Filter berdasarkan brand, ukuran layar, range harga
 * - Sorting berdasarkan terbaru, rating, harga (rendah-tinggi, tinggi-rendah)
 * - Navigasi ke halaman detail tablet
 * 
 * API yang dibutuhkan:
 * - GET /api/gadgets?category=tablet
 * 
 * Parameter filter API:
 * - brands[]: Array brand untuk filter (opsional)
 * - screenSizes[]: Array ukuran layar untuk filter (opsional, unique to tablets)
 * - priceMin: Harga minimum (opsional)
 * - priceMax: Harga maksimum (opsional)
 * - sortBy: Kriteria pengurutan - "newest", "rating", "price-low", "price-high" (opsional)
 * 
 * Format data tablet yang diharapkan dari API:
 * Array dari objek tablet dengan properti minimum:
 * id, name, brand, price, rating, image, description, releaseDate, screenSize
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Tablets = () => {
  const [tablets, setTablets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    brands: [],
    priceRange: [0, 2000],
    screenSizes: [],
    sortBy: 'newest'
  });
  
  useEffect(() => {
    // In a real application, this would be an API call
    const fetchTablets = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data for demonstration
        const mockTablets = [
          {
            id: 3,
            name: 'iPad Air',
            brand: 'Apple',
            price: 599,
            rating: 4.7,
            image: 'https://placehold.co/300x200/4F46E5/FFFFFF?text=iPad+Air',
            releaseDate: '2023-03-08',
            description: 'Powerful and versatile tablet with M1 chip and beautiful Retina display.',
            screenSize: '10.9"'
          },
          {
            id: 20,
            name: 'Samsung Galaxy Tab S9',
            brand: 'Samsung',
            price: 799,
            rating: 4.6,
            image: 'https://placehold.co/300x200/4F46E5/FFFFFF?text=Galaxy+Tab+S9',
            releaseDate: '2023-08-11',
            description: 'Premium Android tablet with S Pen support and vibrant AMOLED display.',
            screenSize: '11"'
          },
          {
            id: 21,
            name: 'iPad Pro 12.9"',
            brand: 'Apple',
            price: 1099,
            rating: 4.8,
            image: 'https://placehold.co/300x200/4F46E5/FFFFFF?text=iPad+Pro+12.9',
            releaseDate: '2023-06-05',
            description: 'Ultimate iPad experience with M2 chip and mini-LED XDR display.',
            screenSize: '12.9"'
          },
          {
            id: 22,
            name: 'Microsoft Surface Pro 9',
            brand: 'Microsoft',
            price: 999,
            rating: 4.5,
            image: 'https://placehold.co/300x200/4F46E5/FFFFFF?text=Surface+Pro+9',
            releaseDate: '2023-10-01',
            description: 'Powerful 2-in-1 tablet with laptop performance and Windows 11.',
            screenSize: '13"'
          },
          {
            id: 23,
            name: 'Lenovo Tab P11 Pro Gen 2',
            brand: 'Lenovo',
            price: 399,
            rating: 4.3,
            image: 'https://placehold.co/300x200/4F46E5/FFFFFF?text=Tab+P11+Pro',
            releaseDate: '2023-05-15',
            description: 'Premium Android tablet with OLED display and quad speakers.',
            screenSize: '11.5"'
          },
          {
            id: 24,
            name: 'Amazon Fire HD 10',
            brand: 'Amazon',
            price: 149,
            rating: 4.2,
            image: 'https://placehold.co/300x200/4F46E5/FFFFFF?text=Fire+HD+10',
            releaseDate: '2023-09-20',
            description: 'Affordable tablet for entertainment with Alexa built-in.',
            screenSize: '10.1"'
          }
        ];
        
        setTablets(mockTablets);
      } catch (error) {
        console.error('Error fetching tablets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTablets();
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
    } else if (filterType === 'screenSize') {
      setFilters(prev => {
        if (checked) {
          return { ...prev, screenSizes: [...prev.screenSizes, value] };
        } else {
          return { ...prev, screenSizes: prev.screenSizes.filter(size => size !== value) };
        }
      });
    } else if (filterType === 'sortBy') {
      setFilters(prev => ({ ...prev, sortBy: value }));
    }
  };

  // Get unique brands and screen sizes for filters
  const availableBrands = [...new Set(tablets.map(item => item.brand))];
  const availableScreenSizes = [...new Set(tablets.map(item => item.screenSize))];

  // Apply filters and sorting
  const filteredAndSortedTablets = tablets
    .filter(tablet => filters.brands.length === 0 || filters.brands.includes(tablet.brand))
    .filter(tablet => filters.screenSizes.length === 0 || filters.screenSizes.includes(tablet.screenSize))
    .filter(tablet => tablet.price >= filters.priceRange[0] && tablet.price <= filters.priceRange[1])
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
        <div className="rounded-xl overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg">
          <div className="px-6 py-12 sm:px-12 sm:py-16 lg:py-20">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
                Compare Top Tablets
              </h1>
              <p className="mt-4 text-lg text-purple-100">
                Find the perfect tablet for work, entertainment, creativity, or education.
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
              
              {/* Screen Size filter */}
              <div className="py-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Screen Size</h3>
                <div className="space-y-2">
                  {availableScreenSizes.map((size) => (
                    <div key={size} className="flex items-center">
                      <input
                        id={`size-${size}`}
                        name="screenSize"
                        value={size}
                        type="checkbox"
                        checked={filters.screenSizes.includes(size)}
                        onChange={(e) => handleFilterChange(e, 'screenSize')}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`size-${size}`} className="ml-2 text-sm text-gray-700">
                        {size}
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
              <div>
                <select
                  className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
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
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                Showing {filteredAndSortedTablets.length} tablets
              </p>
            </div>

            {/* Products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedTablets.map((tablet) => (
                <Link 
                  to={`/gadget/${tablet.id}`}
                  key={tablet.id} 
                  className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
                >
                  <div className="aspect-w-4 aspect-h-3 bg-gray-200 overflow-hidden">
                    <img 
                      src={tablet.image} 
                      alt={tablet.name}
                      className="w-full h-full object-center object-cover group-hover:opacity-90 transition-opacity duration-300"
                    />
                  </div>
                  <div className="p-5 flex-grow flex flex-col">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-150">
                        {tablet.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{tablet.brand}</p>
                      <p className="mt-1 text-xs text-gray-500">{tablet.screenSize} display</p>
                    </div>
                    <div className="mt-2 flex items-center">
                      <div className="flex items-center">
                        {renderStars(Math.round(tablet.rating))}
                      </div>
                      <p className="ml-1 text-sm text-gray-500">{tablet.rating}</p>
                    </div>
                    <p className="mt-2 text-sm text-gray-700 line-clamp-2">{tablet.description}</p>
                    <div className="mt-auto pt-4">
                      <p className="font-medium text-gray-900">${tablet.price}</p>
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

export default Tablets;
