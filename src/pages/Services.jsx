/**
 * Services Page - With actual images from data
 */

import { Link } from 'react-router-dom';
import { siteData } from '../data/data';
import { useSEO } from '../hooks/useSEO';
import PageBanner from '../components/PageBanner';

const Services = () => {
  const { seo, tag, title, subtitle, processTag, processTitle, ctaTitle, ctaText, ctaBtnText, ctaBtnLink } = siteData.pages.services;

  useSEO({
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  });
  return (
    <>
      <PageBanner title="Our Services" />

      <section className="services-section pt-60 pb-60">
        <div className="container-fluid">
          <div className="text-center mb-40">
            <span className="section-tag">{tag}</span>
            <h2 className="section-title">{title}</h2>
            <p className="section-subtitle">{subtitle}</p>
          </div>
          <div className="services-grid">
            {siteData.services.map((service) => (
              <Link to={service.link} key={service.id} className="service-card">
                {service.image && (
                  <div className="service-image">
                    <img src={service.image} alt={service.title} loading="lazy" />
                  </div>
                )}
                <div className="service-card-header">
                  <div className="service-icon">
                    <ServiceIcon type={service.icon} />
                  </div>
                  <div className="service-arrow">
                    <i className="fa fa-arrow-right"></i>
                  </div>
                </div>
                <h5>{service.title}</h5>
                <p>{service.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section pt-60 pb-60 bg-light">
        <div className="container-fluid">
          <div className="text-center mb-40">
            <span className="section-tag">{processTag}</span>
            <h2 className="section-title">{processTitle}</h2>
          </div>
          <div className="row row-gap-4">
            {siteData.whyChooseUs.map((item, index) => (
              <div key={item.id} className="col-lg-4 col-md-6">
                <div className="process-block">
                  <div className="step-number">{String(index + 1).padStart(2, '0')}</div>
                  <h5 className="title">{item.title}</h5>
                  <p className="description">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section pt-60 pb-60">
        <div className="container-fluid">
          <div className="cta-box">
            <div className="cta-content">
              <h2 className="cta-title">{ctaTitle}</h2>
              <p className="cta-text">{ctaText}</p>
            </div>
            <div className="cta-buttons">
              <Link to={ctaBtnLink} className="cus-btn">{ctaBtnText}</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

// Service icons that match the service type
const ServiceIcon = ({ type }) => {
  const icons = {
    // Corporate: Briefcase icon
    'corporate': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        <line x1="6" y1="11" x2="6" y2="11"/>
        <line x1="18" y1="11" x2="18" y2="11"/>
      </svg>
    ),
    // Airport: Airplane icon
    'airport': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
      </svg>
    ),
    // Wedding: Heart icon
    'wedding': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        <circle cx="12" cy="13" r="2"/>
        <path d="M12 11v-1"/>
      </svg>
    ),
    // School: Graduation cap icon
    'school': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
      </svg>
    ),
    // Tour: Map icon
    'tour': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
        <line x1="9" y1="3" x2="9" y2="18"/>
        <line x1="15" y1="6" x2="15" y2="21"/>
      </svg>
    ),
    // Event: Calendar icon
    'event': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    // Sports: Trophy icon
    'sports': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
        <path d="M4 22h16"/>
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
      </svg>
    ),
    // Shuttle/Default: Bus icon
    'shuttle': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 6v6"/><path d="M16 6v6"/><path d="M2 12h20"/>
        <path d="M4 12V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6"/>
        <path d="M4 12v5a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h10v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-5"/>
        <circle cx="7.5" cy="18.5" r="1.5"/><circle cx="16.5" cy="18.5" r="1.5"/>
      </svg>
    ),
  };
  return icons[type] || icons['shuttle'];
};

export default Services;