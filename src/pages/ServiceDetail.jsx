/**
 * Service Detail Page - With actual images from data
 */

import { useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { siteData, getServiceBySlug } from '../data/data';
import { useSEO } from '../hooks/useSEO';
import PageBanner from '../components/PageBanner';

const ServiceDetail = () => {
  const { slug } = useParams();
  const [activeFaq, setActiveFaq] = useState(0);
  
  // Find the service by slug, or default to first service if no slug
  const service = slug ? getServiceBySlug(slug) : siteData.services[0];
  
  // If service not found, redirect to services page
  if (!service) {
    return <Navigate to="/services" replace />;
  }

  useSEO({
    title: service.title,
    description: service.description,
    image: service.image,
    keywords: `${service.title.toLowerCase()}, charter bus service, group transportation, ${siteData.seo.keywords}`,
    type: 'article',
  });

  return (
    <>
      <PageBanner 
        title={service.title}
        breadcrumb={[
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
          { name: service.title, path: null },
        ]} 
      />

      <section className="service-detail-section pt-80 pb-80">
        <div className="container-fluid">
          <div className="row">
            {/* Main Content */}
            <div className="col-lg-8">
              <div className="service-detail-content">
                {/* Service Icon and Title */}
                <div className="service-header mb-32">
                  <div className="service-icon-large">
                    <ServiceIcon type={service.icon} />
                  </div>
                  <h2 className="title">{service.title}</h2>
                </div>

                {/* Full Description */}
                <p className="description mb-32">{service.fullDescription || service.description}</p>

                {/* Service Image */}
                <div className="service-image mb-32">
                  {service.image ? (
                    <img src={service.image} alt={service.title} loading="lazy" />
                  ) : (
                    <div className="placeholder-img service-image-placeholder">
                      <span>{service.title}</span>
                    </div>
                  )}
                </div>

                {/* Features Section */}
                {service.features && service.features.length > 0 && (
                  <>
                    <h4 className="subtitle mb-16">What's Included</h4>
                    <ul className="service-features mb-32">
                      {service.features.map((feature, index) => (
                        <li key={index}>
                          <i className="fa fa-check text-primary"></i> {feature}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {/* Benefits Section */}
                {service.benefits && service.benefits.length > 0 && (
                  <>
                    <h4 className="subtitle mb-24">Why Choose This Service</h4>
                    <div className="benefits-grid mb-32">
                      {service.benefits.map((benefit, index) => (
                        <div key={index} className="benefit-card">
                          <div className="benefit-icon">
                            <BenefitIcon index={index} />
                          </div>
                          <h5>{benefit.title}</h5>
                          <p>{benefit.description}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Service FAQs */}
                {service.faqs && service.faqs.length > 0 && (
                  <>
                    <h4 className="subtitle mb-24">Frequently Asked Questions</h4>
                    <div className="service-faqs mb-32">
                      {service.faqs.map((faq, index) => (
                        <div 
                          key={index} 
                          className={`faq-item ${activeFaq === index ? 'active' : ''}`}
                        >
                          <div 
                            className="faq-question" 
                            onClick={() => setActiveFaq(activeFaq === index ? -1 : index)}
                          >
                            <h5>{faq.question}</h5>
                            <i className={`fa fa-chevron-${activeFaq === index ? 'up' : 'down'}`}></i>
                          </div>
                          <div className={`faq-answer ${activeFaq === index ? 'faq-answer--active' : ''}`}>
                            <p>{faq.answer}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* CTA Button */}
                <Link to="/booking" className="cus-btn">
                  Book This Service
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              <div className="sidebar">
                {/* All Services Widget */}
                <div className="sidebar-widget">
                  <h5 className="widget-title">All Services</h5>
                  <ul className="service-list">
                    {siteData.services.map((s) => (
                      <li key={s.id} className={s.slug === slug ? 'active' : ''}>
                        <Link to={s.link}>
                          <ServiceIconSmall type={s.icon} />
                          <span>{s.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contact Widget */}
                <div className="sidebar-widget contact-widget">
                  <h5 className="widget-title">Need Help?</h5>
                  <p>Have questions about this service? Our team is here to help.</p>
                  <a href={`tel:${siteData.contact.phoneFormatted}`} className="cus-btn">
                    <i className="fa fa-phone"></i> {siteData.contact.phone}
                  </a>
                  <Link to="/contact" className="cus-btn secondary mt-12">
                    <i className="fa fa-envelope"></i> Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="related-services pt-60 pb-60 bg-light">
        <div className="container-fluid">
          <div className="text-center mb-40">
            <span className="section-tag">Explore More</span>
            <h2 className="section-title">Other Services You May Like</h2>
          </div>
          <div className="services-grid">
            {siteData.services
              .filter(s => s.id !== service.id)
              .slice(0, 3)
              .map((s) => (
                <Link to={s.link} key={s.id} className="service-card">
                  {/* Service Image - if image exists, show it */}
                  {s.image && (
                    <div className="service-image">
                      <img src={s.image} alt={s.title} loading="lazy" />
                    </div>
                  )}
                  <div className="service-card-header">
                    <div className="service-icon">
                      <ServiceIcon type={s.icon} />
                    </div>
                    <div className="service-arrow">
                      <i className="fa fa-arrow-right"></i>
                    </div>
                  </div>
                  <h5>{s.title}</h5>
                  <p>{s.description}</p>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
};

// Benefit icons based on index
const BenefitIcon = ({ index }) => {
  const icons = [
    // Productivity/Efficiency
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>,
    // Cost/Money
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>,
    // Environment/Leaf
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
    </svg>,
    // Heart/Satisfaction
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
    </svg>,
  ];
  return icons[index % icons.length];
};

// Small service icon for sidebar
const ServiceIconSmall = ({ type }) => {
  return (
    <span className="service-icon-small">
      <ServiceIcon type={type} />
    </span>
  );
};

// Service icons that match the service type
const ServiceIcon = ({ type }) => {
  const icons = {
    'corporate': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ),
    'airport': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
      </svg>
    ),
    'wedding': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        <circle cx="12" cy="13" r="2"/>
        <path d="M12 11v-1"/>
      </svg>
    ),
    'school': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
      </svg>
    ),
    'tour': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
        <line x1="9" y1="3" x2="9" y2="18"/>
        <line x1="15" y1="6" x2="15" y2="21"/>
      </svg>
    ),
    'event': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
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

export default ServiceDetail;