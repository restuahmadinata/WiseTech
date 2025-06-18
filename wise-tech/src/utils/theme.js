/**
 * Theme Configuration for WiseTech application
 */
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a theme context
const ThemeContext = createContext();

/**
 * ThemeProvider component to manage application theme
 * Provides theme context to all child components
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const ThemeProvider = ({ children }) => {
  // Theme state (defaults to 'corporate')
  const [theme, setTheme] = useState('corporate');

  // Apply theme to HTML element on mount and theme change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'corporate' ? 'dark' : 'corporate');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

export default ThemeProvider;
