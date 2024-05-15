import React from 'react';
import Navbar from './navbar'; // Assuming you have a Navbar component
import { Container, Typography, Paper } from '@mui/material'; // Import Material-UI components

const AboutUsPage = () => {
  return (
    <div>
      {/* <Navbar /> */}
      <Container maxWidth="lg" style={{ paddingTop: '20px' }}>
        <Paper elevation={3} style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
          <Typography variant="h2" gutterBottom>About Us</Typography>
          <Typography variant="body1" paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor auctor ligula, nec aliquam risus consequat at. 
            Donec sit amet justo a velit ultricies placerat. Curabitur tincidunt, est nec vulputate accumsan, eros quam eleifend metus, 
            ac gravida dolor ante a ligula. Nunc id commodo justo, non varius felis. Fusce sed ex nec velit vehicula facilisis. 
            Sed hendrerit elit vitae felis blandit, eu sagittis justo pellentesque. Donec eu lacus libero. Nulla quis massa et elit consequat ultrices.
          </Typography>
          <Typography variant="body1" paragraph>
            Morbi nec erat sit amet odio pellentesque maximus eu ac mi. Vivamus sagittis, odio sit amet sollicitudin malesuada, 
            velit justo ultricies enim, eu condimentum lectus neque at felis. Vestibulum id gravida arcu. Cras consequat justo non 
            urna fringilla, et dictum nisi aliquam. Mauris posuere lorem quis libero vehicula, non suscipit mi fermentum. Ut non nisi 
            ut lacus vehicula consectetur. Sed laoreet lacus et massa tincidunt, non fermentum risus rhoncus. Donec malesuada efficitur 
            risus, non dictum nunc luctus eu.
          </Typography>
        </Paper>
      </Container>
    </div>
  );
}

export default AboutUsPage;
