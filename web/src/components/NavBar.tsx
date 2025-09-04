import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

function NavBar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { logout, user } = useAuth0();

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
    console.log('Change password requested');
    handleClose();
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
          <img src="https://www.rebisco.com.ph/img/cll-vanillacloud-logo-1614649609.jpg" alt="Logo" style={{ height: 28 }} />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Bug Tracker
        </Typography>
        <Button color="inherit" component={Link} to="/defects">
          Defects
        </Button>
        <Button color="inherit" component={Link} to="/users">
          Users
        </Button>
        <div>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            {user?.picture ? (
              <Avatar alt={user.name} src={user.picture} />
            ) : (
              <AccountCircle />
            )}
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
            <MenuItem onClick={handleChangePassword}>Change Password</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
