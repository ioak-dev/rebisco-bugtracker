import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { authorized, defectsApi } from "../api/client";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Typography, Paper } from "@mui/material";

import DefectDeatil from "./DefectDetail";
import Comments from "./Comments";
import CommentList from "./CommentList";

export interface IComment {
  id: string;
  author: {
    accountId: string;
    emailAddress: string;
    displayName: string;
    active: boolean;
  };
  content: {
    type: string;
    text: string;
  }[];
  created: string | Date;
  updated: string | Date;
}

export interface IDefect {
  _id?: string;
  raisedByTeam: string;
  description: string;
  activities: string;
  responsible: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  dueDate?: string;
  status: "Open" | "In Progress" | "Blocked" | "Closed" | "Reopened";
  nextCheck?: string;
  remark?: string;
  comments?: IComment[];
}

function ViewDefectPage() {
  const auth0 = useAuth0();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = React.useState(true);
  const [form, setForm] = React.useState<IDefect | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  const [openCommentDelete, setOpenCommentDelete] = React.useState(false);
  const [selectedCommentId, setSelectedCommentId] = React.useState<
    string | null
  >(null);

  const [comment, setComment] = React.useState("");
  const [comments, setComments] = React.useState<IComment[]>([]);

  const [editId, setEditId] = React.useState<string | null>(null);
  const [editText, setEditText] = React.useState("");

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [menuCommentId, setMenuCommentId] = React.useState<string | null>(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    commentId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuCommentId(commentId);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuCommentId(null);
  };
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
        setComments(data.comments || []);
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

  const onCommentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setComment(e.target.value);
  };
  const onSave = async () => {
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
        return defectsApi.addComment(id!, newComment);
      });
      setComments([...comments, newComment]);
      setComment("");
    }
  };
  const onCancel = () => {
    setComment("");
  };
  const onEdit = () => {
    if (!id || !editId) return;
    authorized(auth0, () => defectsApi.updatecomment(id, editId, editText));
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

  const ondelete = async (commentid: string) => {
    if (!id) return;
    await authorized(auth0, () => defectsApi.deletecomment(id, commentid));
    setComments(comments.filter((each) => each.id !== commentid));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <DefectDeatil
          form={form}
          id={id}
          openDeleteDialog={openDeleteDialog}
          setOpenDeleteDialog={setOpenDeleteDialog}
          confirmDelete={confirmDelete}
          navigate={navigate}
        />

        <Comments
          comment={comment}
          onCommentChange={onCommentChange}
          onSave={onSave}
          onCancel={onCancel}
        />

        <CommentList
          comments={comments}
          anchorEl={anchorEl}
          menuOpen={menuOpen}
          handleMenuOpen={handleMenuOpen}
          handleMenuClose={handleMenuClose}
          menuCommentId={menuCommentId}
          editId={editId}
          setEditId={setEditId}
          editText={editText}
          setEditText={setEditText}
          onEdit={onEdit}
          setSelectedCommentId={setSelectedCommentId}
          setOpenCommentDelete={setOpenCommentDelete}
          openCommentDelete={openCommentDelete}
          ondelete={ondelete}
          selectedCommentId={selectedCommentId}
        />
      </Paper>
    </Container>
  );
}
export default ViewDefectPage;
