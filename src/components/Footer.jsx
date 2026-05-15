/**
 * Footer Component - Fixed
 */

import { Link } from 'react-router-dom';
import { siteData } from '../data/data';

const Footer = () => {
  return (
    <footer>
      <div className="container-fluid">
        <div className="footer-top">
          <div className="row row-gap-4">
            {/* About Column */}
            <div className="col-lg-3 col-md-6">
              <div className="footer-about">
                <Link to="/" className="footer-logo-link">
                  <span style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700 }}>{siteData.siteName}</span>
                </Link>
                <p style={{ marginTop: '16px' }}>{siteData.footer.description}</p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-lg-2 col-md-6">
              <h5 className="footer-title">Quick Links</h5>
              <ul className="footer-links">
                {siteData.footer.quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link to={link.path}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="col-lg-2 col-md-6">
              <h5 className="footer-title">Our Services</h5>
              <ul className="footer-links">
                {siteData.footer.serviceLinks.map((link, index) => (
                  <li key={index}>
                    <Link to={link.path}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="col-lg-3 col-md-6">
              <h5 className="footer-title">Contact Info</h5>
              <div className="footer-contact">
                <div className="footer-contact-item">
                  <i className="fa fa-map-marker-alt"></i>
                  <span>{siteData.contact.address.full}</span>
                </div>
                <div className="footer-contact-item">
                  <i className="fa fa-phone"></i>
                  <a href={`tel:${siteData.contact.phoneFormatted}`}>{siteData.contact.phone}</a>
                </div>
                <div className="footer-contact-item">
                  <i className="fa fa-envelope"></i>
                  <a href={`mailto:${siteData.contact.email}`}>{siteData.contact.email}</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-inner">
            <p className="copyright-text">{siteData.footer.copyright}</p>
            {/* <div className="payment-cards">
              {siteData.footer.paymentMethods.slice(0, 4).map((path, index) => (
                <img
                  key={index}
                  src={path}
                  alt={`Payment ${index + 1}`}
                  className="payment-card-img"
                />
              ))}
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
