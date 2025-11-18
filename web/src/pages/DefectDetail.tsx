import React from "react";
import {
  Box,
  Button,
  Container,
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
  Stack,
} from "@mui/material";
import type { IDefect } from "../interface/IDefect.interface";

interface DefectDetailProps {
  form: IDefect;
  id: string | undefined;
  openDeleteDialog: boolean;
  setOpenDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>;
  confirmDelete: () => void;
  navigate: (path: string) => void;
}

function DefectDetail(props: DefectDetailProps) {
  const {
    form,
    id,
    openDeleteDialog,
    setOpenDeleteDialog,
    confirmDelete,
    navigate,
  } = props;
  
  return (
    <Container maxWidth="md" sx={{ mt: 3 }}>
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
        <Stack
          spacing={3}
          justifyContent={"space-between"}
          mt={2}
          direction="row"
        >
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
        </Stack>
      </Box>
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete</DialogTitle>
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
    </Container>
  );
}
export default DefectDetail;
