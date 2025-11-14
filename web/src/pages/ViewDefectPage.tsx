import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { authorized, defectsApi } from "../api/client";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Typography, Paper, Box } from "@mui/material";
import CommentsList from "./CommentsList";
import DefectDetail from "./DefectDetail";
import CreateUpdateComment from "./CreateUpdateComment";
import type { IDefect } from "../interface/IDefect.interface";
import type { IComment } from "../interface/IComment.interface";
function ViewDefectPage() {
  const auth0 = useAuth0();
  const navigate = useNavigate();
  const { defectId } = useParams();
  const [loading, setLoading] = React.useState(true);
  const [form, setForm] = React.useState<IDefect | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [comment, setComment] = React.useState("");
  const [comments, setComments] = React.useState<IComment[]>([]);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [editText, setEditText] = React.useState("");

  React.useEffect(() => {
    (async () => {
      if (!defectId) return;
      try {
        setLoading(true);
        const data = await authorized(auth0, () => defectsApi.get(defectId));
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
  }, [defectId, auth0]);

  const confirmDelete = async () => {
    if (!defectId) return;
    await authorized(auth0, () => defectsApi.remove(defectId));
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

  const onCommentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setComment(e.target.value);
  };
  const onSave = async () => {
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
        return defectsApi.addComment(defectId!, newComment);
      });
      setComments([...comments, newComment]);
      setComment("");
    }
  };
  const onCancel = () => {
    setComment("");
  };
  const onEdit = () => {
    if (!defectId || !editId) return;
    authorized(auth0, () =>
      defectsApi.updateComment(defectId, editId, editText)
    );
    setComments((prev) =>
      prev.map((c) =>
        c.id === editId
          ? {
              ...c,
              content: [{ type: "text", text: editText }],
              updated: new Date(),
            }
          : c
      )
    );
    setEditId(null);
    setEditText("");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <DefectDetail
          form={form}
          id={defectId}
          openDeleteDialog={openDeleteDialog}
          setOpenDeleteDialog={setOpenDeleteDialog}
          confirmDelete={confirmDelete}
          navigate={navigate}
        />

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

        <CommentsList
          defectId={defectId || null}
          comments={comments}
          editId={editId}
          setEditId={setEditId}
          editText={editText}
          setEditText={setEditText}
          onEdit={onEdit}
          setComments={setComments}
        />
      </Paper>
    </Container>
  );
}
export default ViewDefectPage;
