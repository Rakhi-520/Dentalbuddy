import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Header from './Header';

const Layout = () => {
  const location = useLocation();
  const hideOnRoutes = ['/']; // Login page
  const shouldHideHeaderAndNavbar = hideOnRoutes.includes(location.pathname);

  return (
    <div style={{ backgroundColor: '#edf3f7', minHeight: '100vh' }}>
      {!shouldHideHeaderAndNavbar && <Header />}
      {!shouldHideHeaderAndNavbar && <Navbar />}
      
      <main style={{ padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
