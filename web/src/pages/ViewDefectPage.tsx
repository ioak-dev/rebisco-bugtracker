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
} from "@mui/material";

function ViewDefectPage() {
  const auth0 = useAuth0();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = React.useState(true);
  const [form, setForm] = React.useState<any | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  const [openCommentDelete, setOpenCommentDelete] = React.useState(false);
  const [selectedCommentId, setSelectedCommentId] = React.useState<
    string | null
  >(null);

  const [comment, setcomment] = React.useState("");
  const [comments, setcomments] = React.useState<any[]>([]);

  const [editid, seteditid] = React.useState(null);
  const [edittext, setedittext] = React.useState("");

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
        setcomments(data.comments || []);
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
    setcomment(e.target.value);
  };
  const onsave = async () => {
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
        return defectsApi.AddComment(id!, newComment);
      });
      setcomments([...comments, newComment]);
      setcomment("");
    }
  };
  const oncancel = () => {
    setcomment("");
  };
  const onedit = () => {
    if (!id || !editid) return;
    authorized(auth0, () => defectsApi.updatecomment(id, editid, edittext));
    setcomments((prev) =>
      prev.map((c) =>
        c.id === editid
          ? {
              ...c,
              content: [{ type: "text", text: edittext }],
            }
          : c
      )
    );
    seteditid(null);
    setedittext("");
  };

  const ondelete = async (commentid: string) => {
    if (!id) return;
    await authorized(auth0, () => defectsApi.deletecomment(id, commentid));
    setcomments(comments.filter((each) => each.id !== commentid));
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
          <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
            <Button variant="contained" color="info" onClick={onsave}>
              Save
            </Button>
            <Button variant="text" color="info" onClick={oncancel}>
              Cancel
            </Button>
          </Box>
          <Box sx={{ mt: 3 }}>
            {comments.map((eachcomment, index) => (
              <Paper key={index} sx={{ p: 2, mb: 1 }}>
                <Typography variant="subtitle2" fontWeight={700}>
                  {eachcomment.author?.displayName || "user"}
                </Typography>
                {editid == eachcomment.id ? (
                  <>
                    <TextField
                      fullWidth
                      multiline
                      minRows={2}
                      value={edittext}
                      onChange={(e) => setedittext(e.target.value)}
                    />
                    <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                      <Button
                        variant="contained"
                        color="info"
                        onClick={onedit}
                      >
                        Save
                      </Button>
                      <Button
                        variant="text"
                        color="info"
                        onClick={() => seteditid(null)}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </>
                ) : (
                  <>
                    <Typography variant="body1">
                      {eachcomment.content?.[0].text}
                    </Typography>
                    <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                      <Button
                        variant="text"
                        color="info"
                        onClick={() => {
                          seteditid(eachcomment.id);
                          setedittext(eachcomment.content?.[0]?.text);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="text"
                        color="error"
                        onClick={() => {
                          setSelectedCommentId(eachcomment.id);
                          setOpenCommentDelete(true);
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </>
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
