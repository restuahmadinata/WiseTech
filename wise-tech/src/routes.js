import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/home/Home';
import NotFound from './components/layout/NotFound';
import Smartphones from './components/gadgets/Smartphones';
import Laptops from './components/gadgets/Laptops';
import Tablets from './components/gadgets/Tablets';
import GadgetDetail from './components/gadgets/GadgetDetail';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import UserProfile from './components/user/UserProfile';
import AdminDashboard from './components/admin/AdminDashboard';
import Search from './components/gadgets/Search';
import DaisyUIDemo from './components/demo/DaisyUIDemo';

/**
 * Routes configuration for the WiseTech application
 * 
 * Includes routes for:
 * - Home page
 * - Auth pages (login, register)
 * - Gadget category pages (smartphones, laptops, tablets)
 * - Gadget detail pages
 * - User profile
 * - Admin dashboard
 * - Search page
 * - DaisyUI demo page
 * - 404 Not Found page
 */
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/smartphones" element={<Smartphones />} />
      <Route path="/laptops" element={<Laptops />} />
      <Route path="/tablets" element={<Tablets />} />
      <Route path="/gadget/:id" element={<GadgetDetail />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/search" element={<Search />} />
      <Route path="/daisy-ui-demo" element={<DaisyUIDemo />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
