import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Box,
  CircularProgress,
} from "@mui/material";
import { AccountCircle, DarkMode, LightMode } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

function NavBar({
  mode,
  setMode,
}: {
  mode: "light" | "dark";
  setMode: React.Dispatch<React.SetStateAction<"light" | "dark">>;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { logout, user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [changePwdOpen, setChangePwdOpen] = React.useState(false);
  const [email, setEmail] = React.useState<string>(user?.email || "");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
    handleClose();
  };

  const handleChangePassword = () => {
    setEmail(user?.email || "");
    setError(null);
    setSuccess(null);
    setChangePwdOpen(true);
    handleClose();
  };

  const sendPasswordReset = async () => {
    setError(null);
    setSuccess(null);
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    const domain = import.meta.env.VITE_AUTH0_DOMAIN;
    const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
    const connection =
      import.meta.env.VITE_AUTH0_DB_CONNECTION ||
      "Username-Password-Authentication";
    if (!domain || !clientId) {
      setError("Auth0 configuration is missing.");
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch(
        `https://${domain}/dbconnections/change_password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ client_id: clientId, email, connection }),
        }
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to send reset email");
      }
      setSuccess("Password reset email sent. Please check your inbox.");
    } catch (e: any) {
      setError(e.message || "Failed to send reset email");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar sx={{ minHeight: 72 }}>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          component={Link}
          to="/"
        >
          <img
            src="https://www.rebisco.com.ph/img/cll-vanillacloud-logo-1614649609.jpg"
            alt="Logo"
            style={{ height: 28 }}
          />
        </IconButton>
        <Typography variant="body2" component="div" sx={{ flexGrow: 1 }}>
          Bug Tracker
        </Typography>
        {/* {isAuthenticated && (
          <>
            <Button color="inherit" component={Link} to="/defects">
              Defects
            </Button>
            <Button color="inherit" component={Link} to="/users">
              Users
            </Button>
          </>
        )} */}
        <div>
          {isAuthenticated ? ( 
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap:0.5}}>
                <LightMode fontSize="small" /> {/*sx={{color:mode === 'light'?'#ffeb3b':'#bdbdbd}}-----*/}
                <Switch
                  checked={mode === "dark"}
                  onChange={() => setMode(mode === "light" ? "dark" : "light")}
                  color="default"
                />
                <DarkMode fontSize="small" />
              </Box>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                {user?.picture ? (
                  <Avatar
                    alt={user.name}
                    src={user.picture}
                    sx={{
                      color: "#000",
                      bgcolor: "#fff",
                      width: 32,
                      height: 32,
                    }}
                  />
                ) : (
                  <Avatar sx={{ bgcolor: "#fff", width: 32, height: 32 }}>
                    <AccountCircle sx={{ color: "#000" }} />
                  </Avatar>
                )}
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
                <MenuItem onClick={handleChangePassword}>
                  Change Password
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button color="inherit" onClick={() => loginWithRedirect()}>
              Login
            </Button>
          )}
        </div>
      </Toolbar>

      <Dialog
        open={changePwdOpen}
        onClose={() => setChangePwdOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Enter your account email to receive a password reset link.
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChangePwdOpen(false)} disabled={submitting}>
            Close
          </Button>
          <Button
            onClick={sendPasswordReset}
            variant="contained"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <CircularProgress size={18} sx={{ mr: 1 }} /> Sending…
              </>
            ) : (
              "Send Reset Email"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
}

export default NavBar;
