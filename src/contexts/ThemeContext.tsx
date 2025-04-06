
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  themeIcon: React.ReactNode;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
  themeIcon: null,
});

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Check local storage or system preference for initial theme
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [isTransitioning, setIsTransitioning] = useState(false);

  // Update theme when it changes
  useEffect(() => {
    // Start transition
    setIsTransitioning(true);
    
    // Apply theme classes
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save to local storage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // End transition after animation completes
    const timeout = setTimeout(() => {
      setIsTransitioning(false);
    }, 300); // Match this with CSS transition duration
    
    return () => clearTimeout(timeout);
  }, [isDarkMode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if no theme is explicitly set in localStorage
      if (!localStorage.getItem('theme')) {
        setIsDarkMode(e.matches);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Theme icon with animation
  const themeIcon = isDarkMode ? (
    <Moon className={`h-5 w-5 transition-transform ${isTransitioning ? 'rotate-180' : ''}`} />
  ) : (
    <Sun className={`h-5 w-5 transition-transform ${isTransitioning ? 'rotate-180' : ''}`} />
  );

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, themeIcon }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
