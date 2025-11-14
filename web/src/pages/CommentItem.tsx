//each comment
import React from "react";
import {
  Box,
  Paper,
  Typography,
  Menu,
  MenuItem,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { formatDistanceToNow, format } from "date-fns";
import type { IComment } from "../interface/IComment.interface";
import CreateUpdateComment from "./CreateUpdateComment";
import { authorized, defectsApi } from "../api/client";
import { useAuth0 } from "@auth0/auth0-react";

interface CommentItemProps {
  defectId: string | null;
  comment: IComment;
  editId: string | null;
  editText: string;
  onEdit: () => void;
  setEditId: React.Dispatch<React.SetStateAction<string | null>>;
  setEditText: React.Dispatch<React.SetStateAction<string>>;
}

function CommentItem(props: CommentItemProps) {
  const {
    defectId,
    comment,
    setEditId,
    setEditText,
    editId,
    editText,
    onEdit,
  } = props;
  const auth0 = useAuth0();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const [openCommentDeleteDialog, setOpenCommentDeleteDialog] =
    React.useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const onDelete = async () => {
    if (!defectId) return;
    await authorized(auth0, () =>
      defectsApi.deleteComment(defectId, comment.id)
    );
    // setComments(comments.filter((each) => each.id !== commentid));
  };

  return (
    <>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box display="flex" alignItems="center" gap={0.5}>
          <Typography
            variant="subtitle2"
            fontWeight={700}
            sx={{ cursor: "default" }}
          >
            {comment.author?.displayName || "user"}
          </Typography>
          <Tooltip
            placement="top"
            title={format(new Date(comment.created), "PPpp")}
          >
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                cursor: "default",
              }}
            >
              {formatDistanceToNow(new Date(comment.created))} ago
              {new Date(comment.updated).getTime() !==
                new Date(comment.created).getTime() && (
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
            onClick={handleMenuOpen}
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
              setEditId(comment.id);
              setEditText(comment.content?.[0]?.text || "");
              handleMenuClose();
            }}
          >
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              setOpenCommentDeleteDialog(true);
              handleMenuClose();
            }}
          >
            Delete
          </MenuItem>
        </Menu>
        {editId === comment.id ? (
          <CreateUpdateComment
            label="Edit comment"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onSave={onEdit}
            onCancel={() => setEditId(null)}
          />
        ) : (
          <Typography variant="body1" sx={{ mt: 2 }}>
            {comment.content?.[0].text}
          </Typography>
        )}
      </Paper>
      <Dialog
        open={openCommentDeleteDialog}
        onClose={() => setOpenCommentDeleteDialog(false)}
      >
        <DialogTitle>Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this comment?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCommentDeleteDialog(false)}>
            Cancel
          </Button>
          <Button
            color="error"
            onClick={() => {
              onDelete();
              setOpenCommentDeleteDialog(false);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CommentItem;
