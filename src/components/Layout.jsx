/**
 * Layout Component
 * =================
 * Main layout wrapper with header and footer
 */

import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import Preloader from './Preloader';
import FloatingWhatsApp from './FloatingWhatsApp';
const Layout = () => {
  return (
    <>
      <Preloader />
      <Header />
      <main className="main-content"> {/* Add the className here */}
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <ScrollToTop />
    </>
  );
};

export default Layout;