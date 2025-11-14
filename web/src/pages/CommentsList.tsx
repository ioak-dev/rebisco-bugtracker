import {
  Box,
  Container,
} from "@mui/material";
import type { IComment } from "../interface/IComment.interface";
import CommentItem from "./CommentItem";

interface CommentsListProps {
  defectId: string | null;
  comments: IComment[];
  editId: string | null;
  editText: string;
  onEdit: () => void;
  setEditId: React.Dispatch<React.SetStateAction<string | null>>;
  setEditText: React.Dispatch<React.SetStateAction<string>>;
  setComments: React.Dispatch<React.SetStateAction<IComment[]>>;

}

function CommentsList(props: CommentsListProps) {
  const {
    defectId,
    comments,
    editId,
    editText,
    onEdit,
    setEditId,
    setEditText,
     setComments,
  } = props;

  return (
    <Container maxWidth="md" sx={{ mt: 3 }}>
      <Box sx={{ mt: 1 }}>
        {comments.map((eachComment, index) => (
          <CommentItem
            defectId={defectId}
            key={index}
            comment={eachComment}
            setEditId={setEditId}
            setEditText={setEditText}
            editId={editId}
            editText={editText}
            onEdit={onEdit}
            setComments={setComments}
          />
        ))}        
      </Box>
    </Container>
  );
}
export default CommentsList;
