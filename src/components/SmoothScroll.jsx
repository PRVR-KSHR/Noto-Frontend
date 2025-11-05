import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const { theme } = useTheme();

  useEffect(() => {
    // Scroll to top when route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.colorScheme = theme === 'dark' ? 'dark' : 'light';
    return () => {
      root.style.colorScheme = '';
    };
  }, [theme]);

  return null;
};

export default ScrollToTop;