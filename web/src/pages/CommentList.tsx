import {
  Box,
  Button,
  Paper,
  Typography,
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
  Container,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { formatDistanceToNow, format } from "date-fns";
import type { IComment } from "./ViewDefectPage";

interface CommentListProps {
  comments: IComment[];
  anchorEl: HTMLElement | null;
  menuOpen: boolean;
  handleMenuOpen: (e: React.MouseEvent<HTMLElement>, id: string) => void;
  handleMenuClose: () => void;
  menuCommentId: string | null;
  editId: string | null;
  editText: string;
  onEdit: () => void;
  setEditId: React.Dispatch<React.SetStateAction<string | null>>;
  setEditText: React.Dispatch<React.SetStateAction<string>>;
  setSelectedCommentId: React.Dispatch<React.SetStateAction<string | null>>;
  setOpenCommentDelete: React.Dispatch<React.SetStateAction<boolean>>;
  openCommentDelete: boolean;
  ondelete: (id: string) => void;
  selectedCommentId: string | null;
}

function CommentList(props: CommentListProps) {
  const {
    comments,
    anchorEl,
    menuOpen,
    handleMenuOpen,
    handleMenuClose,
    menuCommentId,
    editId,
    editText,
    onEdit,
    setEditId,
    setEditText,
    setSelectedCommentId,
    setOpenCommentDelete,
    openCommentDelete,
    ondelete,
    selectedCommentId,
  } = props;

  return (
    <Container maxWidth="md" sx={{ mt: 3 }}>
      <Box sx={{ mt: 1 }}>
        {comments.map((eachComment,index) => (
          <Paper key={index} sx={{ p: 2, mb: 2 }}>
            <Box display="flex" alignItems="center" gap={0.5}>
              <Typography
                variant="subtitle2"
                fontWeight={700}
                sx={{ cursor: "default" }}
              >
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
                  {new Date(eachComment.updated).getTime() !==
                    new Date(eachComment.created).getTime() && (
                    <Typography
                      variant="caption"
                      component="span"
                      sx={{
                        color: "text.secondary",
                        cursor: "default",
                        ml: 0.5,
                      }}
                    >
                      (edited)
                    </Typography>
                  )}
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
                  <Button variant="contained" color="info" onClick={onEdit}>
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
      </Box>
    </Container>
  );
}
export default CommentList;
