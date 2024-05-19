

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
  LinearProgress,
  IconButton,
  TextField,
  Snackbar,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert from '@mui/material/Alert';
import Cookies from 'universal-cookie';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { BASE_URL } from './constants';

const stripePromise = loadStripe('pk_test_51PD2TsSG2YCisiFSAgAP5W4VUE7VcK3IStwmIwSt5lQ1KhSh24t07As7WgMjRSxQDfCY5qGkp2T14fjYRhpc8Ets00qQtryfze');

const BookNowPage = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [userData, setUserData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedTime, setSelectedTime] = useState(dayjs().set('hour', 9).set('minute', 0)); // Default time at 9:00 AM
  const [paymentError, setPaymentError] = useState(null);
  const cookies = new Cookies();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const isMobile = useMediaQuery('(max-width:600px)');

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
        }));
        setServices(filteredData);
      } catch (error) {
        console.error('Error fetching services data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = cookies.get('token');
        const response = await fetch(`${BASE_URL}/api/profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log("User data:", data);
        setUserData(data[0]);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleBookNow = (service) => {
    setSelectedService(service);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setProgress(0);
  };

  const handleNext = () => {
    setProgress(progress + 1);
  };

  const handleGoBack = () => {
    setProgress(progress - 1);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  const handleSubmitPayment = async (event) => {
    event.preventDefault();
  
    // Get the token from cookies
    const token = cookies.get('token');
  
    // Prepare data to send
    const dataToSend = {
      service: selectedService.id,
      amount: selectedService.amount,
      order_date: selectedDate.format(), // Use the provided order_date field as it is
    };
  
    // Make API call to create order
    try {
      const response = await fetch(`${BASE_URL}/api/create-orders/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });
  
      if (response.status === 450) {
        // Show alert message for incomplete profile
        alert('Complete your profile to make an order');
      } else if (response.ok) {
        // Show success message using snackbar
        setSnackbarMessage('Order created successfully');
        setSnackbarSeverity('success');
        setShowSnackbar(true);
        // Close the modal
        setOpenModal(false);
      } else {
        // Show error message using snackbar
        setSnackbarMessage('Failed to create order');
        setSnackbarSeverity('error');
        setShowSnackbar(true);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      // Show error message using snackbar
      setSnackbarMessage('Failed to create order');
      setSnackbarSeverity('error');
      setShowSnackbar(true);
    }
  };
  

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

  return (
    <Elements stripe={stripePromise}>
      <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'Arial, sans-serif', backgroundColor: '#fff' }}>
        <Typography variant="h4" gutterBottom style={{ marginBottom: '2rem', fontWeight: 'bold', fontFamily: 'Roboto, sans-serif' }}>
          Services offered
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={service.id}>
              <Card style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', transition: 'transform 0.3s' }} elevation={3}>
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {service.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p" style={{ marginTop: '1rem', maxHeight: '100px', overflow: 'hidden' }}>
                    {service.description}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p" style={{ marginTop: '1rem' }}>
                    Amount: {service.amount}
                  </Typography>
                </CardContent>
                <CardActions style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderTop: '1px solid #f0f0f0' }}>
                  <Button style={{ color: '#fff', backgroundColor: '#3f51b5', '&:hover': { backgroundColor: '#303f9f' } }} size="small">Know more</Button>
                  <Button style={{ color: '#fff', backgroundColor: '#3f51b5', '&:hover': { backgroundColor: '#303f9f' } }} size="small" onClick={() => handleBookNow(service)}>Book now</Button>
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
            <div style={{ backgroundColor: '#f0f0f0', padding: '2rem', borderRadius: '8px',  width: isMobile ? '90%' : '60%', height: '65%',margin: 'auto', marginTop: '10%', marginBottom: '10%', textAlign: 'left', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', position: 'relative' }}>
              <Typography variant="h4" gutterBottom style={{ textAlign: 'center', fontWeight: 'bold', fontFamily: 'Roboto, sans-serif' }}>
                Place Order
              </Typography>
              <IconButton style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#000000' }} onClick={handleCloseModal}>
                <CloseIcon />
              </IconButton>
              <LinearProgress variant="determinate" value={progress * 33.33} style={{ marginTop: '2rem' }} />
              {/* Progress 0: Service Info */}
              {progress === 0 && (
                <div>
                  <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
                    Selected Service
                  </Typography>
                  <Typography variant="body1" style={{ marginBottom: '1rem' }}>
                    <strong>Title:</strong> {selectedService?.title}<br />
                    <strong>Description:</strong> {selectedService?.description}<br />
                    <strong>Amount:</strong> {selectedService?.amount}
                  </Typography>
                  <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <Button onClick={handleNext} variant="contained" color="primary">
                      Next
                    </Button>
                  </div>
                </div>
              )}
              {/* Progress 1: User Info */}
              {progress === 1 && (
                <div>
                  <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
                    User Information
                  </Typography>
                  <div style={{ marginBottom: '1rem' }}>
                    <TextField
                      label="Name"
                      value={`${userData?.first_name} ${userData?.last_name}`}
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                      style={{ marginBottom: '1rem' }}
                    />
                    <TextField
                      label="Address"
                      value={userData?.address}
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                      style={{ marginBottom: '1rem' }}
                    />
                    <TextField
                      label="Country"
                      value={userData?.country}
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                      style={{ marginBottom: '1rem' }}
                    />
                    <TextField
                      label="Phone Number"
                      value={userData?.phone_no}
                      InputProps={{
                        readOnly: true,
                      }}
                      fullWidth
                      variant="outlined"
                      style={{ marginBottom: '1rem' }}
                    />
                  </div>
                  <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    {progress > 0 && (
                      <Button onClick={handleGoBack} variant="contained" color="primary" style={{ marginRight: '1rem' }}>
                        Go Back
                      </Button>
                    )}
                    <Button onClick={handleNext} variant="contained" color="primary">
                      Next
                    </Button>
                  </div>
                </div>
              )}
              {/* Progress 2: Date and Time Selection */}
              {progress === 2 && (
                <div>
                  <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
                    Date and Time Selection
                  </Typography>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <div style={{ marginRight: '1rem' }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Select Date"
                          value={selectedDate}
                          onChange={handleDateChange}
                        />
                      </LocalizationProvider>
                    </div>
                    <div style={{ marginLeft: '1rem' }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker
                          label="Select Time"
                          value={selectedTime}
                          onChange={handleTimeChange}
                        />
                      </LocalizationProvider>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    {progress > 0 && (
                      <Button onClick={handleGoBack} variant="contained" color="primary" style={{ marginRight: '1rem' }}>
                        Go Back
                      </Button>
                    )}
                    <Button onClick={handleNext} variant="contained" color="primary">
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {/* Progress 3: Payment */}
              {progress === 3 && (
                <div>
                  <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
                    Payment
                  </Typography>
                  <div style={{ marginBottom: '1rem' }}>
                    <Typography variant="body1" style={{ marginBottom: '0.5rem' }}>
                      Amount to be Paid: Rs {selectedService?.amount}/-
                    </Typography>
                    <Typography variant="body1" style={{ marginBottom: '1rem' }}>
                      {/* Other payment details */}
                    </Typography>
                    <form onSubmit={handleSubmitPayment} style={{ maxWidth: '400px', margin: '0 auto' }}>
                      <CardNumberElement
                        options={{
                          style: {
                            base: {
                              fontSize: '16px',
                              color: '#424770',
                              '::placeholder': {
                                color: '#aab7c4',
                              },
                            },
                            invalid: {
                              color: '#9e2146',
                            },
                          },
                        }}
                      />
                      <CardExpiryElement
                        options={{
                          style: {
                            base: {
                              fontSize: '16px',
                              color: '#424770',
                              '::placeholder': {
                                color: '#aab7c4',
                              },
                            },
                            invalid: {
                              color: '#9e2146',
                            },
                          },
                        }}
                      />
                      <CardCvcElement
                        options={{
                          style: {
                            base: {
                              fontSize: '16px',
                              color: '#424770',
                              '::placeholder': {
                                color: '#aab7c4',
                              },
                            },
                            invalid: {
                              color: '#9e2146',
                            },
                          },
                        }}
                      />
                      {paymentError && <div style={{ color: 'red', marginTop: '0.5rem' }}>{paymentError}</div>}
                      <Button type="submit" variant="contained" color="primary" style={{ marginTop: '1rem', width: '100%' }}>
                        Pay Now
                      </Button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </Fade>
        </Modal>

        <Snackbar
          open={showSnackbar}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
          >
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
      </div>
    </Elements>
  );
};

export default BookNowPage;
