import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MenuItem from '@mui/material/MenuItem';
import LinearProgress from '@mui/material/LinearProgress';
import { BASE_URL } from './constants';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000', // Black
    },
    secondary: {
      main: '#757575', // Grey
    },
    background: {
      default: '#f4f6f8',
    },
  },
});

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('volunteer'); // Default role is volunteer
  const [signupStep, setSignupStep] = useState(1); // 1: Email, 2: OTP, 3: Password
  const [signupError, setSignupError] = useState(null);
  const [counter, setCounter] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for email verification

  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (signupStep === 2 && counter > 0) {
      timer = setInterval(() => {
        setCounter((prevCounter) => prevCounter - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [signupStep, counter]);

  const handleVerifyEmail = async () => {
    setLoading(true); // Start loading
    try {
      const csrftoken = getCookie('csrftoken');
      const response = await fetch(`${BASE_URL}/send-otp/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        setSignupStep(2);
        toast.success('OTP sent to Email successfully.');
      } else {
        throw new Error('Failed to verify email');
      }
    } catch (error) {
      console.error('Error verifying email:', error);
      setSignupError('Error verifying email. Please try again.');
      toast.error('Error verifying email. Please try again.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleNextStep = async () => {
    if (signupStep === 1) {
      handleVerifyEmail();
    } else if (signupStep === 2) {
      // Implement OTP verification logic here
      // For now, let's assume the OTP is correct
      setSignupStep(3);
      toast.success('OTP verified successfully.');
    } else if (signupStep === 3) {
      try {
        const response = await fetch(`${BASE_URL}/register/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ first_name: firstName, last_name: lastName, role, password, email }),
        });
        const data = await response.json();
        if (response.ok) {
          toast.success(data.message);
          navigate('/login');
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        console.error('Error signing up:', error);
        setSignupError('Error signing up. Please try again.');
        toast.error('Error signing up. Please try again.');
      }
    }
  };

  const handleResendOTP = async () => {
    try {
      const csrftoken = getCookie('csrftoken');
      const response = await fetch(`${BASE_URL}/send-otp/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        toast.success('OTP resent to email. Check your email.');
      } else {
        throw new Error('Failed to resend OTP');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      toast.error('Error resending OTP. Please try again.');
    }
  };

  const getCookie = (name) => {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} sx={{ backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ m: 1, bgcolor: theme.palette.secondary.main }}>
              <LockOutlinedIcon sx={{ color: '#FFFFFF' }} />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ mb: 3 }}>Sign up</Typography>
            <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); handleNextStep(); }} sx={{ mt: 1, width: '100%' }}>
              {signupStep === 1 && (
                <>
                  <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />
                  <Button type="button" fullWidth variant="contained" sx={{ mt: 3, mb: 2, color: '#FFFFFF', backgroundColor: '#757575' }} onClick={handleVerifyEmail}>Verify Email</Button>
                  {loading && <LinearProgress />} {/* Display loading bar */}
                </>
              )}
              {signupStep === 2 && (
                <>
                  <TextField margin="normal" required fullWidth name="otp" label="OTP" type="text" id="otp" autoComplete="off" value={otp} onChange={(e) => setOtp(e.target.value)} />
                  <Button type="button" fullWidth variant="contained" sx={{ mt: 3, mb: 2, color: '#FFFFFF', backgroundColor: '#757575' }} onClick={handleNextStep}>Verify OTP</Button>
                  <Typography variant="body2" align="center">Resend OTP in {counter} seconds</Typography>
                  {counter === 0 && (
                    <Button type="button" fullWidth variant="contained" onClick={handleResendOTP} disabled={resendDisabled} sx={{ mt: 2, mb: 2, color: '#FFFFFF', backgroundColor: '#757575' }}>Resend OTP</Button>
                  )}
                </>
              )}
              {signupStep === 3 && (
                <>
                  <TextField margin="normal" required fullWidth name="firstName" label="First Name" type="text" id="firstName" autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  <TextField margin="normal" required fullWidth name="lastName" label="Last Name" type="text" id="lastName" autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  <TextField select margin="normal" required fullWidth name="role" label="Role" id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                    <MenuItem value="volunteer">Volunteer</MenuItem>
                    <MenuItem value="elderly">Elderly</MenuItem>
                  </TextField>
                  <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, color: '#FFFFFF', backgroundColor: '#757575' }}>Sign Up</Button>
                </>
              )}
              {signupError && (
                <Typography variant="body2" color="error" align="center" sx={{ mt: 1 }}>{signupError}</Typography>
              )}
              <Grid container>
                <Grid item>
                  <Link href="/login" variant="body2" onClick={() => navigate('/login')}>Already have an account? Sign In</Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
    </ThemeProvider>
  );
};

export default SignUp;
