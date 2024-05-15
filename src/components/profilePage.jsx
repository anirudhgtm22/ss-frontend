import React, { useState, useEffect, useRef } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Cookies from 'js-cookie';
import { BASE_URL } from './constants';

const ProfilePageContainer = styled(Card)(({ theme }) => ({
  maxWidth: '25%',
  float: 'left',
  marginTop: theme.spacing(5),
  marginLeft: '35px',
  marginRight: theme.spacing(6),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[5],
  backgroundColor: theme.palette.background.paper,
  textAlign: 'center',
  padding: theme.spacing(4),
  position: 'relative',
}));

const ProfileInfoContainer = styled(Card)(({ theme }) => ({
  maxWidth: '65%',
  float: 'left',
  marginTop: theme.spacing(5),
  marginLeft: theme.spacing(2),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[5],
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(4),
}));

const AvatarWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '20px',
  position: 'relative',
});

const CameraIconWrapper = styled('div')({
  position: 'absolute',
  right: 0,
  bottom: 0,
  cursor: 'pointer',
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  borderRadius: '50%',
  padding: '5px',
  zIndex: 1,
});

const UpdateButtonWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: '20px',
});

const ProfilePage = () => {
  const [avatarSrc, setAvatarSrc] = useState('/path/to/avatar.jpg');
  const [userData, setUserData] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [password, setPassword] = useState('');
  const inputFileRef = useRef(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = Cookies.get('token');
        const response = await fetch(`${BASE_URL}/api/profile/`, {
          headers: { 
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        
        const userProfileData = await response.json();
        console.log("profile",userProfileData);
        setUserData(userProfileData[0]); // Assuming only one user data is returned
        setAvatarSrc(userProfileData[0].profile_picture);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async () => {
    try {
        const token = Cookies.get('token');
        const id = userData.id; // Assuming userData contains the user's ID

        const formData = new FormData();
        formData.append('first_name', userData.first_name);
        formData.append('last_name', userData.last_name);
        formData.append('email', userData.email);
        formData.append('phone_no', userData.phone_no);
        formData.append('address', userData.address);
        formData.append('state', userData.state);
        formData.append('country', userData.country);

        // Append the password only if it's provided
        if (password !== '') {
          formData.append('password', password);
        }

        // Check if profile picture is updated
        if (userData.profile_picture instanceof File) {
          formData.append('profile_picture', userData.profile_picture, userData.profile_picture.name);
        }

        const response = await fetch(`${BASE_URL}/api/profile/${id}/`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });
        if (!response.ok) {
            throw new Error('Failed to update user profile');
        }
        setShowSnackbar(true);
        setTimeout(() => setShowSnackbar(false), 6000);
    } catch (error) {
        console.error('Error updating user profile:', error);
    }
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarSrc(reader.result);
      setUserData((prevData) => ({
        ...prevData,
        profile_picture: file,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleCameraIconClick = () => {
    inputFileRef.current.click();
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  const handleFieldChange = (e) => {
    const { id, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  return (
    <>
      {userData && (
        <>
          <ProfilePageContainer>
            <CardContent>
              <Typography variant="h4" component="div" gutterBottom>
                My Account
              </Typography>
              <AvatarWrapper>
                <Avatar alt="User Avatar" src={avatarSrc} sx={{ width: 120, height: 120 }} />
                <CameraIconWrapper onClick={handleCameraIconClick}>
                  <CameraAltIcon fontSize="small" />
                  <input
                    ref={inputFileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    style={{ display: 'none' }}
                  />
                </CameraIconWrapper>
              </AvatarWrapper>
              <Typography variant="h5" gutterBottom>
                {userData.first_name} {userData.last_name}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                {userData.role}
              </Typography>
            </CardContent>
          </ProfilePageContainer>

          <ProfileInfoContainer>
            <CardContent>
              <Typography variant="h4" component="div" gutterBottom>
                Update Profile
              </Typography>
              <TextField
                id="first_name"
                label="First Name"
                value={userData.first_name}
                fullWidth
                onChange={handleFieldChange}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                id="last_name"
                label="Last Name"
                value={userData.last_name}
                fullWidth
                onChange={handleFieldChange}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                id="email"
                label="Email"
                value={userData.email}
                fullWidth
                disabled
                sx={{ marginBottom: 2 }}
              />
              <TextField
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                sx={{ marginBottom: 2 }}
              />
              <TextField
                id="phone_no"
                label="Phone Number"
                value={userData.phone_no}
                fullWidth
                onChange={handleFieldChange}
                sx={{ marginBottom: 2 }}
              />

              <TextField
                id="address"
                label="Address"
                value={userData.address}
                fullWidth
                onChange={handleFieldChange}
                sx={{ marginBottom: 2 }}
              />

              <TextField
                id="state"
                label="State"
                value={userData.state}
                fullWidth
                onChange={handleFieldChange}
                sx={{ marginBottom: 2 }}
              />

              <TextField
                id="country"
                label="Country"
                value={userData.country}
                fullWidth
                onChange={handleFieldChange}
                sx={{ marginBottom: 2 }}
              />
              <UpdateButtonWrapper>
                <Button variant="contained" color="primary" onClick={handleUpdateProfile}>
                  Update Profile
                </Button>
              </UpdateButtonWrapper>
            </CardContent>
          </ProfileInfoContainer>
        </>
      )}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity="success"
        >
          User profile updated successfully
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default ProfilePage;
