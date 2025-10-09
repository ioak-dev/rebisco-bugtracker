import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { authorized, defectsApi } from '../api/client';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Container, Paper, Typography, Grid } from '@mui/material';

function ViewDefectPage() {
  const auth0 = useAuth0();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = React.useState(true);
  const [form, setForm] = React.useState<any | null>(null);

  React.useEffect(() => {
    (async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await authorized(auth0, () => defectsApi.get(id));
        setForm({
          raisedByTeam: data.raisedByTeam || '',
          description: data.description || '',
          activities: data.activities || '',
          responsible: data.responsible || '',
          priority: data.priority || 'Low',
          dueDate: data.dueDate ? new Date(data.dueDate).toISOString().slice(0, 10) : '',
          status: data.status || 'Open',
          nextCheck: data.nextCheck ? new Date(data.nextCheck).toISOString().slice(0, 10) : '',
          remark: data.remark || '',
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [id, auth0]);

  if (loading || !form) {
    return (
      <Container maxWidth="md" sx={{ mt: 3 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 3 }}>
      <Paper sx={{ p: 3, width: '100%' }}>
        <Typography variant="h5" gutterBottom>View Defect</Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <Grid container spacing={2} direction="column">
            <Grid item sm={12}>
              <Typography variant="h6" fontWeight={500}>Raised By Team :</Typography>
              <Typography variant="subtitle1" fontWeight={400}>{form.raisedByTeam}</Typography>
            </Grid>
            <Grid item sm={12}>
              <Typography variant="h6" fontWeight={500}>Responsible :</Typography>
              <Typography variant="subtitle1" fontWeight={400}>{form.responsible}</Typography>
            </Grid>
            <Grid item sm={12}>
              <Typography variant="h6" fontWeight={500}>Description :</Typography>
              <Typography variant="subtitle1" fontWeight={400}>{form.description}</Typography>
            </Grid>
            <Grid item sm={12}>
              <Typography variant="h6" fontWeight={500}>Activities :</Typography>
              <Typography variant="subtitle1" fontWeight={400}>{form.activities}</Typography>
            </Grid>
            <Grid item sm={12}>
              <Typography variant="h6" fontWeight={500}>Priority :</Typography>
              <Typography variant="subtitle1" fontWeight={400}>{form.priority}</Typography>
            </Grid>
            <Grid item sm={12}>
              <Typography variant="h6" fontWeight={500}>Status :</Typography>
              <Typography variant="subtitle1" fontWeight={400}>{form.status}</Typography>
            </Grid>
            <Grid item sm={12}>
              <Typography variant="h6" fontWeight={500}>Due Date :</Typography>
              <Typography variant="subtitle1" fontWeight={400}>{form.dueDate}</Typography>
            </Grid>
            <Grid item sm={12}>
              <Typography variant="h6" fontWeight={500}>Next Check :</Typography>
              <Typography variant="subtitle1" fontWeight={400}>{form.nextCheck}</Typography>
            </Grid>
            <Grid item sm={12}>
              <Typography variant="h6" fontWeight={500}>Remark :</Typography>
              <Typography variant="subtitle1" fontWeight={400}>{form.remark}</Typography>
            </Grid>
            <Grid item sm={12}>
              <Box display="flex" gap={2} mt={2}>
                <Button variant="contained" onClick={() => navigate('/defects')}>
                  Back
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

export default ViewDefectPage;