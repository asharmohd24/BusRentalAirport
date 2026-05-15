/**
 * PageBanner Component
 * =====================
 * Reusable banner for inner pages with breadcrumb
 */

import { Link } from 'react-router-dom';

const PageBanner = ({ title, breadcrumb = [] }) => {
  const defaultBreadcrumb = [
    { name: 'Home', path: '/' },
    { name: title, path: null },
  ];

  const crumbs = breadcrumb.length > 0 ? breadcrumb : defaultBreadcrumb;

  return (
    <section className="page-banner">
      <div className="container-fluid">
        <div className="banner-content text-center">
          <h1 className="banner-title">{title}</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center">
              {crumbs.map((crumb, index) => (
                <li 
                  key={index} 
                  className={`breadcrumb-item ${!crumb.path ? 'active' : ''}`}
                  aria-current={!crumb.path ? 'page' : undefined}
                >
                  {crumb.path ? (
                    <Link to={crumb.path}>{crumb.name}</Link>
                  ) : (
                    crumb.name
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    </section>
  );
};

export default PageBanner;
