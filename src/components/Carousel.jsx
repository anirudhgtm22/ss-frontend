import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import img1 from '../components/assets/img1.png'
import img2 from '../components/assets/img2.png'
import img3 from '../components/assets/img3.png'
import img4 from '../components/assets/img4.png'
import img5 from '../components/assets/img5.png'
import img6 from '../components/assets/img6.png'

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
    height: '99vh', // 3/4 of the viewport height
    overflow: 'hidden',
    position: 'relative'
  };

  const imageContainerStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center', // Center the image vertically and horizontally
    overflow: 'hidden' // Hide any overflow to prevent cropping
  };

  const imageStyle = {
    maxWidth: '100%', // Ensure the image doesn't exceed the container width
    maxHeight: '100%', // Ensure the image doesn't exceed the container height
  }; 

  return (
    <div className="carousel-wrapper" style={carouselStyle}>
      <Slider {...settings} className="carousel">
        <div style={imageContainerStyle}>
          <img src={img1} alt="First slide" style={imageStyle} />
        </div>
        <div style={imageContainerStyle}>
          <img src={img2} alt="Second slide" style={imageStyle} />
        </div>
        <div style={imageContainerStyle}>
          <img src={img3} alt="Third slide" style={imageStyle} />
        </div>
        <div style={imageContainerStyle}>
          <img src={img4} alt="Third slide" style={imageStyle} />
        </div>
        <div style={imageContainerStyle}>
          <img src={img5} alt="Third slide" style={imageStyle} />
        </div>
        <div style={imageContainerStyle}>
          <img src={img6} alt="Third slide" style={imageStyle} />
        </div>
      </Slider>
    </div>
  );
}

export default CarouselComp;
