import React from 'react';
import Navbar from './navbar'; // Assuming you have a Navbar component
import { Container, Typography, Paper } from '@mui/material'; // Import Material-UI components
import Footer from './footer';

const AboutUsPage = () => {
  return (
    <div>
      {/* <Navbar /> */}
      <Container maxWidth="lg" style={{ paddingTop: '20px' }}>
        <Paper elevation={3} style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
          <Typography variant="h2" gutterBottom>
            About Us
          </Typography>
          <Typography variant="body1" paragraph>
            Swarn Sarthi web app is a digital platform designed to connect volunteers with elderly individuals who need assistance with daily tasks, such as grocery shopping, transportation, or even just companionship. The web app aims to bridge the gap between the elderly population and the younger generation by providing a platform for volunteers to offer their time and services to support the elderly community.
          </Typography>
          <Typography variant="body1" paragraph>
            The platform incorporates features such scheduling helps to facilitate seamless communication and coordination between volunteers and seniors. Additionally, Swarn Sarthi prioritizes safety and security, implementing thorough background checks and verification processes for all volunteers to guarantee a safe and trustworthy environment for both parties.
          </Typography>
          <Typography variant="body1" paragraph>
            By encouraging intergenerational connections and promoting acts of kindness and compassion, Swarn Sarthi not only enhances the quality of life for the elderly but also cultivates a culture of empathy and solidarity within communities. Through the power of technology and human connection, Swarn Sarthi is transforming the way we care for and support our elders, fostering a more inclusive and compassionate society for all.
          </Typography>
        </Paper>
      </Container>
      <div style={{ marginTop: '20px' }}>
        <Footer />
      </div>
    </div> 
  );
}

export default AboutUsPage;
