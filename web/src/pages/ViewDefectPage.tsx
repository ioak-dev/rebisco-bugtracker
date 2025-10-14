import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { authorized, defectsApi } from "../api/client";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  TableContainer,
  TableBody,
  TableCell,
  TableRow,
  Table,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Dialog,
} from "@mui/material";

function ViewDefectPage() {
  const auth0 = useAuth0();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = React.useState(true);
  const [form, setForm] = React.useState<any | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await authorized(auth0, () => defectsApi.get(id));
        setForm({
          raisedByTeam: data.raisedByTeam || "",
          description: data.description || "",
          activities: data.activities || "",
          responsible: data.responsible || "",
          priority: data.priority || "Low",
          dueDate: data.dueDate
            ? new Date(data.dueDate).toISOString().slice(0, 10)
            : "",
          status: data.status || "Open",
          nextCheck: data.nextCheck
            ? new Date(data.nextCheck).toISOString().slice(0, 10)
            : "",
          remark: data.remark || "",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [id, auth0]);

  const confirmDelete = async () => {
    if (!id) return;
    await authorized(auth0, () => defectsApi.remove(id));
    setOpenDeleteDialog(false);
    navigate(`/defects`);
  };

  if (loading || !form) {
    return (
      <Container maxWidth="md" sx={{ mt: 3 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Defect
        </Typography>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Raised By Team </TableCell>
                <TableCell>{form.raisedByTeam}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Responsible </TableCell>
                <TableCell>{form.responsible}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Description </TableCell>
                <TableCell>{form.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Activities </TableCell>
                <TableCell>{form.activities}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Priority </TableCell>
                <TableCell>{form.priority}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Status </TableCell>
                <TableCell>{form.status}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Due Date </TableCell>
                <TableCell>{form.dueDate}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Next Check </TableCell>
                <TableCell>{form.nextCheck}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Remark </TableCell>
                <TableCell>{form.remark}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          display="flex"
          gap={2}
          justifyContent="space-between"
          alignItems="center"
          mt={2}
        >
          <Button
            variant="contained"
            color="error"
            onClick={() => setOpenDeleteDialog(true)}
          >
            Delete
          </Button>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="info"
              onClick={() => navigate(`/defects`)}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="info"
              onClick={() => navigate(`/defects/edit/${id}`)}
            >
              Edit
            </Button>
          </Box>
        </Box>
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
        >
          <DialogTitle>Delete Defect</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this defect?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
            <Button color="error" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
}

export default ViewDefectPage;
