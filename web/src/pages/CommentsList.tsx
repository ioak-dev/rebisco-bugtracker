import { Box, Container } from "@mui/material";
import type { IComment } from "../interface/IComment.interface";
import CommentItem from "./CommentItem";

interface CommentsListProps {
  defectId: string | null;
  comments: IComment[];
  setComments: React.Dispatch<React.SetStateAction<IComment[]>>;
}

function CommentsList(props: CommentsListProps) {
  const { defectId, comments, setComments } = props;

  return (
    <Container maxWidth="md" sx={{ mt: 3 }}>
      <Box sx={{ mt: 1 }}>
        {comments.map((eachComment, index) => (
          <CommentItem
            defectId={defectId}
            key={index}
            comment={eachComment}
            setComments={setComments}
          />
        ))}
      </Box>
    </Container>
  );
}
export default CommentsList;
