/**
 * Blogs Page - With search, category filtering, and dynamic SEO
 */

import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { siteData } from '../data/data';
import { useSEO } from '../hooks/useSEO';
import PageBanner from '../components/PageBanner';

const Blogs = () => {
  const { seo, bannerTitle, tag, title, subtitle, searchPlaceholder, noResultsTitle, noResultsText, noResultsBtnText } = siteData.pages.blogs;

  useSEO({
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  
  // Get active category from URL params
  const activeCategory = searchParams.get('category') || 'All';

  // Dynamic SEO title & meta
  useEffect(() => {
    const titleParts = ['Blog'];
    if (activeCategory !== 'All') titleParts.push(activeCategory);
    if (searchParams.get('search')) titleParts.push(`Search: "${searchParams.get('search')}"`);
    
    const pageTitle = titleParts.join(' - ') + ` | ${siteData.siteName}`;
    document.title = pageTitle;

    const metaDesc = activeCategory !== 'All'
      ? `Browse our ${activeCategory} articles. ${siteData.siteDescription}`
      : `Stay informed with the latest news, travel tips, and insights from ${siteData.siteName}.`;
    
    updateMeta('description', metaDesc);
    updateMeta('og:title', pageTitle);
    updateMeta('og:description', metaDesc);
    updateMeta('og:type', 'website');

    return () => {
      document.title = siteData.seo.defaultTitle;
    };
  }, [activeCategory, searchParams]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(siteData.blogPosts.map(p => p.category))];
    return ['All', ...cats];
  }, []);

  // Filter posts by category and search
  const filteredPosts = useMemo(() => {
    let posts = siteData.blogPosts;

    if (activeCategory && activeCategory !== 'All') {
      posts = posts.filter(p => p.category === activeCategory);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      posts = posts.filter(p =>
        p.title.toLowerCase().includes(term) ||
        p.excerpt.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        (p.tags && p.tags.some(tag => tag.toLowerCase().includes(term)))
      );
    }

    return posts;
  }, [activeCategory, searchTerm]);

  const handleCategoryClick = (category) => {
    const params = new URLSearchParams(searchParams);
    if (category === 'All') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchTerm.trim()) {
      params.set('search', searchTerm.trim());
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    const params = new URLSearchParams(searchParams);
    params.delete('search');
    setSearchParams(params);
  };

  const handleClearAll = () => {
    setSearchTerm('');
    setSearchParams({});
  };

  const hasActiveFilters = activeCategory !== 'All' || searchParams.get('search');

  return (
    <>
      <PageBanner title={bannerTitle} />

      <section className="blogs-section pt-60 pb-60">
        <div className="container-fluid">
          <div className="text-center mb-40">
            <span className="section-tag">{tag}</span>
            <h2 className="section-title">{title}</h2>
            <p className="section-subtitle">{subtitle}</p>
          </div>

          {/* Search & Filter Bar */}
          <div className="blog-filters mb-40">
            <form className="blog-search-form" onSubmit={handleSearch}>
              <div className="search-input-wrapper">
                <SearchIcon />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button type="button" className="search-clear-btn" onClick={handleClearSearch} aria-label="Clear search">
                    <CloseIcon />
                  </button>
                )}
              </div>
              <button type="submit" className="cus-btn search-submit-btn">Search</button>
            </form>

            {/* <div className="blog-categories-filter">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`category-pill ${activeCategory === category ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                  {category !== 'All' && (
                    <span className="category-count">
                      {siteData.blogPosts.filter(p => p.category === category).length}
                    </span>
                  )}
                </button>
              ))}
            </div> */}

            {hasActiveFilters && (
              <div className="active-filters">
                <span className="active-filters-label">Showing:</span>
                {activeCategory !== 'All' && (
                  <span className="filter-tag">
                    {activeCategory}
                    <button onClick={() => handleCategoryClick('All')} aria-label="Remove category filter">
                      <CloseIcon />
                    </button>
                  </span>
                )}
                {searchParams.get('search') && (
                  <span className="filter-tag">
                    "{searchParams.get('search')}"
                    <button onClick={handleClearSearch} aria-label="Remove search filter">
                      <CloseIcon />
                    </button>
                  </span>
                )}
                <button className="clear-all-btn" onClick={handleClearAll}>Clear All</button>
              </div>
            )}
          </div>

          {hasActiveFilters && (
            <p className="results-count mb-24">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'} found
            </p>
          )}

          {filteredPosts.length > 0 ? (
            <div className="blogs-grid">
              {filteredPosts.map((post) => (
                <article key={post.id} className="blog-card">
                  <div className="blog-image">
                    {post.image ? (
                      <img src={post.image} alt={post.title} loading="lazy" />
                    ) : (
                      <div className="placeholder-img blog-image-placeholder">
                        <span>{post.category}</span>
                      </div>
                    )}
                    <span className="blog-category">{post.category}</span>
                  </div>
                  <div className="blog-content">
                    <div className="blog-meta">
                      <span><CalendarIcon /> {new Date(post.date).toLocaleDateString()}</span>
                      <span><UserIcon /> {post.author}</span>
                    </div>
                    <h5 className="blog-title">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h5>
                    <p className="blog-excerpt">{post.excerpt}</p>
                    <Link to={`/blog/${post.slug}`} className="read-more">
                      Read More <ArrowIcon />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="no-results text-center">
              <div className="no-results-icon">
                <SearchIcon />
              </div>
              <h4>{noResultsTitle}</h4>
              <p>{noResultsText}</p>
              <button className="cus-btn mt-16" onClick={handleClearAll}>{noResultsBtnText}</button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

// Helper to update or create meta tags
function updateMeta(name, content) {
  const isOg = name.startsWith('og:');
  const selector = isOg
    ? `meta[property="${name}"]`
    : `meta[name="${name}"]`;
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    if (isOg) {
      el.setAttribute('property', name);
    } else {
      el.setAttribute('name', name);
    }
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

// Icon Components
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

export default Blogs;