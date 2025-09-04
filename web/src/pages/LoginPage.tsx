import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button, CircularProgress, Container, Typography, Box } from '@mui/material';

function LoginPage() {
  const { loginWithRedirect, isLoading, isAuthenticated } = useAuth0();

  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Redirect to home or defects page if already authenticated
      // This will be handled by App.tsx's useEffect for now
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return (
      <Container maxWidth="sm" className="mt-8 text-center">
        <CircularProgress />
        <Typography variant="h6" className="mt-4">Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" className="mt-8 text-center">
      <Box className="p-8 shadow-md rounded-lg bg-white">
        <Typography variant="h4" component="h1" className="mb-4">Welcome to Bug Tracker</Typography>
        <Typography variant="body1" className="mb-6">Please log in to continue.</Typography>
        <Button variant="contained" color="primary" onClick={() => loginWithRedirect()}>Login</Button>
      </Box>
    </Container>
  );
}

export default LoginPage;
