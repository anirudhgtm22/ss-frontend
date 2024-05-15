import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Cookies from 'js-cookie';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Clear token from cookies
    Cookies.remove('token');

    // Redirect to homepage
    window.location.href = '/';
  };

  const isTokenExists = () => {
    const token = Cookies.get('token');
    return token ? true : false;
  };

  const getUserRole = () => {
    const role = Cookies.get('role');
    return role ? role : null;
  };

  return (
    <AppBar position="sticky" style={{ backgroundColor: 'black', zIndex: 1000 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'white', textDecoration: 'none' }}>
          <RouterLink to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Swarn Sarthi</RouterLink>
        </Typography>

        <Typography variant="body1">
          <RouterLink to="/about" style={{ marginRight: '20px', color: 'inherit', textDecoration: 'none' }}>About</RouterLink>
          <RouterLink to="/services" style={{ marginRight: '20px', color: 'inherit', textDecoration: 'none' }}>Services</RouterLink>
          {isTokenExists() && (
            <RouterLink to={getUserRole() === 'volunteer' ? "/active-orders" : "/book-now"} style={{ marginRight: '20px', color: 'inherit', textDecoration: 'none' }}>{getUserRole() === 'volunteer' ? "Accept Orders" : "Book Now"}</RouterLink>
          )}
        </Typography>

        <IconButton onClick={handleMenuClick} size="large" color="inherit" sx={{ marginLeft: 'auto' }}>
          <Avatar alt="Profile" src={null} sx={{ bgcolor: 'grey' }}>
            <AccountCircleIcon />
          </Avatar>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {isTokenExists() ? (
            <>
              <MenuItem component={RouterLink} to="/profile" onClick={handleMenuClose}>My Account</MenuItem>
              <MenuItem component={RouterLink} to="/service-requests" onClick={handleMenuClose}>My Service Requests</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </>
          ) : (
            <MenuItem component={RouterLink} to="/login" onClick={handleMenuClose}>
              Login
            </MenuItem>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
