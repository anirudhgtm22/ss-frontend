import React from 'react';
import Navbar from './navbar';
import Footer from './footer';
import { Typography } from '@mui/material';
import CarouselComp from './Carousel';
import Image from '../components/assets/img7.png';

const Homepage = () => {
  const headingStyle = {
    color: '#4c9576',
    fontFamily: 'Libre Baskerville, serif',
    fontSize: '36px',
    marginTop: '20px',
    textAlign: 'center',
  };
  
  const imageStyle = {
    width: '100%',
    height: 'auto',
    marginTop: '20px',
  };

  const paragraphStyle = {
    fontFamily: 'Source Sans Pro, sans-serif',
    fontSize: '20px',
    marginTop: '20px',
    padding: '0 20px', // Add padding for mobile
    textAlign: 'center',
  };

  return (
    <div>
      {/* <Navbar /> */}
      <div style={{ marginTop: '5px' }}>
        <CarouselComp />
      </div>
      <div style={{ 
        backgroundColor: 'hsla(44.01869159,100%,58.03921569%,1)', 
        marginTop: '5px', 
        padding: '20px', 
        textAlign: 'center',
      }}>
        <Typography variant="body1" paragraph align="center" style={paragraphStyle}>
          We are a group of young graduates who have an affection towards the elderly and look forward to creating meaningful bonds with our Grandpals. We would do everything that your grandkid would do for you!
        </Typography>
      </div>
      <Typography variant="h4" align="center" style={headingStyle}>A Glimpse into a Goodfellow-Grandpal Friendship</Typography>
      <img src={Image} alt="Glimpse" style={imageStyle} />
      <Footer />
    </div>
  );
}

export default Homepage;
