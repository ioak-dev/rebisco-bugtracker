import {
  Box,
  Typography,
  Container,
} from "@mui/material";
import CreateUpdateComment from "./CreateUpdateComment";

interface CommentProps {
  comment: string;
  onCommentChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSave: () => void;
  onCancel: () => void;
}
function Comments(props: CommentProps) {
  const { comment, onCommentChange, onSave, onCancel } = props;

  return (
    <Container maxWidth="md" sx={{ mt: 2 }}>
      <Box sx={{ mt: 0.5 }}>
        <Typography variant="h6" gutterBottom>
          Comments
        </Typography>
        <CreateUpdateComment
          label="Add a comment"
          value={comment}
          onChange={onCommentChange}
          onSave={onSave}
          onCancel={onCancel}
        />
      </Box>
    </Container>
  );
}
export default Comments;
