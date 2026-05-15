import { useState, useEffect } from 'react';
import { siteData } from '../data/data';

const Preloader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }, 1500);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, []);

  if (!isLoading) return null;

  const siteName = siteData.siteName;

  return (
    <div id="preloader">
      <img src={siteData.logo} className="preloader-img" alt="" />
      <div className="loading loading07">
        {siteName.split('').map((letter, index) => (
          <span key={index} data-text={letter === ' ' ? '\u00A0' : letter}>
            {letter === ' ' ? '\u00A0' : letter}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Preloader;