/**
 * Our Fleet Page - With left sidebar filters
 */

import { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { siteData } from '../data/data';
import { useSEO } from '../hooks/useSEO';
import PageBanner from '../components/PageBanner';

const OurCars = () => {
  const { seo, resultsTitle, ctaTitle, ctaText, ctaPrimaryBtnText, ctaPrimaryBtnLink, ctaSecondaryBtnText, ctaSecondaryBtnLink } = siteData.pages.ourFleet;

  useSEO({
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  });
  // Filter states
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [capacityFilter, setCapacityFilter] = useState('all');
  const [luggageFilter, setLuggageFilter] = useState('all');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // Ref for scrolling to results
  const resultsRef = useRef(null);

  // Scroll to results function
  const scrollToResults = () => {
    if (resultsRef.current && window.innerWidth < 992) {
      setTimeout(() => {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  // Filter handlers with scroll
  const handleCategoryChange = (value) => {
    setCategoryFilter(value);
    scrollToResults();
  };

  const handleCapacityChange = (value) => {
    setCapacityFilter(value);
    scrollToResults();
  };

  const handleLuggageChange = (value) => {
    setLuggageFilter(value);
    scrollToResults();
  };

  // Get unique categories from data
  const categories = useMemo(() => {
    const cats = [...new Set(siteData.cars.map(car => car.category))];
    return cats;
  }, []);

  // Dynamic seat capacity ranges based on data
  const capacityRanges = useMemo(() => {
    const ranges = [
      { label: 'All Capacities', value: 'all', count: siteData.cars.length },
    ];
    
    const rangeDefinitions = [
      { label: '1-10 Seats', value: '1-10', min: 1, max: 10 },
      { label: '11-20 Seats', value: '11-20', min: 11, max: 20 },
      { label: '21-30 Seats', value: '21-30', min: 21, max: 30 },
      { label: '31-40 Seats', value: '31-40', min: 31, max: 40 },
      { label: '41-50 Seats', value: '41-50', min: 41, max: 50 },
      { label: '51-60 Seats', value: '51-60', min: 51, max: 60 },
      { label: '60+ Seats', value: '60+', min: 61, max: 999 },
    ];

    rangeDefinitions.forEach(range => {
      const count = siteData.cars.filter(
        car => car.specs.passengers >= range.min && car.specs.passengers <= range.max
      ).length;
      if (count > 0) {
        ranges.push({ ...range, count });
      }
    });

    return ranges;
  }, []);

  // Dynamic luggage capacity ranges based on data
  const luggageRanges = useMemo(() => {
    const ranges = [
      { label: 'All Luggage', value: 'all', count: siteData.cars.length },
    ];
    
    const rangeDefinitions = [
      { label: '1-10 Bags', value: '1-10', min: 1, max: 10 },
      { label: '11-20 Bags', value: '11-20', min: 11, max: 20 },
      { label: '21-30 Bags', value: '21-30', min: 21, max: 30 },
      { label: '31-40 Bags', value: '31-40', min: 31, max: 40 },
      { label: '41-50 Bags', value: '41-50', min: 41, max: 50 },
      { label: '50+ Bags', value: '50+', min: 51, max: 999 },
    ];

    rangeDefinitions.forEach(range => {
      const count = siteData.cars.filter(
        car => car.specs.luggage >= range.min && car.specs.luggage <= range.max
      ).length;
      if (count > 0) {
        ranges.push({ ...range, count });
      }
    });

    return ranges;
  }, []);

  // Get category counts
  const getCategoryCount = (category) => {
    if (category === 'all') return siteData.cars.length;
    return siteData.cars.filter(car => car.category === category).length;
  };

  // Filtered and sorted cars (sorted by seat capacity - lowest first)
  const filteredCars = useMemo(() => {
    return siteData.cars
      .filter(car => {
        // Category filter
        if (categoryFilter !== 'all' && car.category !== categoryFilter) {
          return false;
        }
        
        // Capacity filter
        if (capacityFilter !== 'all') {
          const range = capacityRanges.find(r => r.value === capacityFilter);
          if (range && (car.specs.passengers < range.min || car.specs.passengers > range.max)) {
            return false;
          }
        }

        // Luggage filter
        if (luggageFilter !== 'all') {
          const range = luggageRanges.find(r => r.value === luggageFilter);
          if (range && (car.specs.luggage < range.min || car.specs.luggage > range.max)) {
            return false;
          }
        }
        
        return true;
      })
      // Sort by seat capacity (lowest first)
      .sort((a, b) => a.specs.passengers - b.specs.passengers);
  }, [categoryFilter, capacityFilter, luggageFilter, capacityRanges, luggageRanges]);

  // Reset filters
  const resetFilters = () => {
    setCategoryFilter('all');
    setCapacityFilter('all');
    setLuggageFilter('all');
  };

  const hasActiveFilters = categoryFilter !== 'all' || capacityFilter !== 'all' || luggageFilter !== 'all';
  const activeFilterCount = [categoryFilter, capacityFilter, luggageFilter].filter(f => f !== 'all').length;

  return (
    <>
      <PageBanner title="Our Fleet" />

      <section className="cars-section pt-60 pb-60">
        <div className="container-fluid">
          <div className="fleet-layout">
            {/* Left Sidebar Filters */}
            <aside className="fleet-sidebar">
              {/* Mobile Filter Toggle */}
              <button 
                className={`mobile-filter-toggle ${mobileFiltersOpen ? 'active' : ''}`}
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              >
                <span>
                  <FilterIcon /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
                </span>
                <ChevronIcon />
              </button>

              {/* Desktop Header */}
              <div className="sidebar-header">
                <h4>Filters</h4>
                {hasActiveFilters && (
                  <button className="clear-all-btn" onClick={resetFilters}>
                    Clear All
                  </button>
                )}
              </div>

              {/* Filter Content - Collapsible on Mobile */}
              <div className={`filter-content ${mobileFiltersOpen ? 'show' : ''}`}>
                {/* Mobile Clear Button */}
                {hasActiveFilters && (
                  <button className="mobile-clear-btn" onClick={resetFilters}>
                    Clear All Filters
                  </button>
                )}

                {/* Vehicle Type Filter */}
                <div className="filter-section">
                  <h5 className="filter-title">
                    <BusIcon /> Vehicle Type
                  </h5>
                  <ul className="filter-list">
                    <li>
                      <label className={`filter-checkbox ${categoryFilter === 'all' ? 'active' : ''}`}>
                        <input
                          type="radio"
                          name="category"
                          checked={categoryFilter === 'all'}
                          onChange={() => handleCategoryChange('all')}
                        />
                        <span className="checkmark"></span>
                        <span className="filter-name">All Types</span>
                        <span className="filter-count">{siteData.cars.length}</span>
                      </label>
                    </li>
                    {categories.map(cat => (
                      <li key={cat}>
                        <label className={`filter-checkbox ${categoryFilter === cat ? 'active' : ''}`}>
                          <input
                            type="radio"
                            name="category"
                            checked={categoryFilter === cat}
                            onChange={() => handleCategoryChange(cat)}
                          />
                          <span className="checkmark"></span>
                          <span className="filter-name">{cat}</span>
                          <span className="filter-count">{getCategoryCount(cat)}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Seat Capacity Filter */}
                <div className="filter-section">
                  <h5 className="filter-title">
                    <SeatsIcon /> Seat Capacity
                  </h5>
                  <ul className="filter-list">
                    {capacityRanges.map(range => (
                      <li key={range.value}>
                        <label className={`filter-checkbox ${capacityFilter === range.value ? 'active' : ''}`}>
                          <input
                            type="radio"
                            name="capacity"
                            checked={capacityFilter === range.value}
                            onChange={() => handleCapacityChange(range.value)}
                          />
                          <span className="checkmark"></span>
                          <span className="filter-name">{range.label}</span>
                          <span className="filter-count">{range.count}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Luggage Capacity Filter */}
                <div className="filter-section">
                  <h5 className="filter-title">
                    <LuggageFilterIcon /> Luggage Capacity
                  </h5>
                  <ul className="filter-list">
                    {luggageRanges.map(range => (
                      <li key={range.value}>
                        <label className={`filter-checkbox ${luggageFilter === range.value ? 'active' : ''}`}>
                          <input
                            type="radio"
                            name="luggage"
                            checked={luggageFilter === range.value}
                            onChange={() => handleLuggageChange(range.value)}
                          />
                          <span className="checkmark"></span>
                          <span className="filter-name">{range.label}</span>
                          <span className="filter-count">{range.count}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="fleet-content" ref={resultsRef}>
              <div className="fleet-header">
                <div className="results-info">
                  <h2 className="section-title">{resultsTitle}</h2>
                  <p className="results-count">
                    Showing <strong>{filteredCars.length}</strong> of {siteData.cars.length} vehicles
                    {/* <span className="sort-info"> • Sorted by seat capacity (smallest first)</span> */}
                  </p>
                </div>
              </div>

              {/* Cars Grid */}
              {filteredCars.length > 0 ? (
                <div className="cars-grid">
                  {filteredCars.map((bus) => (
                    <div key={bus.id} className="car-card">
                      <div className="car-image">
                        {bus.image ? (
                          <img src={bus.image} alt={bus.name} loading="lazy" />
                        ) : (
                          <div className="placeholder-img car-image-placeholder">
                            <span>{bus.category}</span>
                          </div>
                        )}
                        <span className="car-category">{bus.category}</span>
                      </div>
                      <div className="car-content">
                        <h5 className="car-name">{bus.name}</h5>
                        <div className="car-specs">
                          <span><PassengersIcon /> {bus.specs.passengers}</span>
                          <span><LuggageIcon /> {bus.specs.luggage}</span>
                          <span><WifiIcon /> {bus.features.includes('WiFi') ? 'WiFi' : 'No WiFi'}</span>
                        </div>
                        <div className="car-footer">
                          <Link to={`/fleet/${bus.slug}`} className="cus-btn small">View Details</Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-results">
                  <NoResultsIcon />
                  <h4>No vehicles found</h4>
                  <p>Try adjusting your filters to see more options.</p>
                  <button className="cus-btn" onClick={resetFilters}>Reset Filters</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section pt-60 pb-60 bg-light">
        <div className="container-fluid">
          <div className="cta-box">
            <div className="cta-content">
              <h2 className="cta-title">{ctaTitle}</h2>
              <p className="cta-text">{ctaText}</p>
            </div>
            <div className="cta-buttons">
              <Link to={ctaPrimaryBtnLink} className="cus-btn">{ctaPrimaryBtnText}</Link>
              <Link to={ctaSecondaryBtnLink} className="cus-btn secondary">{ctaSecondaryBtnText}</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

// Icon Components
const PassengersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const LuggageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <path d="M6 20h0a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h0"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

const WifiIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <path d="M5 13a10 10 0 0 1 14 0"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>
  </svg>
);

const BusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <path d="M8 6v6"/><path d="M16 6v6"/><path d="M2 12h20"/>
    <path d="M4 12V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6"/>
    <path d="M4 12v5a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h10v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-5"/>
    <circle cx="7.5" cy="18.5" r="1.5"/><circle cx="16.5" cy="18.5" r="1.5"/>
  </svg>
);

const SeatsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const LuggageFilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <path d="M6 20h0a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h0"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M12 10v6"/><path d="M9 13h6"/>
  </svg>
);

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);

const ChevronIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const NoResultsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="48" height="48">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M8 8l6 6"/><path d="M14 8l-6 6"/>
  </svg>
);

export default OurCars;