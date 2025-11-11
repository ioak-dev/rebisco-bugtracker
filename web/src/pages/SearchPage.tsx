import React from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { authorized, defectsApi } from "../api/client";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, Clear } from "@mui/icons-material";

function SearchPage() {
  const auth0 = useAuth0();
  const navigate = useNavigate();

  const [keyword, setKeyword] = React.useState("");
  const [results, setResults] = React.useState<any[]>([]);
  const [searched, setSearched] = React.useState(false);

  const [seachParams, setSearchParams] = useSearchParams();

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    setSearchParams({ keyword });
    const data = await authorized(auth0, () => defectsApi.search(keyword));
    setResults(data);
  };

  React.useEffect(() => {
    const urlkeyword = seachParams.get("keyword");
    if (urlkeyword) {
      setKeyword(urlkeyword);
      authorized(auth0, () => defectsApi.search(urlkeyword)).then((data) => {
        setResults(data);
      });
    }
  }, []);

  const handleCancel = async () => {
    setKeyword("");
    setResults([]);
    setSearched(false);
    setSearchParams({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);
  };
  return (
    <Box sx={{ mt: 11, maxWidth: 700, mx: "auto" }}>
      <Box sx={{ display: "flex", gap: 3, mt: "9" }}>
        <TextField
          fullWidth
          label="Search Defects"
          variant="outlined"
          value={keyword}
          onChange={handleInputChange}
          slotProps={{
            input: {
              endAdornment: keyword && (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={handleCancel}>
                    <Clear />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="error"
            onClick={handleSearch}
            startIcon={<Search />}
          >
            Search
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => navigate("/defects")}
          >
            Back
          </Button>
        </Stack>
      </Box>

      <Box sx={{ mt: 3 }}>
        {searched && results.length === 0 && (
          <Typography>No defects related to your search !</Typography>
        )}{" "}
        {results.map((item: any, index: number) => (
          <Paper
            key={item._id || index}
            sx={{
              mb: 1,
              cursor: "pointer",
              p: 2,
              "&:hover": { backgroundColor: "#786f6dff" },
            }}
            onClick={() => navigate(`/defects/view/${item._id}`)}
          >
            <Typography sx={{ fontSize: "15px", fontWeight: 500 }}>
              {item.description}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
export default SearchPage;
