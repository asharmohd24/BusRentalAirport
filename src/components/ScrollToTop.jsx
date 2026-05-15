/**
 * ScrollToTop Component
 * ======================
 * Floating button to scroll back to top of page
 */

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const rootElement = document.documentElement;
      const scrollTotal = rootElement.scrollHeight - rootElement.clientHeight;
      setIsVisible(rootElement.scrollTop / scrollTotal > 0.05);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      className={`scrollToTopBtn ${isVisible ? 'showBtn' : ''}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <i className="fa fa-arrow-up"></i>
    </button>
  );
};

export default ScrollToTop;
