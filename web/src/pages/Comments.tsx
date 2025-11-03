import {
  Box,
  Button,
  Typography,
  TextField,
  Stack,
  Container,
} from "@mui/material";

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
    <Container maxWidth="md" sx={{ mt: 3 }}>
      <Box sx={{ mt: 0.5 }}>
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
          onChange={onCommentChange}
        />
        <Stack spacing={2} direction="row" mt={2}>
          <Button variant="contained" color="info" onClick={onSave}>
            Save
          </Button>
          <Button variant="text" color="info" onClick={onCancel}>
            Cancel
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
export default Comments;
