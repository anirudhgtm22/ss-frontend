import React, { useState, useEffect } from 'react';
import { Typography, Table, TableHead, TableBody, TableRow, TableCell, Button, Modal, Box, Grid, Divider, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Cookies from 'js-cookie';
import { BASE_URL } from './constants';

const OrderDetailsModal = ({ selectedOrder, handleClose, onAcceptRequest }) => {
  return (
    <Modal open={true} onClose={handleClose}>
      <Box style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', padding: 24, borderRadius: 8, minWidth: 300, width: '80%', maxWidth: 400 }}>
        <IconButton style={{ position: 'absolute', top: 10, right: 10 }} onClick={handleClose}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" style={{ marginBottom: 16 }}>{`Order ID: ${selectedOrder.id}`}</Typography>
        <Divider style={{ marginBottom: 16 }} />
        <TextField label="Service" value={selectedOrder.service.title} fullWidth disabled sx={{ marginBottom: 2 }} />
        <TextField label="Amount" value={selectedOrder.amount} fullWidth disabled sx={{ marginBottom: 2 }} />
        <TextField label="Elderly's Name" value={`${selectedOrder.elderly.user.first_name} ${selectedOrder.elderly.user.last_name}`} fullWidth disabled sx={{ marginBottom: 2 }} />
        <TextField label="Order Date" value={parseAndFormatDate(selectedOrder.order_date)} fullWidth disabled sx={{ marginBottom: 2 }} />
        <TextField label="Completed At" value={selectedOrder.completed_at || 'Not Completed'} fullWidth disabled sx={{ marginBottom: 2 }} />
        <Button onClick={() => onAcceptRequest(selectedOrder.id)} color="primary" variant="contained" style={{ marginTop: 20 }} fullWidth>
          Accept Request
        </Button>
      </Box>
    </Modal>
  );
};

function parseAndFormatDate(dateString) {
  // Parse the date string with timezone information
  const parsedDate = new Date(dateString);
  // Format the date and time in a user-friendly way
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC', // To display in UTC (adjust if needed)
  };
  return parsedDate.toLocaleDateString('en-US', options); // US English locale for formatting
}

const ActiveOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/active-orders/`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching active orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  const handleAcceptRequest = async (orderId) => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('Token not found in cookies');
      }

      const response = await fetch(`${BASE_URL}/accept-orders/${orderId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: 'volunteer_assigned'
        })
      });
      if (response.status === 450) {
        window.alert('Please complete your profile first');
        return;
      }
      if (!response.ok) {
        throw new Error('Failed to accept request');
      }

      window.alert('Request accepted successfully');
      handleCloseModal();
      // Reload the page
      window.location.reload();
    } catch (error) {
      console.error('Error accepting request:', error);
      window.alert('Failed to accept request');
    }
  };

  return (
    <div style={{ margin: '20px auto', maxWidth: '100%' }}>
      <Typography variant="h5" style={{ textAlign: 'center', marginBottom: 20 }}>
        Active Orders
      </Typography>
      {orders.length === 0 ? (
        <Typography variant="body1" style={{ textAlign: 'center' }}>
          No active orders
        </Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold' }}>Service</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Amount</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Address</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Order Date</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map(order => (
              <TableRow key={order.id}>
                <TableCell>{order.service.title}</TableCell>
                <TableCell>{order.amount}</TableCell>
                <TableCell>{`${order.elderly.user.address}-${order.elderly.user.state}`}</TableCell>
                <TableCell>
                  {parseAndFormatDate(order.order_date)}
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleViewDetails(order)} variant="outlined">
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Modal open={Boolean(selectedOrder)} onClose={handleCloseModal}>
        <OrderDetailsModal selectedOrder={selectedOrder} handleClose={handleCloseModal} onAcceptRequest={handleAcceptRequest} />
      </Modal>
    </div>
  );
}

export default ActiveOrders;
