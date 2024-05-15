import React, { useState, useEffect } from 'react';
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Grid,
  Modal,
  Fade,
} from '@mui/material';
import { BASE_URL } from './constants';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/services/`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const filteredData = data.map((service) => ({
          id: service.id,
          title: service.title,
          description: service.description,
          amount: service.amount,
          image: service.image,
        }));
        setServices(filteredData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleKnowMore = (service) => {
    setSelectedService(service);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <Typography variant="h4" gutterBottom style={{ marginBottom: '2rem', fontWeight: 'bold', fontFamily: 'Roboto, sans-serif' }}>
        Services offered
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {services.map((service, index) => (
          <Grid item xs={12} sm={6} md={4} key={service.id}>
            <Card
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'scale(1.05)', // Scale up the card on hover
                  cursor: 'pointer', // Change cursor to pointer on hover
                },
              }}
              elevation={3}
              onClick={() => handleKnowMore(service)} // Handle click event
            >
              <CardContent>
                <Typography variant="h5" component="h2">
                  {service.title}
                </Typography>
                <img src={service.image} alt={service.title} style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover', marginTop: '1rem' }} />
                <Typography variant="body2" color="textSecondary" component="p" style={{ marginTop: '1rem', maxHeight: '100px', overflow: 'hidden' }}>
                  {service.description}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p" style={{ marginTop: '1rem' }}>
                  Amount: {service.amount}
                </Typography>
              </CardContent>
              <CardActions 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '1rem', 
              borderTop: '1px solid #f0f0f0', 
              textAlign: 'center' // Align content of CardActions to center
            }}
          >
            <Button 
              style={{ 
                color: '#fff', 
                backgroundColor: '#3f51b5', 
                '&:hover': { 
                  backgroundColor: '#303f9f' 
                }
              }} 
              size="small" 
              onClick={() => handleKnowMore(service)}
            >
              Know more
            </Button>
          </CardActions>

            </Card>
          </Grid>
        ))}
      </Grid>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropProps={{
          invisible: true,
        }}
      >
        <Fade in={openModal}>
          <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', maxWidth: '60%', margin: 'auto', marginTop: '10%', textAlign: 'left', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
              {selectedService && selectedService.title}
            </Typography>
            <Typography variant="body1">
              {selectedService && selectedService.description}
            </Typography>
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Button onClick={handleCloseModal} variant="contained" color="primary">
                Close
              </Button>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default ServicesPage;
