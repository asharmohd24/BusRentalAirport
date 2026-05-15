/**
 * 404 Not Found Page
 * ===================
 */

import { Link } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';

const NotFound = () => {
  useSEO({
    title: '404 – Page Not Found',
    description: 'The page you are looking for could not be found. Return to the Global Bus Charter homepage.',
  });
  return (
    <section className="not-found-section pt-80 pb-80">
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-lg-6 text-center">
            <div className="not-found-content">
              <h1 className="error-code">404</h1>
              <h2 className="error-title">Page Not Found</h2>
              <p className="error-text">
                Oops! The page you are looking for might have been removed, 
                had its name changed, or is temporarily unavailable.
              </p>
              <Link to="/" className="cus-btn">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
