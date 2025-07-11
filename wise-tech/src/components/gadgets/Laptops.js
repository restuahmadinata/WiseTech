/**
 * Komponen Laptops - Halaman daftar laptop
 *
 * Fitur utama:
 * - Menampilkan daftar laptop dengan gambar dan informasi ringkas
 * - Filter berdasarkan brand, range harga
 * - Sorting berdasarkan terbaru, rating, harga (rendah-tinggi, tinggi-rendah)
 * - Navigasi ke halaman detail laptop
 *
 * API yang digunakan:
 * - GET /api/gadgets?category=laptop
 */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { gadgetAPI } from "../../utils/api";
import GadgetImage from "./GadgetImage";
import NoDataModal from "../common/NoDataModal";

const Laptops = () => {
  const [laptops, setLaptops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNoDataModal, setShowNoDataModal] = useState(false);
  const [hasUserFiltered, setHasUserFiltered] = useState(false); // Track if user has applied filters
  const [isInitialLoad, setIsInitialLoad] = useState(true); // Track initial load
  const [filters, setFilters] = useState({
    brands: [],
    minPrice: 0,
    maxPrice: "",
    sortBy: "newest",
  });

  // Separate state for price inputs (before applying)
  const [priceInputs, setPriceInputs] = useState({
    minPrice: 0,
    maxPrice: "",
  });

  useEffect(() => {
    fetchLaptops();
  }, [filters]);

  // Reset states when component unmounts
  useEffect(() => {
    return () => {
      setShowNoDataModal(false);
    };
  }, []);

  const fetchLaptops = async () => {
    try {
      setLoading(true);
      setError(null);

      // Prepare API parameters
      const params = {
        category: "Laptops",
        page_size: 100, // Ensure we get a good amount of gadgets
      };

      // Add filters only if they have values
      if (filters.minPrice > 0) {
        params.min_price = filters.minPrice;
      }
      if (filters.maxPrice && filters.maxPrice > 0) {
        params.max_price = filters.maxPrice;
      }

      // Add brand filter if selected
      if (filters.brands.length > 0) {
        params.brand = filters.brands.join(",");
      }

      const response = await gadgetAPI.getGadgets(params);
      let laptopsData = response?.gadgets || response || [];

      // Apply client-side sorting
      laptopsData = applySorting(laptopsData, filters.sortBy);

      setLaptops(laptopsData);

      // Only show modal if user has filtered and no results found (not on initial load)
      if (hasUserFiltered && laptopsData.length === 0 && !isInitialLoad) {
        setShowNoDataModal(true);
      }
    } catch (err) {
      console.error("Error fetching laptops:", err);
      setError("Failed to load laptops. Please try again later.");

      // Fallback to sample data if API fails
      const mockLaptops = [
        {
          id: 2,
          name: "Samsung Galaxy Book Pro",
          brand: "Samsung",
          price: 1299,
          average_rating: 4.5,
          review_count: 28,
          image_url:
            "https://placehold.co/300x200/4F46E5/FFFFFF?text=Galaxy+Book+Pro",
          release_date: "2023-03-15",
          description:
            "Ultra-thin laptop with stunning AMOLED display and all-day battery life.",
          processor: "Intel Core i7",
        },
        {
          id: 9,
          name: "MacBook Air M2",
          brand: "Apple",
          price: 1199,
          average_rating: 4.8,
          review_count: 45,
          image_url:
            "https://placehold.co/300x200/4F46E5/FFFFFF?text=MacBook+Air+M2",
          release_date: "2023-07-01",
          description: "Incredibly thin and light with the powerful M2 chip.",
          processor: "Apple M2",
        },
        {
          id: 10,
          name: "Dell XPS 13",
          brand: "Dell",
          price: 999,
          average_rating: 4.6,
          review_count: 32,
          image_url:
            "https://placehold.co/300x200/4F46E5/FFFFFF?text=Dell+XPS+13",
          release_date: "2023-05-10",
          description: "Compact powerhouse with InfinityEdge display.",
          processor: "Intel Core i5",
        },
        {
          id: 11,
          name: "HP Spectre x360",
          brand: "HP",
          price: 1399,
          average_rating: 4.4,
          review_count: 19,
          image_url:
            "https://placehold.co/300x200/4F46E5/FFFFFF?text=HP+Spectre+x360",
          release_date: "2023-04-20",
          description:
            "2-in-1 convertible with premium design and performance.",
          processor: "Intel Core i7",
        },
        {
          id: 12,
          name: "ASUS ZenBook 14",
          brand: "ASUS",
          price: 849,
          average_rating: 4.3,
          review_count: 16,
          image_url:
            "https://placehold.co/300x200/4F46E5/FFFFFF?text=ASUS+ZenBook+14",
          release_date: "2023-02-28",
          description: "Compact and powerful with NumberPad 2.0 touchscreen.",
          processor: "AMD Ryzen 7",
        },
        {
          id: 13,
          name: "Lenovo ThinkPad X1 Carbon",
          brand: "Lenovo",
          price: 1599,
          average_rating: 4.7,
          review_count: 23,
          image_url:
            "https://placehold.co/300x200/4F46E5/FFFFFF?text=ThinkPad+X1+Carbon",
          release_date: "2023-01-15",
          description:
            "Business laptop with legendary durability and performance.",
          processor: "Intel Core i7",
        },
      ];

      setLaptops(mockLaptops);
    } finally {
      setLoading(false);
      setIsInitialLoad(false); // Mark that initial load is complete
    }
  };

  // Function to apply sorting to data
  const applySorting = (data, sortBy) => {
    switch (sortBy) {
      case "price_asc":
        return [...data].sort((a, b) => a.price - b.price);
      case "price_desc":
        return [...data].sort((a, b) => b.price - a.price);
      case "rating":
        return [...data].sort(
          (a, b) => (b.average_rating || 0) - (a.average_rating || 0)
        );
      case "newest":
      default:
        return [...data].sort((a, b) => {
          if (a.release_date && b.release_date) {
            return new Date(b.release_date) - new Date(a.release_date);
          }
          return b.id - a.id; // fallback to ID if no release date
        });
    }
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

  // Function to handle filter changes
  const handleFilterChange = (e, filterType) => {
    const { value, checked } = e.target;
    setHasUserFiltered(true); // Mark that user has filtered

    if (filterType === "brand") {
      setFilters((prev) => {
        if (checked) {
          return { ...prev, brands: [...prev.brands, value] };
        } else {
          return {
            ...prev,
            brands: prev.brands.filter((brand) => brand !== value),
          };
        }
      });
    } else if (filterType === "sortBy") {
      setFilters((prev) => ({ ...prev, sortBy: value }));
    }
  };

  // Function to apply price filter
  const applyPriceFilter = () => {
    setHasUserFiltered(true); // Mark that user has filtered
    setFilters((prev) => ({
      ...prev,
      minPrice: priceInputs.minPrice,
      maxPrice: priceInputs.maxPrice,
    }));
  };

  // Static brand list to prevent disappearing options when filters are applied
  const brandsToShow = [
    "Apple",
    "Samsung",
    "Dell",
    "HP",
    "ASUS",
    "Lenovo",
    "Acer",
    "MSI",
    "Microsoft",
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero section */}
        <div className="rounded-xl overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg">
          <div className="px-6 py-12 sm:px-12 sm:py-16 lg:py-20">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
                Find Your Perfect Laptop
              </h1>
              <p className="mt-4 text-lg text-blue-100">
                Discover laptops for work, gaming, and creativity. Compare specs
                and read reviews.
              </p>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
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
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Filters and product grid */}
        <div className="mt-8 lg:grid lg:grid-cols-4 lg:gap-x-8 xl:gap-x-10">
          {/* Filters */}
          <div className="hidden lg:block">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
              <h2 className="font-semibold text-gray-900 text-lg mb-4">
                Filters
              </h2>

              {/* Brand filter */}
              <div className="py-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Brand
                </h3>
                <div className="space-y-2">
                  {brandsToShow.map((brand) => (
                    <div key={brand} className="flex items-center">
                      <input
                        id={`brand-${brand}`}
                        name="brand"
                        value={brand}
                        type="checkbox"
                        checked={filters.brands.includes(brand)}
                        onChange={(e) => handleFilterChange(e, "brand")}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`brand-${brand}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {brand}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price range filter */}
              <div className="py-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </h3>
                <div className="mt-2 space-y-3">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">
                      Min Price ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={priceInputs.minPrice}
                      onChange={(e) => {
                        const newMin = Math.max(
                          0,
                          parseInt(e.target.value) || 0
                        );
                        setPriceInputs((prev) => ({
                          ...prev,
                          minPrice: newMin,
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">
                      Max Price ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={priceInputs.maxPrice}
                      onChange={(e) => {
                        const newMax = parseInt(e.target.value) || "";
                        setPriceInputs((prev) => ({
                          ...prev,
                          maxPrice:
                            newMax === ""
                              ? ""
                              : Math.max(newMax, prev.minPrice),
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="No limit"
                    />
                  </div>
                  <button
                    onClick={applyPriceFilter}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    Cari
                  </button>
                </div>
              </div>

              {/* Sort options */}
              <div className="py-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </h3>
                <div className="space-y-2">
                  {[
                    { value: "newest", label: "Newest" },
                    { value: "rating", label: "Highest Rated" },
                    { value: "price_asc", label: "Price: Low to High" },
                    { value: "price_desc", label: "Price: High to Low" },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center">
                      <input
                        id={`sort-${option.value}`}
                        name="sortBy"
                        value={option.value}
                        type="radio"
                        checked={filters.sortBy === option.value}
                        onChange={(e) => handleFilterChange(e, "sortBy")}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <label
                        htmlFor={`sort-${option.value}`}
                        className="ml-2 text-sm text-gray-700"
                      >
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
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, sortBy: e.target.value }))
                  }
                >
                  <option value="newest">Sort by: Newest</option>
                  <option value="rating">Sort by: Highest Rated</option>
                  <option value="price_asc">Sort by: Price Low to High</option>
                  <option value="price_desc">Sort by: Price High to Low</option>
                </select>
              </div>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                    clipRule="evenodd"
                  />
                </svg>
                Filters
              </button>
            </div>

            {/* Results count */}
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Showing {laptops.length} laptops
              </p>
            </div>

            {/* Products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {laptops.length > 0
                ? laptops.map((laptop) => (
                    <Link
                      to={`/gadget/${laptop.id}`}
                      key={laptop.id}
                      className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
                    >
                      <GadgetImage
                        src={laptop.image_url || laptop.image}
                        alt={laptop.name}
                        gadgetName={laptop.name}
                        size="grid"
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="p-5 flex-grow flex flex-col">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-150">
                            {laptop.name}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {laptop.brand}
                          </p>
                          {laptop.processor && (
                            <p className="mt-1 text-xs text-blue-600 font-medium">
                              {laptop.processor}
                            </p>
                          )}
                        </div>
                        <div className="mt-2 flex items-center">
                          <div className="flex items-center">
                            {renderStars(
                              Math.round(laptop.average_rating || 0)
                            )}
                          </div>
                          <p className="ml-1 text-sm text-gray-500">
                            {(laptop.average_rating || 0).toFixed(1)}
                          </p>
                        </div>
                        <p className="mt-2 text-sm text-gray-700 line-clamp-2">
                          {laptop.description}
                        </p>
                        <div className="mt-auto pt-4">
                          <p className="font-medium text-gray-900">
                            ${laptop.price}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))
                : !loading && (
                    <div className="col-span-full text-center py-12">
                      <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                        <svg
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No Laptops Found
                      </h3>
                      <p className="text-gray-500 mb-4">
                        No laptops match your current filters.
                      </p>
                      <button
                        onClick={() => setShowNoDataModal(true)}
                        className="text-indigo-600 hover:text-indigo-500 font-medium"
                      >
                        View Details
                      </button>
                    </div>
                  )}
            </div>

            {/* No Data Modal */}
            <NoDataModal
              show={showNoDataModal}
              onClose={() => setShowNoDataModal(false)}
              title="No Laptops Available"
              message="We couldn't find any laptops matching your criteria. This might be because the data is still loading, or there are currently no laptops in our database that match your selected filters."
              icon="laptop"
              actionButton={{
                text: "Clear All Filters",
                onClick: () => {
                  setFilters({
                    brands: [],
                    minPrice: 0,
                    maxPrice: "",
                    sortBy: "newest",
                  });
                  setPriceInputs({
                    minPrice: 0,
                    maxPrice: "",
                  });
                  setHasUserFiltered(false); // Reset filter flag
                  setShowNoDataModal(false);
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Laptops;
