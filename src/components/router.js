import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AboutUsPage from './aboutpage';
import Homepage from './Homepage';
import SignInSide from './login';
import ServicesPage from './servicePage';
import SignUp from './signup';
import ProfilePage from './profilePage';
import ServiceRequests from './ServiceRequests';
import ActiveOrders from './ActiveOrders';
import BookNowPage from './book-now';

const NavLink = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/about" element={<AboutUsPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/book-now" element={<BookNowPage />} />
      <Route path="/login" element={<SignInSide />} />
      <Route path ="/signup" element={<SignUp />} />
      <Route path ="/profile" element={<ProfilePage />} />
      <Route path ="/service-requests" element={<ServiceRequests />} />
      <Route path ="/active-orders" element={<ActiveOrders />} />
    </Routes>
  );
}

export default NavLink;
