import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { authorized, defectsApi } from '../api/client';
import { useNavigate, useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import {
  Box, Button, Container, MenuItem, Paper, TextField, Typography
} from '@mui/material';
import type { IDefect } from '../interface/IDefect.interface';

const priorities = ['Low', 'Medium', 'High', 'Critical'];
const statuses = ['Open', 'In Progress', 'Blocked', 'Closed', 'Reopened'];

function EditDefectPage() {
  const auth0 = useAuth0();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = React.useState(true);
  const [form, setForm] = React.useState<IDefect| null>(null);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev=>prev?{...prev,[name]:value}:null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    const payload = {
      ...form,
      dueDate: form!.dueDate ? new Date(form!.dueDate).toISOString() : undefined,
      nextCheck: form!.nextCheck ? new Date(form!.nextCheck).toISOString() : undefined,
    };
    await authorized(auth0, () => defectsApi.update(id, payload));
    navigate('/defects');
  };

  if (loading || !form) {
    return <Container maxWidth="md" sx={{ mt: 3 }}><Typography>Loading...</Typography></Container>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Edit Defect</Typography>
        <Box component="form" onSubmit={submit}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField fullWidth required label="Raised by team" name="raisedByTeam" value={form.raisedByTeam} onChange={handleChange} />
            </Grid>
            <Grid size={12}>
              <TextField fullWidth required label="Responsible" name="responsible" value={form.responsible} onChange={handleChange} />
            </Grid>
            <Grid size={12}>
              <TextField fullWidth required label="Description" name="description" multiline minRows={3} value={form.description} onChange={handleChange} />
            </Grid>
            <Grid size={12}>
              <TextField fullWidth label="Activities" name="activities" multiline minRows={2} value={form.activities} onChange={handleChange} />
            </Grid>
            <Grid size={12}>
              <TextField select fullWidth label="Priority" name="priority" value={form.priority} onChange={handleChange}>
                {priorities.map(p => (<MenuItem key={p} value={p}>{p}</MenuItem>))}
              </TextField>
            </Grid>
            <Grid size={12}>
              <TextField select fullWidth label="Status" name="status" value={form.status} onChange={handleChange}>
                {statuses.map(s => (<MenuItem key={s} value={s}>{s}</MenuItem>))}
              </TextField>
            </Grid>
            <Grid size={12}>
              <TextField fullWidth type="date" label="Due Date" name="dueDate" value={form.dueDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid size={12}>
              <TextField fullWidth type="date" label="Next Check" name="nextCheck" value={form.nextCheck} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid size={12}>
              <TextField fullWidth label="Remark" name="remark" multiline minRows={2} value={form.remark} onChange={handleChange} />
            </Grid>
            <Grid size={12}>
              <Box display="flex" gap={2}>
                <Button type="submit" variant="contained">Save</Button>
                <Button variant="outlined" onClick={() => navigate('/defects')}>Cancel</Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

export default EditDefectPage;
