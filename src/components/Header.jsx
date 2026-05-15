import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { siteData } from '../data/data';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    document.body.classList.remove('locked');
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.classList.toggle('locked', !isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.classList.remove('locked');
  };

  const isActiveLink = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
        <div className="container-fluid">
          <div className="header-wrapper">
            <div className="header-left">
              <Link to="/" className="logo">
                <img
                  src={siteData.logo}
                  alt={siteData.siteName}
                  className="logo-image"
                />
                <span className="logo-text">{siteData.siteName}</span>
              </Link>
            </div>

            <div className="header-right">
              <nav className="desktop-nav">
                <ul className="nav-menu">
                  {siteData.navigation.map((item, index) => (
                    <li key={index} className={`nav-menu-item ${item.dropdown ? 'has-dropdown' : ''}`}>
                      {item.dropdown ? (
                        <>
                          <span className="nav-menu-link">
                            {item.name}
                            <i className="fa fa-chevron-down dropdown-icon"></i>
                          </span>
                          <ul className="dropdown-menu">
                            {item.dropdown.map((subItem, subIndex) => (
                              <li key={subIndex} className="dropdown-item">
                                <Link to={subItem.path} className={`dropdown-link ${isActiveLink(subItem.path) ? 'active' : ''}`}>
                                  {subItem.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <Link to={item.path} className={`nav-menu-link ${isActiveLink(item.path) ? 'active' : ''}`}>
                          {item.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>

              <Link to="/booking" className="btn-cta desktop-only">
                {/* Bus Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 6v6" /><path d="M16 6v6" /><path d="M2 12h20" />
                  <path d="M4 12V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6" />
                  <path d="M4 12v5a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h10v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-5" />
                  <circle cx="7.5" cy="18.5" r="1.5" /><circle cx="16.5" cy="18.5" r="1.5" />
                </svg>
                <span>Book Now</span>
              </Link>

              <button className="mobile-menu-toggle" onClick={toggleMobileMenu} aria-label="Toggle menu">
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className={`mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={closeMobileMenu}></div>

      <div className={`mobile-sidebar ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-sidebar-header">
          <Link to="/" className="mobile-logo" onClick={closeMobileMenu}>
            <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>{siteData.siteName}</span>
          </Link>
          <button className="mobile-close-btn" onClick={closeMobileMenu}><i className="fa fa-times"></i></button>
        </div>

        <nav className="mobile-nav-menu">
          {siteData.navigation.map((item, index) => (
            <MobileNavItem key={index} item={item} isActive={isActiveLink} onLinkClick={closeMobileMenu} />
          ))}
        </nav>

        <div className="mobile-sidebar-footer">
          <div className="mobile-contact-info">
            <a href={`mailto:${siteData.contact.email}`} className="contact-link">
              <i className="fa fa-envelope"></i><span>{siteData.contact.email}</span>
            </a>
            <a href={`tel:${siteData.contact.phoneFormatted}`} className="contact-link">
              <i className="fa fa-phone"></i><span>{siteData.contact.phone}</span>
            </a>
          </div>
          <Link to="/booking" className="btn-cta mobile-cta-btn" onClick={closeMobileMenu}>Book Now</Link>
        </div>
      </div>
    </>
  );
};

const MobileNavItem = ({ item, isActive, onLinkClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!item.dropdown) {
    return (
      <div className="mobile-nav-item">
        <Link to={item.path} className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`} onClick={onLinkClick}>
          {item.name}
        </Link>
      </div>
    );
  }

  return (
    <div className={`mobile-nav-item has-submenu ${isOpen ? 'submenu-open' : ''}`}>
      <div className="mobile-nav-link" onClick={() => setIsOpen(!isOpen)}>
        <span>{item.name}</span>
        <i className={`fa fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
      </div>
      <div className={`mobile-submenu ${isOpen ? 'active' : ''}`}>
        {item.dropdown.map((subItem, subIndex) => (
          <Link key={subIndex} to={subItem.path} className={`mobile-submenu-link ${isActive(subItem.path) ? 'active' : ''}`} onClick={onLinkClick}>
            {subItem.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Header;