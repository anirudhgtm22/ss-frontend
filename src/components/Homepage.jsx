import React from 'react';
import Navbar from './navbar';
import Footer from './footer';
import { Typography } from '@mui/material';
import CarouselComp from './Carousel';
import Image from '../components/assets/img7.png'

const Homepage = () => {

  const headingStyle = {
    color: '#4c9576',
    fontFamily: 'Libre Baskerville, serif',
    fontSize: '36px', // Increase font size
    marginTop: '20px',
    textAlign: 'center', // Align to center
  };
  
  // Image styles
  const imageStyle = {
    maxWidth: '100%',
    height: 'auto',
    marginTop: '20px',
  };

  return (
    <div>
      {/* <Navbar /> */}
      <div style={{ marginTop: '0px' }}> {/* Adjust margin-top to accommodate navbar */}
        <CarouselComp />
      </div>
      <div style={{ 
        backgroundColor: 'hsla(44.01869159,100%,58.03921569%,1)', 
        marginTop: '10px', 
        padding: '20px', 
        textAlign: 'center', 
        height: '200px',
        textAlign: 'center',
        whiteSpace: 'pre-wrap',
        transitionTimingFunction: 'ease',
        transitionDuration: '0.4s',
        transitionDelay: '0.120896s',
        fontFamily: 'Source Sans Pro, sans-serif'
      }}>
        <Typography variant="body1" paragraph align="center" style={{ fontFamily: 'Source Sans Pro, sans-serif', fontSize: '28px', marginTop: '20px'}}>
          We are a group of young graduates who have an affection towards the elderly and look <br></br>forward to creating meaningful bonds with our Grandpals and as we say, we would do<br></br> everything that your grandkid would do for you!
        </Typography>
      </div>
      <h2 style={headingStyle}>A Glimpse into a Goodfellow-Grandpal friendship</h2>
      <img src={Image} alt="Glimpse" style={imageStyle} />
      <Footer />
    </div>
  );
}

export default Homepage;