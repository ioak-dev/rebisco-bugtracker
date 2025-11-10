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
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { formatDistanceToNow, format } from "date-fns";
import type { IComment } from "./ViewDefectPage";
import CreateUpdateComment from "./CreateUpdateComment";

interface CommentItemProps {
  eachComment: IComment;
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
}

function CommentItem(props: CommentItemProps) {
  const {
    eachComment,
    menuCommentId,
    anchorEl,
    menuOpen,
    handleMenuOpen,
    handleMenuClose,
    setEditId,
    setEditText,
    setSelectedCommentId,
    setOpenCommentDelete,
    editId,
    editText,
    onEdit,
  } = props;

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
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
        open={menuOpen && menuCommentId === eachComment.id}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            setEditId(eachComment.id); 
            setEditText(eachComment.content?.[0]?.text || "");

            handleMenuClose();
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            setSelectedCommentId(eachComment.id);
            setOpenCommentDelete(true);

            handleMenuClose();
          }}
        >
          Delete
        </MenuItem>
      </Menu>
      {editId === eachComment.id ? (
        <CreateUpdateComment
          label="Edit comment"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onSave={onEdit}
          onCancel={() => setEditId(null)}
        />
      ) : (
        <Typography variant="body1" sx={{ mt: 2 }}>
          {eachComment.content?.[0].text}
        </Typography>
      )}
    </Paper>
  );
}

export default CommentItem;
