import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Container,
  DialogTitle,
} from "@mui/material";
import type { IComment } from "./ViewDefectPage";
import CommentItem from "./CommentItem";

interface CommentsListProps {
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

function CommentsList(props: CommentsListProps) {
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
        {comments.map((eachComment, index) => (
          <CommentItem
            key={index}
            eachComment={eachComment}
            anchorEl={anchorEl}
            menuOpen={menuOpen}
            menuCommentId={menuCommentId}
            handleMenuClose={handleMenuClose}
            handleMenuOpen={handleMenuOpen}
            setEditId={setEditId}
            setEditText={setEditText}
            setSelectedCommentId={setSelectedCommentId}
            setOpenCommentDelete={setOpenCommentDelete}
            editId={editId}
            editText={editText}
            onEdit={onEdit}
          />
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
export default CommentsList;
