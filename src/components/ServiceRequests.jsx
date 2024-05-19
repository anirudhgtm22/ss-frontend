import React, { useState, useEffect, useRef } from 'react';
import { Typography, Table, TableHead, TableBody, TableRow, TableCell, Paper, Button, IconButton, Snackbar, Alert, Popover, Modal, Box, TextField } from '@mui/material';
import Cookies from 'js-cookie';
import InfoIcon from '@mui/icons-material/Info';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { BASE_URL } from './constants';

const ServiceRequests = () => {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [relatedDocuments, setRelatedDocuments] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [roleInfo, setRoleInfo] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrderImages, setSelectedOrderImages] = useState([]);
  const [rateModalOpen, setRateModalOpen] = useState(false);
  const [ratingType, setRatingType] = useState('');
  const [volunteerRating, setVolunteerRating] = useState(0);
  const [orderRating, setOrderRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchOrders();
    fetchUserRole();
    fetchRelatedDocuments();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('Token not found in cookies');
      }

      const response = await fetch(`${BASE_URL}/api/orders/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log("cl",data);
      setServiceRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setServiceRequests([]);
    }
  };

  const fetchUserRole = () => {
    const role = Cookies.get('role');
    setUserRole(role);
  };

  const fetchRelatedDocuments = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/related-documents/`);
      const data = await response.json();
      setRelatedDocuments(data);
    } catch (error) {
      console.error('Error fetching related documents:', error);
    }
  };

  const handleRate = (orderId) => {
    console.log(`Rating service for order ${orderId}`);
  };

  const handleFileChange = async (event) => {
    try {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('Token not found in cookies');
      }
      const orderId = selectedOrderId;
      const response = await fetch(`${BASE_URL}/api/orders/${orderId}/upload-document/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload document');
      }

      console.log('Document uploaded successfully');
      handleSnackbar();
      // Optionally, you can fetch updated data after successful upload
    } catch (error) {
      console.error('Error uploading document:', error);
    }
  };

  const handleUploadButtonClick = (orderId) => {
    setSelectedOrderId(orderId); 
    fileInputRef.current.click();
  };

  const handleCompleteRequest = async (orderId) => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('Token not found in cookies');
      }
  
      const response = await fetch(`${BASE_URL}/api/orders/${orderId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'completed' })
      });
  
      if (!response.ok) {
        throw new Error('Failed to complete request');
      }
  
      console.log('Request Completed Successfully');
      handleSnackbar();
      // You may want to fetch orders again or update the specific order in the state
    } catch (error) {
      console.error('Error completing request:', error);
    }
  };

  const handleSnackbar = () => {
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleClickInfo = (event, info) => {
    setRoleInfo(info);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseInfo = () => {
    setAnchorEl(null);
  };

  const handleViewDetails = async (order) => {
    try {
      const orderDocuments = relatedDocuments.filter(doc => doc.order === order.id);
      const images = await Promise.all(orderDocuments.map(async (doc) => {
        const response = await fetch(doc.document);
        if (!response.ok) {
          throw new Error('Failed to fetch image');
        }
        return response.url;
      }));
      setSelectedOrderImages(images);
      setLightboxIndex(0);
      setLightboxOpen(true);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };
  
  const renderAssignedToColumn = (request) => {
    if (userRole === 'volunteer') {
      if (request.elderly) {
        return (
          <>
            {request.elderly.user.first_name}
            <IconButton onClick={(event) => handleClickInfo(event, request.elderly)}>
              <InfoIcon />
            </IconButton>
          </>
        );
      } else {
        return 'No Volunteer Assigned';
      }
    } else if (userRole === 'elderly') {
      if (request.volunteer) {
        return (
          <>
            {request.volunteer.user.first_name}
            <IconButton onClick={(event) => handleClickInfo(event, request.volunteer)}>
              <InfoIcon />
            </IconButton>
          </>
        );
      } else {
        return 'No Volunteer Assigned Yet';
      }
    } else {
      return 'Assigned To';
    }
  };

  const renderStatus = (status) => {
    switch (status) {
      case 'volunteer_assigned':
        return 'Volunteer-Assigned';
      case 'completed':
        return 'Completed';
      case 'created':
        return 'Created';
      default:
        return '';
    }
  };

  const sortedServiceRequests = [...serviceRequests].sort((a, b) => {
    if (userRole === 'volunteer') {
      if (a.status === 'completed' && b.status !== 'completed') {
        return 1;
      } else if (a.status !== 'completed' && b.status === 'completed') {
        return -1;
      }
    } else if (userRole === 'elderly') {
      const orderOfStatus = { 'created': 0, 'volunteer_assigned': 1, 'completed': 2 };
      return orderOfStatus[a.status] - orderOfStatus[b.status];
    }
    return 0;
  });

  const handleRateSubmit = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('Token not found in cookies');
      }

      if (ratingType === 'volunteer') {
        const response = await fetch(`${BASE_URL}/api/volunteer-ratings/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            rating: volunteerRating,
            // Add any other data you want to send
          })
        });

        if (!response.ok) {
          throw new Error('Failed to rate volunteer');
        }

        console.log('Volunteer rated successfully');
      } else if (ratingType === 'order') {
        console.log("body",selectedOrderId);
        const response = await fetch(`${BASE_URL}/api/ratings/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            order:selectedOrderId,
            value: orderRating,
            feedback: feedback, 
            // Add any other data you want to send
          })
          
        });
        
        if (!response.ok) {
          throw new Error('Failed to rate order');
        }

        console.log(`Order ${selectedOrderId} rated successfully`);
      }

      setRateModalOpen(false);
      // Reset values
      setVolunteerRating(0);
      setOrderRating(0);
      setFeedback('');
      handleSnackbar();
      window.location.reload();
    } catch (error) {
      console.error('Error rating:', error);
    }
  };

  

  return (
    <Paper style={{ margin: '16px', padding: '16px' }}>
      <Typography variant="h4" gutterBottom align='center'>
        My Service Requests
      </Typography>
      <div style={{ overflowX: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Service</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>{userRole === 'volunteer' ? 'Elderly' : 'Assigned To'}</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedServiceRequests.map(request => (
            <TableRow key={request.id}>
              <TableCell>{request.id}</TableCell>
              <TableCell>{request.service?.title}</TableCell>
              <TableCell>{request.amount}</TableCell>
              <TableCell>{renderStatus(request.status)}</TableCell>
              <TableCell>{renderAssignedToColumn(request)}</TableCell>
              <TableCell>
  {userRole === 'volunteer' && request.status !== 'completed' && (
    <>
      <Button onClick={() => handleCompleteRequest(request.id)} variant="outlined" color="primary">
        Complete Request
      </Button>
      <Button onClick={() => handleUploadButtonClick(request.id)} variant="outlined" color="secondary" sx={{ marginLeft: 1 }}>
        Upload Document
      </Button>
      <input 
        type="file" 
        id={`upload-document-${request.id}`} 
        style={{ display: 'none' }} 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />
    </>
  )}
  {(userRole === 'elderly' && request.status === 'completed' && request.rating === null) && (
    <>
      <Button onClick={() => { setRatingType('order'); setSelectedOrderId(request.id); setRateModalOpen(true); }} variant="outlined" color="primary">
        Rate Order
      </Button>
      <Button onClick={() => handleViewDetails(request)} variant="outlined" color="primary" sx={{ marginLeft: 1 }}>
        View Details
      </Button>
    </>
  )}
  {(userRole === 'elderly' && request.status === 'completed' && request.rating !== null) && (
    <>
      <Button disabled variant="outlined" color="primary">
        Rate Order
      </Button>
      <Button onClick={() => handleViewDetails(request)} variant="outlined" color="primary" sx={{ marginLeft: 1 }}>
        View Details
      </Button>
    </>
  )}
</TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert elevation={6} variant="filled" onClose={handleCloseSnackbar} severity="success">
          Action completed successfully!
        </Alert>
      </Snackbar>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleCloseInfo}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
       <Typography sx={{ p: 2 }}>
          {roleInfo && (
            <>
              <div>Name: {roleInfo.user.first_name}</div>
              <div>Email: {roleInfo.user.email}</div>
              {userRole === 'volunteer' ? (
                <>
                  <div>Phone No: {roleInfo.user.phone_no}</div>
                  <div>Address: {roleInfo.user.address}</div>
                </>
              ) : (
                <>
                  <div>Phone No: {roleInfo.phone}</div>
                </>
              )}
            </>
          )}
        </Typography>
      </Popover>
      {lightboxOpen && (
        <Lightbox
          mainSrc={selectedOrderImages[lightboxIndex]}
          nextSrc={selectedOrderImages[(lightboxIndex + 1) % selectedOrderImages.length]}
          prevSrc={selectedOrderImages[(lightboxIndex + selectedOrderImages.length - 1) % selectedOrderImages.length]}
          onCloseRequest={() => setLightboxOpen(false)}
          onMovePrevRequest={() => setLightboxIndex((lightboxIndex + selectedOrderImages.length - 1) % selectedOrderImages.length)}
          onMoveNextRequest={() => setLightboxIndex((lightboxIndex + 1) % selectedOrderImages.length)}
          enableZoom={true}
        />
      )}
      <Modal
        open={rateModalOpen}
        onClose={() => setRateModalOpen(false)}
        aria-labelledby="rate-modal"
        aria-describedby="rate-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          width: 400,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}>
          {/* <Typography variant="h6" component="h2" align="center" gutterBottom>
            Rate Volunteer
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            {[...Array(5)].map((_, index) => (
              <IconButton key={index} onClick={() => setVolunteerRating(index + 1)}>
                {index + 1 <= volunteerRating ? (
                  <StarIcon color="primary" />
                ) : (
                  <StarBorderIcon />
                )}
              </IconButton>
            ))}
          </Box> */}
          <Typography variant="h6" component="h2" align="center" gutterBottom>
            Rate Order
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            {[...Array(5)].map((_, index) => (
              <IconButton key={index} onClick={() => setOrderRating(index + 1)}>
                {index + 1 <= orderRating ? (
                  <StarIcon color="primary" />
                ) : (
                  <StarBorderIcon />
                )}
              </IconButton>
            ))}
          </Box>
          <Typography variant="subtitle1" align="center" gutterBottom>
            Feedback
          </Typography>
          <TextField
            id="feedback-text"
            label="Feedback"
            multiline
            fullWidth
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button onClick={handleRateSubmit} variant="contained" color="primary" fullWidth>
            Submit
          </Button>
        </Box>
      </Modal>
    </Paper>
  );
};

export default ServiceRequests;
