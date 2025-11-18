import React from "react";
import { TextField, Chip, Box, Stack } from "@mui/material";

interface LabelFieldProps {
  labels: string[];
  setLabels: React.Dispatch<React.SetStateAction<string[]>>;
}

function LabelField({ labels, setLabels }: LabelFieldProps) {
  const [value, setValue] = React.useState("");

  const addLabel = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && value.trim()) {
      e.preventDefault();
      const newLabel = value.trim();
      setLabels([...labels, newLabel]);
      setValue("");
    }
  };

  const removeLabel = (label: string) => {
    setLabels(labels.filter((l) => l !== label));
  };

  return (
    <Box mt={1} sx={{ width: "100%" }}>
      <TextField
        label="Add label"
        placeholder="Add label and Enter"
        variant="outlined"
        fullWidth
        value={value}
        onKeyDown={addLabel}
        onChange={(e) => setValue(e.target.value)}
      />
      <Stack direction="row" flexWrap="wrap" gap={1} mt={2}>
        {labels.map((label, i) => (
          <Chip key={i} label={label} onDelete={() => removeLabel(label)} />
        ))}
      </Stack>
    </Box>
  );
}
export default LabelField;
