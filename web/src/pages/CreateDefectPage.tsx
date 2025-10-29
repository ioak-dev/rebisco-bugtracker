import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { authorized, defectsApi, mailApi } from '../api/client';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { Box, Button, Container, MenuItem, Paper, TextField, Typography } from '@mui/material';
import type { IDefect } from './ViewDefectPage';

const priorities = ['Low', 'Medium', 'High', 'Critical'];
const statuses = ['Open', 'In Progress', 'Blocked', 'Closed', 'Reopened'];

function CreateDefectPage() {
  const auth0 = useAuth0();
  const { user } = useAuth0();
  const navigate = useNavigate();
  const [form, setForm] = React.useState<IDefect>({
    raisedByTeam: '',
    description: '',
    activities: '',
    responsible: '',
    priority: 'Low',
    dueDate: '',
    status: 'Open',
    nextCheck: '',
    remark: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : undefined,
      nextCheck: form.nextCheck ? new Date(form.nextCheck).toISOString() : undefined,
    };

    await authorized(auth0, () => defectsApi.create(payload));
    console.log(user);
    if (!user) return;
    const _mailPayload = {
      to: user.email,
      subject: `New Defect Assigned: ${form.description.substring(0, 20)}...`,
      text: `A new defect has been assigned to you by ${form.raisedByTeam}.\n\nDescription: ${form.description}\n\nPlease check the defect tracking system for more details.`,
    };
    await authorized(auth0, () => mailApi.send(_mailPayload));
    navigate('/defects');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          New Defect
        </Typography>
        <Box component="form" onSubmit={submit}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField fullWidth required label="Raised by team" name="raisedByTeam" value={form.raisedByTeam} onChange={handleChange} />
            </Grid>
            <Grid size={12}>
              <TextField fullWidth required label="Responsible" name="responsible" value={form.responsible} onChange={handleChange} />
            </Grid>
            <Grid size={12}>
              <TextField fullWidth multiline minRows={3} required label="Description" name="description" value={form.description} onChange={handleChange} />
            </Grid>
            <Grid size={12}>
              <TextField fullWidth multiline minRows={2} label="Activities" name="activities" value={form.activities} onChange={handleChange} />
            </Grid>
            <Grid size={12}>
              <TextField select fullWidth label="Priority" name="priority" value={form.priority} onChange={handleChange}>
                {priorities.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={12}>
              <TextField select fullWidth label="Status" name="status" value={form.status} onChange={handleChange}>
                {statuses.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={12}>
              <TextField fullWidth type="date" label="Due Date" name="dueDate" value={form.dueDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid size={12}>
              <TextField fullWidth type="date" label="Next Check" name="nextCheck" value={form.nextCheck} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid size={12}>
              <TextField fullWidth multiline minRows={2} label="Remark" name="remark" value={form.remark} onChange={handleChange} />
            </Grid>
            <Grid size={12}>
              <Box display="flex" gap={2}>
                <Button type="submit" variant="contained">Create</Button>
                <Button variant="outlined" onClick={() => navigate('/defects')}>Cancel</Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

export default CreateDefectPage;
