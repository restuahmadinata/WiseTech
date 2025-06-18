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
import { getProductPlaceholder } from '../../utils/placeholderImage';

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
      image: getProductPlaceholder('iPhone 15 Pro', 1),
      description: 'The latest iPhone with enhanced camera capabilities and powerful A17 chip.'
    },
    {
      id: 4,
      name: 'Google Pixel 8',
      brand: 'Google',
      category: 'Smartphones',
      price: 699,
      rating: 4.6,
      image: getProductPlaceholder('Pixel 8', 4),
      description: 'Pure Android experience with outstanding camera quality and AI features.'
    },
    {
      id: 5,
      name: 'Samsung Galaxy S23 Ultra',
      brand: 'Samsung',
      category: 'Smartphones',
      price: 1199,
      rating: 4.7,
      image: getProductPlaceholder('Galaxy S23 Ultra', 5),
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
      image: getProductPlaceholder('Galaxy Book Pro', 2),
      description: 'Ultra-thin laptop with stunning AMOLED display and all-day battery life.'
    },
    {
      id: 10,
      name: 'MacBook Pro 14"',
      brand: 'Apple',
      category: 'Laptops',
      price: 1999,
      rating: 4.8,
      image: getProductPlaceholder('MacBook Pro 14', 10),
      description: 'Powerful laptop with M3 Pro chip, stunning display and excellent battery life.'
    },
    {
      id: 11,
      name: 'Dell XPS 13',
      brand: 'Dell',
      category: 'Laptops',
      price: 1199,
      rating: 4.6,
      image: getProductPlaceholder('Dell XPS 13', 11),
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
      image: getProductPlaceholder('iPad Air', 3),
      description: 'Powerful and versatile tablet with M1 chip and beautiful Retina display.'
    },
    {
      id: 20,
      name: 'Samsung Galaxy Tab S9',
      brand: 'Samsung',
      category: 'Tablets',
      price: 799,
      rating: 4.6,
      image: getProductPlaceholder('Galaxy Tab S9', 20),
      description: 'Premium Android tablet with S Pen support and vibrant AMOLED display.'
    },
    {
      id: 21,
      name: 'iPad Pro 12.9"',
      brand: 'Apple',
      category: 'Tablets',
      price: 1099,
      rating: 4.8,
      image: getProductPlaceholder('iPad Pro 12.9', 21),
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

  // Function to render rating using DaisyUI rating component
  const renderRating = (rating) => {
    return (
      <div className="rating rating-sm">
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

  return (
    <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Search header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent sm:text-4xl">
            Search Gadgets
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-base-content/80">
            Find the perfect gadget for your needs
          </p>
        </div>

        {/* Search form */}
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="join w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gadgets..."
              className="input input-bordered join-item flex-1"
              required
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="select select-bordered join-item"
            >
              <option value="all">All Categories</option>
              <option value="Smartphones">Smartphones</option>
              <option value="Laptops">Laptops</option>
              <option value="Tablets">Tablets</option>
            </select>
            <button
              type="submit"
              className="btn btn-primary join-item"
            >
              {isSearching ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <h2 className="text-xl font-semibold text-base-content mb-6">
              {searchResults.length > 0
                ? `Found ${searchResults.length} results for "${searchQuery}"`
                : `No results found for "${searchQuery}"`}
            </h2>
          )}

          {isSearching ? (
            <div className="flex justify-center my-12">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {searchResults.map((gadget) => (
                <Link 
                  to={`/gadget/${gadget.id}`}
                  key={gadget.id} 
                  className="card card-compact bg-base-100 shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <figure className="px-4 pt-4">
                    <img 
                      src={gadget.image} 
                      alt={gadget.name}
                      className="rounded-lg object-cover w-full h-48"
                    />
                  </figure>
                  <div className="card-body">
                    <h3 className="card-title text-lg font-medium hover:text-primary transition-colors duration-150">
                      {gadget.name}
                      <div className="badge badge-secondary">{gadget.brand}</div>
                    </h3>
                    <div className="badge badge-outline badge-sm">{gadget.category}</div>
                    <div className="flex items-center mt-1">
                      {renderRating(gadget.rating)}
                      <span className="ml-1 text-sm text-base-content/70">{gadget.rating}</span>
                    </div>
                    <p className="mt-2 text-sm line-clamp-2">{gadget.description}</p>
                    <div className="card-actions justify-between items-center mt-3">
                      <span className="font-medium text-lg">${gadget.price}</span>
                      <button className="btn btn-sm btn-primary">View Details</button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Popular searches section when no search has been performed yet */}
          {!searchQuery && !isSearching && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-base-content mb-6">Popular Categories</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link 
                  to="/smartphones"
                  className="card bg-gradient-to-r from-primary to-secondary text-primary-content hover:shadow-lg transition-shadow"
                >
                  <div className="card-body items-center text-center">
                    <h3 className="card-title">Smartphones</h3>
                    <p>Latest and greatest mobile devices</p>
                    <div className="card-actions">
                      <button className="btn btn-sm glass">Browse</button>
                    </div>
                  </div>
                </Link>
                
                <Link 
                  to="/laptops"
                  className="card bg-gradient-to-r from-secondary to-accent text-secondary-content hover:shadow-lg transition-shadow"
                >
                  <div className="card-body items-center text-center">
                    <h3 className="card-title">Laptops</h3>
                    <p>Powerful computing on the go</p>
                    <div className="card-actions">
                      <button className="btn btn-sm glass">Browse</button>
                    </div>
                  </div>
                </Link>
                
                <Link 
                  to="/tablets"
                  className="card bg-gradient-to-r from-accent to-primary text-accent-content hover:shadow-lg transition-shadow"
                >
                  <div className="card-body items-center text-center">
                    <h3 className="card-title">Tablets</h3>
                    <p>The perfect balance of mobility and power</p>
                    <div className="card-actions">
                      <button className="btn btn-sm glass">Browse</button>
                    </div>
                  </div>
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
