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
  TextField,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  Stack,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { formatDistanceToNow, format } from "date-fns";

export interface IComment {
  id: string;
  author: {
    accountId: string;
    emailAddress: string;
    displayName: string;
    active: boolean;
  };
  content: {
    type: string;
    text: string;
  }[];
  created: string | Date;
  updated: string | Date;
}

export interface IDefect {
  _id?: string;
  raisedByTeam: string;
  description: string;
  activities: string;
  responsible: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  dueDate?: string;
  status: "Open" | "In Progress" | "Blocked" | "Closed" | "Reopened";
  nextCheck?: string;
  remark?: string;
  comments?: IComment[];
}

function ViewDefectPage() {
  const auth0 = useAuth0();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = React.useState(true);
  const [form, setForm] = React.useState<IDefect | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  const [openCommentDelete, setOpenCommentDelete] = React.useState(false);
  const [selectedCommentId, setSelectedCommentId] = React.useState<
    string | null
  >(null);

  const [comment, setComment] = React.useState("");
  const [comments, setComments] = React.useState<IComment[]>([]);

  const [editId, setEditId] = React.useState<string | null>(null);
  const [editText, setEditText] = React.useState("");

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [menuCommentId, setMenuCommentId] = React.useState<string | null>(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    commentId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuCommentId(commentId);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuCommentId(null);
  };
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
        setComments(data.comments || []);
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
  const oncommentchange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setComment(e.target.value);
  };
  const onSave = async () => {
    console.log("save button clicked");
    if (comment.trim() !== "") {
      const newComment = {
        id: crypto.randomUUID(),
        author: {
          accountId: auth0.user?.sub || "unknown",
          emailAddress: auth0.user?.email || "noemail@example.com",
          displayName: auth0.user?.email?.split("@")[0] || "anonymous",
          active: true,
        },
        content: [
          {
            type: "text",
            text: comment,
          },
        ],
        created: new Date(),
        updated: new Date(),
      };
      await authorized(auth0, () => {
        return defectsApi.addComment(id!, newComment);
      });
      setComments([...comments, newComment]);
      setComment("");
    }
  };
  const onCancel = () => {
    setComment("");
  };
  const onedit = () => {
    if (!id || !editId) return;
    authorized(auth0, () => defectsApi.updatecomment(id, editId, editText));
    setComments((prev) =>
      prev.map((c) =>
        c.id === editId
          ? {
              ...c,
              content: [{ type: "text", text: editText }],
            }
          : c
      )
    );
    setEditId(null);
    setEditText("");
  };

  const ondelete = async (commentid: string) => {
    if (!id) return;
    await authorized(auth0, () => defectsApi.deletecomment(id, commentid));
    setComments(comments.filter((each) => each.id !== commentid));
  };

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
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Comments
          </Typography>
          <TextField
            label="Add a comment"
            variant="outlined"
            fullWidth
            multiline
            minRows={3}
            value={comment}
            onChange={oncommentchange}
          />
          <Stack spacing={2} direction="row" mt={2}>
            <Button variant="contained" color="info" onClick={onSave}>
              Save
            </Button>
            <Button variant="text" color="info" onClick={onCancel}>
              Cancel
            </Button>
          </Stack>
          <Box sx={{ mt: 3 }}>
            {comments.map((eachComment, index) => (
              <Paper key={index} sx={{ p: 2, mb: 2 }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{cursor:"default"}}>
                    {eachComment.author?.displayName || "user"}
                  </Typography>
                  <Tooltip
                    placement="top"
                    title={format(new Date(eachComment.created), "PPpp")}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        cursor: "default",
                      }}
                    >
                      {formatDistanceToNow(new Date(eachComment.created))} ago
                    </Typography>
                  </Tooltip>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, eachComment.id)}
                    sx={{ padding: 0, marginLeft: "10px" }}
                  >
                    <MoreVertIcon fontSize="medium" />
                  </IconButton>
                </Box>
                <Menu
                  anchorEl={anchorEl}
                  open={menuOpen}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                >
                  <MenuItem
                    onClick={() => {
                      const comment = comments.find(
                        (c) => c.id === menuCommentId
                      );
                      if (comment) {
                        setEditId(comment.id);
                        setEditText(comment.content?.[0]?.text || "");
                      }
                      handleMenuClose();
                    }}
                  >
                    Edit
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      if (menuCommentId) {
                        setSelectedCommentId(menuCommentId);
                        setOpenCommentDelete(true);
                      }
                      handleMenuClose();
                    }}
                  >
                    Delete
                  </MenuItem>
                </Menu>
                {editId === eachComment.id ? (
                  <>
                    <TextField
                      fullWidth
                      multiline
                      minRows={2}
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <Stack spacing={2} mt={2} direction="row">
                      <Button variant="contained" color="info" onClick={onedit}>
                        Save
                      </Button>
                      <Button
                        variant="text"
                        color="info"
                        onClick={() => setEditId(null)}
                      >
                        Cancel
                      </Button>
                    </Stack>
                  </>
                ) : (
                  <Typography variant="body1" sx={{ mt: 1.5 }}>
                    {eachComment.content?.[0].text}
                  </Typography>
                )}
              </Paper>
            ))}
          </Box>
        </Box>
        <Dialog
          open={openCommentDelete}
          onClose={() => setOpenCommentDelete(false)}
        >
          <DialogTitle>Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this comment?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCommentDelete(false)}>Cancel</Button>
            <Button
              color="error"
              onClick={() => {
                if (selectedCommentId) {
                  ondelete(selectedCommentId);
                  setOpenCommentDelete(false);
                }
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
}
export default ViewDefectPage;
