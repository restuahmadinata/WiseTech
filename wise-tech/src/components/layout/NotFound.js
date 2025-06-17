import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="h-24 w-24 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <span className="text-3xl font-bold text-white">404</span>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
            Page Not Found
          </h2>
          <p className="mt-4 text-md text-gray-600">
            Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or never existed.
          </p>
        </div>

        <div className="space-y-4">
          <Link 
            to="/" 
            className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Back to Home
          </Link>
          
          <Link 
            to="/search" 
            className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            Search for Gadgets
          </Link>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500">
            Popular categories:
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-3">
            <Link to="/smartphones" className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800 hover:bg-indigo-200">
              Smartphones
            </Link>
            <Link to="/laptops" className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800 hover:bg-purple-200">
              Laptops
            </Link>
            <Link to="/tablets" className="rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-800 hover:bg-pink-200">
              Tablets
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
