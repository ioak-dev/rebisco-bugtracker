import React, { useState } from "react";
import {
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Box,
  Drawer,
  CircularProgress,
  Tooltip,
  useColorScheme,
  Stack,
} from "@mui/material";
import {
  AccountCircle,
  LightMode,
  DarkMode,
  Laptop,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

function NavBar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { logout, user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [changePwdOpen, setChangePwdOpen] = React.useState(false);
  const [email, setEmail] = React.useState<string>(user?.email || "");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const { setMode } = useColorScheme();

  const [collapsed, setCollapsed] = useState(false);

  React.useEffect(() => {
    setMode("system");
  }, []);

  const handleChange = (newMode: "light" | "dark" | "system") => {
    setMode(newMode);
  };

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
    <Box
      sx={{
        width: collapsed ? "60px" : "120px",
        transition: "margin-left 0.25s ease",
      }}
    >
      <Drawer
        variant="permanent"
        sx={{
          width: collapsed ? 60 : 120,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: collapsed ? 60 : 120,
            transition: "width 0.25s ease",
            overflowX: "hidden",
            boxSizing: "border-box",
            p: 1,
            bgcolor: "#EB2A2E",
            color: "white",
          },
        }}
      >
        <IconButton
          onClick={() => setCollapsed(!collapsed)}
          sx={{ color: "white", alignSelf: "flex-end", mb: 1 }}
        >
          {collapsed ? (
            <Tooltip title="Expand sidebar">
              <ChevronRight />
            </Tooltip>
          ) : (
            <Tooltip title="Collapse sidebar">
              <ChevronLeft />
            </Tooltip>
          )}
        </IconButton>
        <Box sx={{ mb: 2 }}></Box>
        {collapsed && <IconButton sx={{ p: 1, mb: 1 }}>R</IconButton>}
        {!collapsed && (
          <IconButton component={Link} to="/" sx={{ p: 1, mb: 1 }}>
            <img
              src="https://www.rebisco.com.ph/img/cll-vanillacloud-logo-1614649609.jpg"
              alt="Logo"
              style={{ height: 28 }}
            />
          </IconButton>
        )}
        {!collapsed && (
          <Typography
            variant="body2"
            sx={{ textAlign: "center", mb: 3, flexGrow: 3 }}
          >
            Bug Tracker
          </Typography>
        )}
        <Box sx={{ flexGrow: 1 }} />
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
        <Stack spacing={2} sx={{ mb: 2, alignItems: "center" }}>
          <Tooltip title="Light Mode" placement="left">
            <IconButton
              size="medium"
              onClick={() => handleChange("light")}
              sx={{ p: 0.75 }}
            >
              <LightMode fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="System Mode" placement="left">
            <IconButton
              size="medium"
              onClick={() => handleChange("system")}
              sx={{ p: 0.75 }}
            >
              <Laptop fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Dark Mode" placement="left">
            <IconButton
              size="medium"
              onClick={() => handleChange("dark")}
              sx={{ p: 0.75 }}
            >
              <DarkMode fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
        <Box sx={{ display: "flex", mt: "auto", justifyContent: "center" }}>
          {isAuthenticated ? (
            <>
              <IconButton
                size="large"
                aria-label="account of current user"
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
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
                <MenuItem onClick={handleChangePassword}>
                  Change Password
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button color="inherit" onClick={() => loginWithRedirect()}>
              Login
            </Button>
          )}
        </Box>
      </Drawer>
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
    </Box>
  );
}

export default NavBar;
