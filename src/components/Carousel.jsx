import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from './Image.jpg'; 

function CarouselComp() {
  const [index, setIndex] = useState(0);

  // Use useEffect to start the interval when the component mounts
  useEffect(() => {  
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % 3); // Assuming there are 3 slides
    }, 2000); // Change slide every 2 seconds

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    afterChange: (current) => setIndex(current)
  };

  const carouselStyle = {
    height: '75vh', // 3/4 of the viewport height
    overflow: 'hidden',
    position: 'relative'
  };

  const imageContainerStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end' // Align the image to the bottom
  };

  const imageStyle = {
    width: '100%',
    objectFit: 'contain' // Fit the image inside
  };

  return (
    <div className="carousel-wrapper" style={carouselStyle}>
      <Slider {...settings} className="carousel">
        <div style={imageContainerStyle}>
          <img src={Image} alt="First slide" style={imageStyle} />
        </div>
        <div style={imageContainerStyle}>
          <img src={Image} alt="Second slide" style={imageStyle} />
        </div>
        <div style={imageContainerStyle}>
          <img src={Image} alt="Third slide" style={imageStyle} />
        </div>
      </Slider>
    </div>
  );
}

export default CarouselComp;
