import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import NavbarSearchModal from './NavbarSearchModal';
import logo from '../assets/dental-buddy-logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElMore, setAnchorElMore] = React.useState(null);

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleOpenMoreMenu = (event) => setAnchorElMore(event.currentTarget);
  const handleCloseMoreMenu = () => setAnchorElMore(null);

  const storedUser = localStorage.getItem('loggedInUser');
  const loggedInUser = storedUser ? JSON.parse(storedUser) : null;

  if (!loggedInUser) {
    return null;
  }

  console.log("Navbar loaded user:", loggedInUser);

  const isAdmin = loggedInUser?.role?.toLowerCase() === 'admin';

  const pages = [
    { title: 'Home', route: '/home', key: 'home' },
    { title: 'Patient Records', route: '/patient-records', key: 'patient-records' },
    { title: 'Appointments', route: '/appointments', key: 'appointments' },
    { title: 'Dental Assistant', route: '/dental-Assistant', key: 'dental-assistant' },
    { title: 'Illustrations', route: '/illustrations', key: 'illustrations' },
  ];

  const morePages = [
    { title: 'Inventory', route: '/stock', key: 'inventory' },
    { title: 'Finance & Billing', route: '/finance', key: 'finance' },
    { title: 'Dental Diary', route: '/notes', key: 'notes' },
    { title: 'Settings', route: '/config', key: 'settings' },
    { title: 'Admin Panel', route: '/admin-panel', key: 'admin-panel' },
  ];

  const allowedPages =
    isAdmin || loggedInUser?.permissions?.includes('all')
      ? [...pages, ...morePages].map((p) => p.key)
      : loggedInUser?.permissions || [];

  const filterByPermission = (page) => {
    if (isAdmin || allowedPages.includes('all')) return true;
    if (page.key === 'admin-panel') return false;
    return allowedPages.includes(page.key);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: '#2a97c9ff',
        boxShadow: 3,
        zIndex: 999,
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        {/* Logo + Title */}
        <Box
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => navigate('/home')}
        >
          <img
            src={logo}
            alt="DentalBuddy Logo"
            style={{
              height: 50,
              width: 50,
              borderRadius: '50%',
              objectFit: 'cover',
              marginRight: 10,
              backgroundColor: 'white',
            }}
          />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', lineHeight: 1.2 }}>
              DENTAL BUDDY
            </Typography>
            <Typography variant="caption" sx={{ color: 'white', fontSize: '0.9rem', letterSpacing: 0.5 }}>
              Your Complete Dental Practice Manager
            </Typography>
          </Box>
        </Box>

        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, alignItems: 'center' }}>
          {pages.filter(filterByPermission).map((page) => (
            <Typography
              key={page.title}
              onClick={() => navigate(page.route)}
              sx={{
                color: 'white',
                fontWeight: 500,
                fontSize: '1.09rem',
                cursor: 'pointer',
                '&:hover': {
                  color: '#e0f7fa',
                  textDecoration: 'underline',
                },
              }}
            >
              {page.title}
            </Typography>
          ))}

          {/* More Dropdown */}
          {(isAdmin || morePages.some((page) => allowedPages.includes(page.key))) && (
            <>
              <IconButton onClick={handleOpenMoreMenu} sx={{ color: 'white' }}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorElMore}
                open={Boolean(anchorElMore)}
                onClose={handleCloseMoreMenu}
              >
                {morePages
                  .filter((page) =>
                    isAdmin ? true : allowedPages.includes(page.key)
                  )
                  .map((page) => (
                    <MenuItem
                      key={page.title}
                      onClick={() => {
                        navigate(page.route);
                        handleCloseMoreMenu();
                      }}
                    >
                      {page.title}
                    </MenuItem>
                  ))}
              </Menu>
            </>
          )}

          {/* Global Search (Admin Only) */}
          {isAdmin && <NavbarSearchModal />}
        </Box>

        {/* Mobile Hamburger */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton onClick={handleOpenNavMenu} sx={{ color: 'white' }}>
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorElNav}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
          >
            {[...pages, ...morePages].filter(filterByPermission).map((page) => (
              <MenuItem
                key={page.title}
                onClick={() => {
                  navigate(page.route);
                  handleCloseNavMenu();
                }}
              >
                {page.title}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
