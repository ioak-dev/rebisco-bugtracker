import React from 'react';
import { Typography, Container } from '@mui/material';

function UserListPage() {
  return (
    <Container maxWidth="lg" className="mt-8">
      <Typography variant="h4" component="h1" className="mb-4">User Listing Page</Typography>
      <Typography variant="body1">This page will display a list of users fetched from Auth0 Management API.</Typography>
    </Container>
  );
}

export default UserListPage;
