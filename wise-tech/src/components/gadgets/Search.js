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
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { gadgetAPI } from "../../utils/api";
import GadgetImage from "./GadgetImage";
import NoDataModal from "../common/NoDataModal";

const Search = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [error, setError] = useState("");
  const [popularGadgets, setPopularGadgets] = useState([]);
  const [isLoadingPopular, setIsLoadingPopular] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [showNoDataModal, setShowNoDataModal] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true); // Track initial load

  // Check for URL query parameter on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const queryParam = urlParams.get("q");
    if (queryParam) {
      setSearchQuery(queryParam);
      setShowResults(true);
    }
  }, [location.search]);

  // Load popular/featured gadgets on component mount
  useEffect(() => {
    const loadPopularGadgets = async () => {
      try {
        setIsLoadingPopular(true);
        
        const allGadgets = await gadgetAPI.getAllGadgets(50); // Get up to 50 gadgets
        if (allGadgets && allGadgets.length > 0) {
          setPopularGadgets(allGadgets);
          console.log("Loaded all available gadgets:", allGadgets.length);
        } else {
          // Fallback: try to get featured gadgets if no gadgets found
          const featured = await gadgetAPI.getFeaturedGadgets(20);
          setPopularGadgets(featured || []);
          console.log(
            "Loaded featured gadgets as fallback:",
            featured?.length || 0
          );
        }
      } catch (error) {
        console.error("Failed to load gadgets:", error);
        // Double fallback: try regular gadgets endpoint
        try {
          const params = { pageSize: 50 };
          const response = await gadgetAPI.getGadgets(params);
          const gadgets = response?.gadgets || response || [];
          setPopularGadgets(gadgets);
          console.log("Loaded gadgets from regular endpoint:", gadgets.length);
        } catch (fallbackError) {
          console.error("All gadget loading methods failed:", fallbackError);
          setPopularGadgets([]);
        }
      } finally {
        setIsLoadingPopular(false);
      }
    };

    loadPopularGadgets();
  }, []);

  // Real-time search and filtering with debouncing
  useEffect(() => {
    const performSearchOrFilter = async () => {
      // Show results if there's a search query or a specific category is selected, or show all gadgets
      const hasSearchQuery = searchQuery.trim().length >= 1;
      const hasCategoryFilter = selectedCategory !== "all";

      // Always show results when component loads
      setIsSearching(true);
      setError("");
      setShowResults(true);

      try {
        let results = [];

        if (hasSearchQuery) {
          // Use search API with category filter
          const searchParams = {
            category: selectedCategory === "all" ? "" : selectedCategory,
          };
          results = await gadgetAPI.searchGadgets(
            searchQuery.trim(),
            searchParams
          );
        } else if (hasCategoryFilter) {
          // Just get gadgets by category without search
          const params = {
            category: selectedCategory,
            limit: 100, // Get more results for category browsing
          };
          const response = await gadgetAPI.getGadgets(params);
          results = response?.gadgets || response || [];
        } else {
          // Show all gadgets when no search or filter
          const allGadgets = await gadgetAPI.getAllGadgets(100);
          results = allGadgets || [];

          // If getAllGadgets doesn't work, try regular getGadgets
          if (!results || results.length === 0) {
            const response = await gadgetAPI.getGadgets({ limit: 100 });
            results = response?.gadgets || response || [];
          }
        }

        // Additional client-side category filtering to ensure consistency
        if (hasCategoryFilter && selectedCategory !== "all") {
          results = results.filter(
            (gadget) =>
              gadget.category.toLowerCase() === selectedCategory.toLowerCase()
          );
        }
        setSearchResults(results || []);

        // Show modal if no results found and user is actively searching or filtering (not on initial load)
        const isUserInteracting =
          searchQuery.length >= 2 || selectedCategory !== "all";
        if (
          (results || []).length === 0 &&
          isUserInteracting &&
          !isInitialLoad
        ) {
          setShowNoDataModal(true);
        }
      } catch (error) {
        console.error("Search/filter error:", error);
        setError("Failed to load gadgets. Please try again.");
        setSearchResults([]);
      } finally {
        setIsSearching(false);
        setIsInitialLoad(false); // Mark that initial load is complete
      }
    };

    // Debounce search - wait 300ms after user stops typing, but load immediately on mount
    const debounceTimer = setTimeout(
      performSearchOrFilter,
      searchQuery ? 300 : 0
    );

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedCategory]);

  // Function to handle search form submission (for manual search)
  const handleSearch = async (e) => {
    e.preventDefault();
    const hasSearchQuery = searchQuery.trim().length >= 2;
    const hasCategoryFilter = selectedCategory !== "all";

    if (!hasSearchQuery && !hasCategoryFilter) {
      setError(
        "Please enter at least 2 characters to search or select a category."
      );
      return;
    }
    // The search will be handled by the useEffect above
  };

  // Function to clear search
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
    setError("");
  };

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`h-4 w-4 ${
            i <= rating ? "text-yellow-400" : "text-gray-300"
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
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-4"
          >
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gadgets... (type at least 2 characters)"
                className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
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
              disabled={
                searchQuery.trim().length < 2 && selectedCategory === "all"
              }
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? (
                <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full mr-2"></div>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              )}
              {isSearching ? "Searching..." : "Search"}
            </button>
          </form>
        </div>

        {/* Search results */}
        <div className="mt-12">
          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Search indicator and results count */}
          {(searchQuery.length >= 2 || selectedCategory !== "all") &&
            showResults && (
              <div className="mb-6">
                {isSearching ? (
                  <div className="flex items-center text-gray-600">
                    <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-indigo-600 rounded-full mr-2"></div>
                    <span>
                      {searchQuery.length >= 2
                        ? `Searching for "${searchQuery}"${
                            selectedCategory !== "all"
                              ? ` in ${selectedCategory}`
                              : ""
                          }...`
                        : `Loading ${selectedCategory}...`}
                    </span>
                  </div>
                ) : (
                  <h2 className="text-xl font-semibold text-gray-800">
                    {searchResults.length > 0
                      ? searchQuery.length >= 2
                        ? `Found ${
                            searchResults.length
                          } results for "${searchQuery}"${
                            selectedCategory !== "all"
                              ? ` in ${selectedCategory}`
                              : ""
                          }`
                        : `Found ${searchResults.length} ${selectedCategory}`
                      : searchQuery.length >= 2
                      ? `No results found for "${searchQuery}"${
                          selectedCategory !== "all"
                            ? ` in ${selectedCategory}`
                            : ""
                        }`
                      : `No ${selectedCategory} found`}
                  </h2>
                )}
              </div>
            )}

          {/* Search results display */}
          {showResults &&
            (searchQuery.length >= 1 || selectedCategory !== "all") && (
              <>
                {searchResults.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <div className="text-gray-400 mb-4">
                      <svg
                        className="mx-auto h-12 w-12"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Results Found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      We couldn't find any gadgets matching your search. Try
                      different keywords or browse our categories.
                    </p>
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => setShowNoDataModal(true)}
                    >
                      View Search Tips
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {searchResults.map((gadget) => (
                      <Link
                        to={`/gadget/${gadget.id}`}
                        key={gadget.id}
                        className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
                      >
                        <GadgetImage
                          src={gadget.image_url}
                          alt={gadget.name}
                          gadgetName={gadget.name}
                          size="grid"
                          className="group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="p-5 flex-grow flex flex-col">
                          <div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mb-2">
                              {gadget.category}
                            </span>
                            <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-150">
                              {gadget.name}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {gadget.brand}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center">
                            <div className="flex items-center">
                              {renderStars(
                                Math.round(gadget.average_rating || 0)
                              )}
                            </div>
                            <p className="ml-1 text-sm text-gray-500">
                              {(gadget.average_rating || 0).toFixed(1)}
                            </p>
                          </div>
                          <p className="mt-2 text-sm text-gray-700 line-clamp-2">
                            {gadget.description}
                          </p>
                          <div className="mt-auto pt-4">
                            <p className="font-medium text-gray-900">
                              ${gadget.price}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}

          {/* Featured and all gadgets section when no specific search */}
          {(!showResults ||
            (searchQuery.length < 1 && selectedCategory === "all")) && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Popular Categories
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <Link
                  to="/smartphones"
                  className="block p-6 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg shadow-md text-center text-white hover:from-green-700 hover:to-blue-700 transition-colors duration-300 transform hover:scale-105"
                >
                  <h3 className="text-lg font-bold">Smartphones</h3>
                  <p className="mt-2">Latest and greatest mobile devices</p>
                </Link>

                <Link
                  to="/laptops"
                  className="block p-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-md text-center text-white hover:from-purple-700 hover:to-blue-700 transition-colors duration-300 transform hover:scale-105"
                >
                  <h3 className="text-lg font-bold">Laptops</h3>
                  <p className="mt-2">Powerful computing on the go</p>
                </Link>

                <Link
                  to="/tablets"
                  className="block p-6 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg shadow-md text-center text-white hover:from-orange-700 hover:to-red-700 transition-colors duration-300 transform hover:scale-105"
                >
                  <h3 className="text-lg font-bold">Tablets</h3>
                  <p className="mt-2">
                    The perfect balance of mobility and power
                  </p>
                </Link>
              </div>

              {/* All Available Gadgets */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  {isLoadingPopular
                    ? "Loading Gadgets..."
                    : `All Available Gadgets (${popularGadgets.length})`}
                </h2>
                {isLoadingPopular ? (
                  <div className="flex justify-center my-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                  </div>
                ) : popularGadgets.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {popularGadgets.map((gadget) => (
                      <Link
                        to={`/gadget/${gadget.id}`}
                        key={gadget.id}
                        className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
                      >
                        <GadgetImage
                          src={gadget.image_url}
                          alt={gadget.name}
                          gadgetName={gadget.name}
                          size="grid"
                          className="group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="p-5 flex-grow flex flex-col">
                          <div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mb-2">
                              {gadget.category}
                            </span>
                            <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-150">
                              {gadget.name}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {gadget.brand}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center">
                            <div className="flex items-center">
                              {renderStars(
                                Math.round(gadget.average_rating || 0)
                              )}
                            </div>
                            <p className="ml-1 text-sm text-gray-500">
                              {(gadget.average_rating || 0).toFixed(1)}
                            </p>
                          </div>
                          <p className="mt-2 text-sm text-gray-700 line-clamp-2">
                            {gadget.description}
                          </p>
                          <div className="mt-auto pt-4">
                            <p className="font-medium text-gray-900">
                              ${gadget.price}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <div className="text-gray-400 mb-4">
                      <svg
                        className="mx-auto h-12 w-12"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Gadgets Available
                    </h3>
                    <p className="text-gray-600 mb-4">
                      No gadgets are currently available. Please check back
                      later or contact support if this issue persists.
                    </p>
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => setShowNoDataModal(true)}
                    >
                      Get Help
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* NoDataModal */}
        <NoDataModal
          show={showNoDataModal}
          onClose={() => setShowNoDataModal(false)}
          title={
            searchQuery.length >= 2
              ? "No Search Results"
              : "No Gadgets Available"
          }
          message={
            searchQuery.length >= 2
              ? `We couldn't find any gadgets matching "${searchQuery}"${
                  selectedCategory !== "all" ? ` in ${selectedCategory}` : ""
                }. Try using different keywords, check spelling, or browse our categories.`
              : selectedCategory !== "all"
              ? `No ${selectedCategory.toLowerCase()} are currently available. Try browsing other categories or check back later.`
              : "No gadgets are currently available in our database. Please check back later or contact support."
          }
          icon="search"
          actionButton={{
            text:
              searchQuery.length >= 2 ? "Clear Search" : "Browse Categories",
            onClick: () => {
              if (searchQuery.length >= 2) {
                clearSearch();
              } else {
                setSelectedCategory("all");
                setSearchQuery("");
                setShowResults(false);
              }
              setShowNoDataModal(false);
            },
          }}
        />
      </div>
    </div>
  );
};

export default Search;
