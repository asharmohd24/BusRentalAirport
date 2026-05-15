/**
 * Vehicle Detail Page
 * ================
 * Dynamic page that shows detailed information for each vehicle/bus
 */

import { Link, useParams, Navigate } from 'react-router-dom';
import { siteData, getVehicleBySlug } from '../data/data';
import { useSEO } from '../hooks/useSEO';
import PageBanner from '../components/PageBanner';

const CarDetail = () => {
  const { slug } = useParams();
  
  // Find the vehicle by slug, or default to first vehicle if no slug
  const vehicle = slug ? getVehicleBySlug(slug) : siteData.cars[0];
  
  // If vehicle not found, redirect to fleet page
  if (!vehicle) {
    return <Navigate to="/our-fleet" replace />;
  }

  useSEO({
    title: vehicle.name,
    description: vehicle.description || `Hire the ${vehicle.name} for your group travel. ${vehicle.capacity ? `Seats up to ${vehicle.capacity} passengers.` : ''} Book with Global Bus Charter today.`,
    image: vehicle.image,
    keywords: `${vehicle.name}, charter bus hire, ${vehicle.category || 'bus'} rental, group vehicle, ${siteData.seo.keywords}`,
    type: 'article',
  });

  return (
    <>
      <PageBanner 
        title={vehicle.name}
        breadcrumb={[
          { name: 'Home', path: '/' },
          { name: 'Our Fleet', path: '/our-fleet' },
          { name: vehicle.name, path: null },
        ]}
      />

      <section className="car-detail-section pt-80 pb-80">
        <div className="container-fluid">
          <div className="row">
            {/* Main Content */}
            <div className="col-lg-8">
              {/* Vehicle Image */}
              <div className="car-gallery mb-32">
                {vehicle.image ? (
                  <img src={vehicle.image} alt={vehicle.name} loading="lazy" />
                ) : (
                  <div className="placeholder-img car-gallery-placeholder">
                    <span>{vehicle.name}</span>
                  </div>
                )}
                <span className="vehicle-category-badge">{vehicle.category}</span>
              </div>

              {/* Vehicle Description */}
              <div className="car-description">
                <h3 className="mb-24">{vehicle.name}</h3>
                <p className="lead mb-24">{vehicle.fullDescription || `Experience spacious and comfortable group travel with our ${vehicle.name}. This ${vehicle.category.toLowerCase()} is perfect for corporate events, weddings, and long‑distance charters.`}</p>

                {/* Quick Specs */}
                <div className="quick-specs mb-32">
                  <div className="spec-item">
                    <PassengersIcon />
                    <span className="spec-value">{vehicle.specs.passengers}</span>
                    <span className="spec-label">Passengers</span>
                  </div>
                  <div className="spec-item">
                    <LuggageIcon />
                    <span className="spec-value">{vehicle.specs.luggage}</span>
                    <span className="spec-label">Luggage</span>
                  </div>
                  <div className="spec-item">
                    <RestroomIcon />
                    <span className="spec-value">{vehicle.specs.passengers > 30 ? 'Yes' : 'No'}</span>
                    <span className="spec-label">Restroom</span>
                  </div>
                  <div className="spec-item">
                    <WifiIcon />
                    <span className="spec-value">{vehicle.features.includes('WiFi') ? 'Yes' : 'No'}</span>
                    <span className="spec-label">WiFi</span>
                  </div>
                </div>

                {/* Features List */}
                <h4 className="mb-16">Features & Amenities</h4>
                {vehicle.amenities && vehicle.amenities.length > 0 ? (
                  <div className="amenities-grid mb-32">
                    {vehicle.amenities.map((amenity, index) => (
                      <div key={index} className="amenity-card">
                        <AmenityIcon type={amenity.icon} />
                        <div className="amenity-content">
                          <h5>{amenity.name}</h5>
                          <p>{amenity.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="feature-list mb-32">
                    {vehicle.features.map((feature, index) => (
                      <li key={index}>
                        <i className="fa fa-check text-primary"></i> {feature}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Ideal For */}
                {vehicle.idealFor && vehicle.idealFor.length > 0 && (
                  <>
                    <h4 className="mb-16">Ideal For</h4>
                    <div className="ideal-for-tags mb-32">
                      {vehicle.idealFor.map((use, index) => (
                        <span key={index} className="ideal-tag">{use}</span>
                      ))}
                    </div>
                  </>
                )}

                {/* Safety Features */}
                {vehicle.safetyFeatures && vehicle.safetyFeatures.length > 0 && (
                  <>
                    <h4 className="mb-16">Safety Features</h4>
                    <ul className="safety-features mb-32">
                      {vehicle.safetyFeatures.map((feature, index) => (
                        <li key={index}>
                          <ShieldIcon />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {/* Dimensions */}
                {vehicle.dimensions && (
                  <>
                    <h4 className="mb-16">Vehicle Dimensions</h4>
                    <div className="dimensions-grid mb-32">
                      <div className="dimension-item">
                        <span className="dimension-label">Length</span>
                        <span className="dimension-value">{vehicle.dimensions.length}</span>
                      </div>
                      <div className="dimension-item">
                        <span className="dimension-label">Width</span>
                        <span className="dimension-value">{vehicle.dimensions.width}</span>
                      </div>
                      <div className="dimension-item">
                        <span className="dimension-label">Height</span>
                        <span className="dimension-value">{vehicle.dimensions.height}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              <div className="booking-sidebar">
                {/* Specs Box */}
                <div className="specs-box">
                  <h5 className="mb-16">Quick Specs</h5>
                  <ul>
                    <li><span>Passengers:</span> <strong>{vehicle.specs.passengers}</strong></li>
                    <li><span>Luggage Capacity:</span> <strong>{vehicle.specs.luggage} bags</strong></li>
                    {/* <li><span>Doors:</span> <strong>{vehicle.specs.doors}</strong></li> */}
                    <li><span>Transmission:</span> <strong>{vehicle.specs.transmission}</strong></li>
                    <li><span>Fuel Type:</span> <strong>{vehicle.specs.fuel}</strong></li>
                    <li><span>Restroom:</span> <strong>{vehicle.specs.passengers > 30 ? 'Yes' : 'No'}</strong></li>
                    <li><span>WiFi:</span> <strong>{vehicle.features.includes('WiFi') ? 'Yes' : 'No'}</strong></li>
                  </ul>
                </div>

                {/* CTA Buttons */}
                <Link to="/booking" className="cus-btn w-100">
                  Request Quote
                </Link>
                <p className="contact-info mt-16 text-center">
                  Need help? Call <a href={`tel:${siteData.contact.phoneFormatted}`}>{siteData.contact.phone}</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Vehicles */}
      <section className="related-vehicles pt-60 pb-60 bg-light">
        <div className="container-fluid">
          <div className="text-center mb-40">
            <span className="section-tag">Our Fleet</span>
            <h2 className="section-title">Other Vehicles You May Like</h2>
          </div>
          <div className="cars-grid">
            {siteData.cars
              .filter(v => v.id !== vehicle.id)
              .slice(0, 4)
              .map((bus) => (
                <div key={bus.id} className="car-card">
                  <div className="car-image">
                    {bus.image ? (
                      <img src={bus.image} alt={bus.name} loading="lazy" />
                    ) : (
                      <div className="placeholder-img car-image-placeholder">
                        <span>Vehicle</span>
                      </div>
                    )}
                    <span className="car-category">{bus.category}</span>
                  </div>
                  <div className="car-content">
                    <h5 className="car-name">{bus.name}</h5>
                    <div className="car-specs">
                      <span><i className="fa fa-users"></i> {bus.specs.passengers}</span>
                      <span><i className="fa fa-suitcase"></i> {bus.specs.luggage}</span>
                      <span><i className="fa fa-wifi"></i> {bus.features.includes('WiFi') ? 'WiFi' : 'No WiFi'}</span>
                    </div>
                    <div className="car-footer">
                      <Link to={`/fleet/${bus.slug}`} className="cus-btn small">Details</Link>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </>
  );
};

// Icon Components
const PassengersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const LuggageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 20h0a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h0"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><rect x="6" y="12" width="12" height="8" rx="1"/>
  </svg>
);

const RestroomIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v4"/><path d="M12 18v4"/><path d="m4.93 4.93 2.83 2.83"/><path d="m16.24 16.24 2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="m4.93 19.07 2.83-2.83"/><path d="m16.24 7.76 2.83-2.83"/>
  </svg>
);

const WifiIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 13a10 10 0 0 1 14 0"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M2 8.82a15 15 0 0 1 20 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>
  </svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>
  </svg>
);

// Amenity icons based on type
const AmenityIcon = ({ type }) => {
  const icons = {
    'seat': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"/><path d="M3 11v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Z"/><path d="M5 18v2"/><path d="M19 18v2"/>
      </svg>
    ),
    'restroom': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v4"/><path d="M12 18v4"/><circle cx="12" cy="12" r="4"/>
      </svg>
    ),
    'wifi': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 13a10 10 0 0 1 14 0"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M2 8.82a15 15 0 0 1 20 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>
      </svg>
    ),
    'power': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2.81c1.12 0 2.19.93 2.19 2.08V16a2 2 0 0 1-2 2h-2"/>
        <line x1="23" y1="13" x2="23" y2="11"/><polygon points="11 6 7 12 13 12 9 18 15 12 9 12 13 6 11 6"/>
      </svg>
    ),
    'entertainment': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/>
      </svg>
    ),
    'climate': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
      </svg>
    ),
    'speaker': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
      </svg>
    ),
    'light': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
      </svg>
    ),
    'music': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
      </svg>
    ),
    'luggage': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 20h0a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h0"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
      </svg>
    ),
    'window': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="12" y1="3" x2="12" y2="21"/>
      </svg>
    ),
    'bar': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 22h8"/><path d="M12 11v11"/><path d="m19 3-7 8-7-8Z"/>
      </svg>
    ),
    'satellite': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13 7 9 3 5 7l4 4"/><path d="m17 11 4 4-4 4-4-4"/><path d="m8 12 4 4 6-6-4-4Z"/><path d="m16 8 3-3"/><path d="M9 21a6 6 0 0 0-6-6"/>
      </svg>
    ),
    'game': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="6" y1="11" x2="10" y2="11"/><line x1="8" y1="9" x2="8" y2="13"/><line x1="15" y1="12" x2="15.01" y2="12"/><line x1="18" y1="10" x2="18.01" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/>
      </svg>
    ),
    'floor': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/>
      </svg>
    ),
    'safety': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    'stop': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    ),
    'exit': (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
    ),
  };
  return icons[type] || icons['seat'];
};

export default CarDetail;