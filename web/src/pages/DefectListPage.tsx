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
  InputAdornment,
  Paper,
  Table,
  TableBody,
  MenuItem,
  TableCell,
  TableContainer,
  Typography,
  TableHead,
  TableRow,
  TextField,
  Checkbox,
  ListItemText,
} from "@mui/material";
import {
  Delete,
  Edit,
  Add,
  VisibilitySharp,
  Clear,
  Search,
} from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { IDefect } from "../interface/IDefect.interface";

function DefectListPage() {
  const auth0 = useAuth0();
  const navigate = useNavigate();
  const [rows, setRows] = React.useState<IDefect[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [toDelete, setToDelete] = React.useState<string | null>(null);

  const [keyword, setKeyword] = React.useState("");
  const [fields, setFields] = React.useState<string[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  React.useEffect(() => {
    const urlKeyword = searchParams.get("keyword") || "";
    const urlFields = searchParams.get("fields") || "";
    setKeyword(urlKeyword);
    if (urlFields) {
      setFields(urlFields.split(","));
    } else {
      setFields([]);
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);
    setSearchParams({ fields: fields.join(","), keyword: value });
  };

  const handleFieldChange = (e: any) => {
    const newField = e.target.value;
    setFields(newField);
    setSearchParams({ fields: newField.join(","), keyword });
  };

  const handleCancel = () => {
    setKeyword("");
    setFields([]);
    setSearchParams({});
  };
  const filterRows = () => {
    if (!keyword.trim() || fields.length === 0) return rows;
    return rows.filter((row: any) =>
      fields.some((field) => {
        const fieldValue = row[field]
          ? row[field].toString().toLowerCase()
          : "";
        return fieldValue.includes(keyword.toLowerCase());
      })
    );
  };

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
        flexWrap="wrap"
        alignItems="center"
        justifyContent="space-between"
        mb={1}
        sx={{ gap: 1, p: 1 }}
      >
        <TextField
          variant="outlined"
          sx={{ flexGrow: 1, minWidth: "200px" }}
          placeholder="Search Defects"
          onChange={handleInputChange}
          value={keyword}
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
              endAdornment:(
                <InputAdornment position="end">
                  <IconButton onClick={handleCancel}>
                    <Clear color="action" />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            select
            label="Select fields"
            size="small"
            sx={{ width: 200 }}
            value={fields}
            onChange={handleFieldChange}
            slotProps={{
              select: {
                multiple: true,
                displayEmpty: true,
                renderValue: (selected) => {
                  if ((selected as string[]).length === 0) return;
                  return (selected as string[]).join(",");
                },
                MenuProps: { PaperProps: { sx: { maxHeight: 280 } } },
              },
            }}
          >
            <MenuItem value="raisedByTeam">
              <Checkbox checked={fields.includes("raisedByTeam")} />
              <ListItemText primary="Raised by Team" />
            </MenuItem>
            <MenuItem value="description">
              <Checkbox checked={fields.includes("description")} />
              <ListItemText primary="Description" />
            </MenuItem>
            <MenuItem value="activities">
              <Checkbox checked={fields.includes("activities")} />
              <ListItemText primary="Activities" />
            </MenuItem>
            <MenuItem value="responsible">
              <Checkbox checked={fields.includes("responsible")} />
              <ListItemText primary="Responsible" />
            </MenuItem>
            <MenuItem value="priority">
              <Checkbox checked={fields.includes("priority")} />
              <ListItemText primary="Priority" />
            </MenuItem>
            <MenuItem value="status">
              <Checkbox checked={fields.includes("status")} />
              <ListItemText primary="Status" />
            </MenuItem>
            <MenuItem value="remark">
              <Checkbox checked={fields.includes("remark")} />
              <ListItemText primary="Remark" />
            </MenuItem>
            <MenuItem value="dueDate">
              <Checkbox checked={fields.includes("dueDate")} />
              <ListItemText primary="DueDate" />
            </MenuItem>
            <MenuItem value="nextCheck">
              <Checkbox checked={fields.includes("nextCheck")} />
              <ListItemText primary="NextCheck" />
            </MenuItem>
          </TextField>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/defects/new")}
            sx={{ whiteSpace: "nowrap" }}
          >
            New Defect
          </Button>
        </Box>
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
              filterRows().map((row) => (
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
                      onClick={() => setToDelete(row._id ?? null)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {filterRows().length === 0 && (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          No defects match your search!
        </Typography>
      )}
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
