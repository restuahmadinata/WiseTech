/**
 * Komponen Search - Pencarian dan filter gadget
 * 
 * Fitur utama:
 * - Pencarian gadget berdasarkan kata kunci
 * - Filter berdasarkan kategori (Smartphone, Laptop, Tablet)
 * - Tampilan hasil pencarian dengan gambar dan informasi ringkas
 * 
 * API yang dibutuhkan:
 * - GET /api/search?q=[query]&category=[category]
 * 
 * Parameter API:
 * - q: Kata kunci pencarian (string)
 * - category: Kategori gadget (string: "all", "Smartphones", "Laptops", "Tablets")
 * 
 * Format respons API yang diharapkan:
 * Array dari objek gadget dengan setidaknya properti:
 * id, name, brand, category, price, rating, image, description
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock database of gadgets
  const allGadgets = [
    // Smartphones
    {
      id: 1,
      name: 'iPhone 15 Pro',
      brand: 'Apple',
      category: 'Smartphones',
      price: 999,
      rating: 4.8,
      image: 'https://placehold.co/300x200/4F46E5/FFFFFF?text=iPhone+15+Pro',
      description: 'The latest iPhone with enhanced camera capabilities and powerful A17 chip.'
    },
    {
      id: 4,
      name: 'Google Pixel 8',
      brand: 'Google',
      category: 'Smartphones',
      price: 699,
      rating: 4.6,
      image: 'https://placehold.co/300x200/4F46E5/FFFFFF?text=Pixel+8',
      description: 'Pure Android experience with outstanding camera quality and AI features.'
    },
    {
      id: 5,
      name: 'Samsung Galaxy S23 Ultra',
      brand: 'Samsung',
      category: 'Smartphones',
      price: 1199,
      rating: 4.7,
      image: 'https://placehold.co/300x200/4F46E5/FFFFFF?text=Galaxy+S23+Ultra',
      description: 'Premium flagship with S-Pen support and exceptional camera system.'
    },
    
    // Laptops
    {
      id: 2,
      name: 'Samsung Galaxy Book Pro',
      brand: 'Samsung',
      category: 'Laptops',
      price: 1299,
      rating: 4.5,
      image: 'https://placehold.co/300x200/4F46E5/FFFFFF?text=Galaxy+Book+Pro',
      description: 'Ultra-thin laptop with stunning AMOLED display and all-day battery life.'
    },
    {
      id: 10,
      name: 'MacBook Pro 14"',
      brand: 'Apple',
      category: 'Laptops',
      price: 1999,
      rating: 4.8,
      image: 'https://placehold.co/300x200/4F46E5/FFFFFF?text=MacBook+Pro+14',
      description: 'Powerful laptop with M3 Pro chip, stunning display and excellent battery life.'
    },
    {
      id: 11,
      name: 'Dell XPS 13',
      brand: 'Dell',
      category: 'Laptops',
      price: 1199,
      rating: 4.6,
      image: 'https://placehold.co/300x200/4F46E5/FFFFFF?text=Dell+XPS+13',
      description: 'Premium ultrabook with InfinityEdge display and excellent build quality.'
    },
    
    // Tablets
    {
      id: 3,
      name: 'iPad Air',
      brand: 'Apple',
      category: 'Tablets',
      price: 599,
      rating: 4.7,
      image: 'https://placehold.co/300x200/4F46E5/FFFFFF?text=iPad+Air',
      description: 'Powerful and versatile tablet with M1 chip and beautiful Retina display.'
    },
    {
      id: 20,
      name: 'Samsung Galaxy Tab S9',
      brand: 'Samsung',
      category: 'Tablets',
      price: 799,
      rating: 4.6,
      image: 'https://placehold.co/300x200/4F46E5/FFFFFF?text=Galaxy+Tab+S9',
      description: 'Premium Android tablet with S Pen support and vibrant AMOLED display.'
    },
    {
      id: 21,
      name: 'iPad Pro 12.9"',
      brand: 'Apple',
      category: 'Tablets',
      price: 1099,
      rating: 4.8,
      image: 'https://placehold.co/300x200/4F46E5/FFFFFF?text=iPad+Pro+12.9',
      description: 'Ultimate iPad experience with M2 chip and mini-LED XDR display.'
    }
  ];

  // Function to handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);

    setTimeout(() => {
      // Filter gadgets based on search query and category
      const filteredResults = allGadgets.filter(gadget => {
        // Apply category filter
        if (selectedCategory !== 'all' && gadget.category !== selectedCategory) {
          return false;
        }
        
        // Apply search query filter
        const searchTerms = searchQuery.toLowerCase().split(' ');
        return searchTerms.every(term => 
          gadget.name.toLowerCase().includes(term) || 
          gadget.brand.toLowerCase().includes(term) || 
          gadget.description.toLowerCase().includes(term)
        );
      });
      
      setSearchResults(filteredResults);
      setIsSearching(false);
    }, 500); // Simulating API call delay
  };

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

  return (
    <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Search header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 sm:text-4xl">
            Search Gadgets
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            Find the perfect gadget for your needs
          </p>
        </div>

        {/* Search form */}
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gadgets..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div className="md:w-40">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Categories</option>
                <option value="Smartphones">Smartphones</option>
                <option value="Laptops">Laptops</option>
                <option value="Tablets">Tablets</option>
              </select>
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300 flex items-center justify-center"
            >
              {isSearching ? (
                <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full mr-2"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {/* Search results */}
        <div className="mt-12">
          {searchQuery && !isSearching && (
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {searchResults.length > 0
                ? `Found ${searchResults.length} results for "${searchQuery}"`
                : `No results found for "${searchQuery}"`}
            </h2>
          )}

          {isSearching ? (
            <div className="flex justify-center my-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {searchResults.map((gadget) => (
                <Link 
                  to={`/gadget/${gadget.id}`}
                  key={gadget.id} 
                  className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
                >
                  <div className="aspect-w-4 aspect-h-3 bg-gray-200 overflow-hidden">
                    <img 
                      src={gadget.image} 
                      alt={gadget.name}
                      className="w-full h-full object-center object-cover group-hover:opacity-90 transition-opacity duration-300"
                    />
                  </div>
                  <div className="p-5 flex-grow flex flex-col">
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mb-2">
                        {gadget.category}
                      </span>
                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-150">
                        {gadget.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{gadget.brand}</p>
                    </div>
                    <div className="mt-2 flex items-center">
                      <div className="flex items-center">
                        {renderStars(Math.round(gadget.rating))}
                      </div>
                      <p className="ml-1 text-sm text-gray-500">{gadget.rating}</p>
                    </div>
                    <p className="mt-2 text-sm text-gray-700 line-clamp-2">{gadget.description}</p>
                    <div className="mt-auto pt-4">
                      <p className="font-medium text-gray-900">${gadget.price}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Popular searches section when no search has been performed yet */}
          {!searchQuery && !isSearching && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Popular Categories</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link 
                  to="/smartphones"
                  className="block p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-md text-center text-white hover:from-indigo-600 hover:to-purple-700 transition-colors duration-300 transform hover:scale-105"
                >
                  <h3 className="text-lg font-bold">Smartphones</h3>
                  <p className="mt-2">Latest and greatest mobile devices</p>
                </Link>
                
                <Link 
                  to="/laptops"
                  className="block p-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg shadow-md text-center text-white hover:from-purple-600 hover:to-pink-700 transition-colors duration-300 transform hover:scale-105"
                >
                  <h3 className="text-lg font-bold">Laptops</h3>
                  <p className="mt-2">Powerful computing on the go</p>
                </Link>
                
                <Link 
                  to="/tablets"
                  className="block p-6 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg shadow-md text-center text-white hover:from-pink-600 hover:to-rose-700 transition-colors duration-300 transform hover:scale-105"
                >
                  <h3 className="text-lg font-bold">Tablets</h3>
                  <p className="mt-2">The perfect balance of mobility and power</p>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
