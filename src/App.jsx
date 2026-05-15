/**
 * Main App Component
 * ====================
 * Root component with routing and global providers
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { lazy, Suspense } from 'react';

// Styles
import './assets/css/app.css';

// Layout
import Layout from './components/Layout';

// Pages - Eagerly loaded
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
// Pages - Lazy loaded
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Booking = lazy(() => import('./pages/Booking'));
const OurCars = lazy(() => import('./pages/OurCars'));
const CarDetail = lazy(() => import('./pages/CarDetail'));
const Blogs = lazy(() => import('./pages/Blogs'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading component
const PageLoader = () => (
  <div className="page-loader">
    <div className="spinner"></div>
  </div>
);

function App() {
  // Get reCAPTCHA site key from environment variables
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY; // Test key for development

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={recaptchaSiteKey}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: 'head',
      }}
    >
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="services" element={<Services />} />
              {/* Dynamic service detail routes */}
              <Route path="services/:slug" element={<ServiceDetail />} />
              <Route path="service-detail" element={<ServiceDetail />} />
              <Route path="booking" element={<Booking />} />
              <Route path="our-fleet" element={<OurCars />} />
              {/* Dynamic vehicle/fleet detail routes */}
              <Route path="fleet/:slug" element={<CarDetail />} />
              <Route path="car-detail" element={<CarDetail />} />
              <Route path="blogs" element={<Blogs />} />
              {/* Dynamic blog detail routes */}
              <Route path="blog/:slug" element={<BlogDetail />} />
              <Route path="blog-detail" element={<BlogDetail />} />
              <Route path="contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </GoogleReCaptchaProvider>
  );
}

export default App;
