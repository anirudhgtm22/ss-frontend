import React from 'react';
import Navbar from './navbar';
import Footer from './footer';

import CarouselComp from './Carousel';

const Homepage = () => {
  return (
    <div>
      {/* <Navbar /> */}
      <div style={{ marginTop: '0px' }}> {/* Adjust margin-top to accommodate navbar */}
        <CarouselComp />
      </div>
      <Footer />
    </div>
  );
}

export default Homepage;
