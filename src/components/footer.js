import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={footerStyle}>
      {/* Footer content */}
      <div style={footerContentStyle}>
        {/* Left section with website title, address, and phone number */}
        <div style={leftSectionStyle}>
          <h2 style={titleStyle}>Swarn Sarthi</h2>
          <p style={addressStyle}>123 Main Street, Delhi, India</p>
          <p style={phoneStyle}>Phone: +123 456 7890</p>
        </div>
        {/* Right section with navigation buttons */}
        <div style={rightSectionStyle}>
          <Link to="/about" style={navigationLinkStyle}>About Us</Link>
          <Link to="/services" style={navigationLinkStyle}>Services</Link>
        </div>
        {/* Social media icons */}
        <div style={socialIconsContainerStyle}>
          <a href="https://www.facebook.com"><FaFacebook style={iconStyle} /></a>
          <a href="https://twitter.com"><FaTwitter style={iconStyle} /></a>
          <a href="https://www.instagram.com"><FaInstagram style={iconStyle} /></a>
          <a href="https://www.linkedin.com"><FaLinkedin style={iconStyle} /></a>
        </div>
      </div>
      {/* Copyright text */}
      <p style={copyrightStyle}>&copy; {new Date().getFullYear()} Swarn Sarthi</p>
    </footer>
  );
}

// Styles
const footerStyle = {
  backgroundColor: '#45526e',
  color: '#fff',
  padding: '20px',
};

const footerContentStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const leftSectionStyle = {
  textAlign: 'left',
};

const rightSectionStyle = {
  textAlign: 'center',
  // marginLeft: 'auto', // Add margin to match indentation with leftSectionStyle
};

const titleStyle = {
  color: '#fff',
  marginBottom: '10px',
  fontSize: '24px',
};

const addressStyle = {
  color: '#fff',
  marginBottom: '5px',
};

const phoneStyle = {
  color: '#fff',
};

const navigationLinkStyle = {
  color: '#fff',
  textDecoration: 'none',
  marginLeft: '10px',
};

const socialIconsContainerStyle = {
  textAlign: 'center',
};

const iconStyle = {
  fontSize: '24px',
  margin: '0 10px',
  color: '#fff',
};

const copyrightStyle = {
  marginTop: '20px',
  textAlign: 'center',
};

export default Footer;
