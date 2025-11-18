import React from "react";
import { Box, Button, TextField, Stack } from "@mui/material";

interface CreateUpdateCommentProps {
  label?: string; 
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void; 
  onSave: () => void;
  onCancel: () => void;
}
function CreateUpdateComment(props: CreateUpdateCommentProps) {
  const { label = "Add a comment", value, onChange, onSave, onCancel } = props;

  return (
    <Box>
      <TextField
        label={label}
        variant="outlined"
        fullWidth
        multiline
        minRows={2}
        value={value}
        onChange={onChange}
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
  );
}
export default CreateUpdateComment;
