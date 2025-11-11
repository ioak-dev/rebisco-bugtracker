import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { defectsApi, authorized } from "../api/client";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  Delete,
  Edit,
  Add,
  VisibilitySharp,
  Search,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import type { IDefect } from "./ViewDefectPage";

function DefectListPage() {
  const auth0 = useAuth0();
  const navigate = useNavigate();
  const [rows, setRows] = React.useState<IDefect[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [toDelete, setToDelete] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await authorized(auth0, () => defectsApi.list());
      setRows(data);
    } finally {
      setLoading(false);
    }
  }, [auth0]);

  React.useEffect(() => {
    load();
  }, [load]);

  const confirmDelete = async () => {
    if (!toDelete) return;
    await authorized(auth0, () => defectsApi.remove(toDelete));
    setToDelete(null);
    load();
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 3 }}>
      <Box
        display="flex"
        justifyContent="right"
        alignItems="right"
        mb={2}
        gap={1}
      >
        <Typography variant="h4"></Typography>
        <Button
          variant="contained"
          startIcon={<Search />}
          onClick={() => navigate("/defects/search")}
        >
          Search Defect
        </Button>
        <Typography variant="h4"></Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate("/defects/new")}
        >
          New Defect
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Raised by team</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Activities</TableCell>
              <TableCell>Responsible</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Next Check</TableCell>
              <TableCell>Remark</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading &&
              rows.map((row) => (
                <TableRow key={row._id} hover>
                  <TableCell>{row.raisedByTeam}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{row.activities}</TableCell>
                  <TableCell>{row.responsible}</TableCell>
                  <TableCell>{row.priority}</TableCell>
                  <TableCell>
                    {row.dueDate
                      ? new Date(row.dueDate).toLocaleDateString()
                      : ""}
                  </TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>
                    {row.nextCheck
                      ? new Date(row.nextCheck).toLocaleDateString()
                      : ""}
                  </TableCell>
                  <TableCell>{row.remark}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="info"
                      onClick={() => navigate(`/defects/view/${row._id}`)}
                    >
                      <VisibilitySharp />
                    </IconButton>
                    <IconButton
                      color="info"
                      onClick={() => navigate(`/defects/edit/${row._id}`)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => setToDelete(row._id?? null)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={!!toDelete} onClose={() => setToDelete(null)}>
        <DialogTitle>Delete Defect</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this defect? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToDelete(null)}>Cancel</Button>
          <Button color="error" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default DefectListPage;
