import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu'; 
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import logo from '../static/imgs/careercanvas-high-resolution-logo-white-transparent.png';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const settings = ['Profile', 'Logout'];

function ResponsiveAppBar() {
  const { user, logoutUser } = React.useContext(AuthContext); // Access user data from context
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  console.log(user);

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#002346' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <img
            src={logo}
            alt="Logo"
            style={{ width: '350px', height: '40px', marginRight: '16px' }}
          />

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              <MenuItem onClick={handleCloseNavMenu}>
                <Typography component={Link} to="/" sx={{ textAlign: 'center' }}>Home</Typography>
              </MenuItem>
              {user && user.role === 'admin' && (
                <MenuItem onClick={handleCloseNavMenu}>
                  <Typography component={Link} to="/branch-admin-dashboard" sx={{ textAlign: 'center' }}>Dashboard</Typography>
                </MenuItem>
              )}
              {user && user.role === 'supervisor' && (
                <MenuItem onClick={handleCloseNavMenu}>
                  <Typography component={Link} to="/SDashboard" sx={{ textAlign: 'center' }}>Track Supervisor Dashboard</Typography>
                </MenuItem>
              )}
              {(!user || user.role === 'student') && (
                <>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography component={Link} to="/portfolio" sx={{ textAlign: 'center' }}>Portfolio</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography component={Link} to="/exams" sx={{ textAlign: 'center' }}>Examine</Typography>
                  </MenuItem>
                </>
              )}
            </Menu>
          </Box>

          {/* Desktop Menu (Left-aligned) */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button onClick={handleCloseNavMenu} component={Link} to="/" sx={{ my: 2, color: 'white', display: 'block' }}>Home</Button>
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Button onClick={handleCloseNavMenu} component={Link} to="/branch-admin-dashboard" sx={{ my: 2, color: 'white', display: 'block' }}>Dashboard</Button>
                )}
                {user.role === 'supervisor' && (
                  <Button onClick={handleCloseNavMenu} component={Link} to="/SDashboard" sx={{ my: 2, color: 'white', display: 'block' }}>Dashboard</Button>
                )}
                {user.role === 'student' && (
                  <>
                    <Button onClick={handleCloseNavMenu} component={Link} to="/portfolio" sx={{ my: 2, color: 'white', display: 'block' }}>Portfolio</Button>
                    <Button onClick={handleCloseNavMenu} component={Link} to="/exams" sx={{ my: 2, color: 'white', display: 'block' }}>Examine</Button>
                  </>
                )}
              </>
            ) : (
              <>
                <Button onClick={handleCloseNavMenu} component={Link} to="/portfolio" sx={{ my: 2, color: 'white', display: 'block' }}>Portfolio</Button>
                <Button onClick={handleCloseNavMenu} component={Link} to="/exams" sx={{ my: 2, color: 'white', display: 'block' }}>Examine</Button>
              </>
            )}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {user ? (
              <Button sx={{ color: 'white' }} onClick={logoutUser}>Logout</Button>
            ) : (
              <Box sx={{ flexGrow: 0, display: 'flex', gap: '15px', marginRight: '20px' }}>
                <Button sx={{ color: 'white' }} component={Link} to="/register">Register</Button>
                <Button sx={{ color: 'white' }} component={Link} to="/login">Login</Button>
              </Box>
            )}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="User Avatar" src="/static/images/avatar/placeholder.jpg" /> {/* Use a valid avatar image path */}
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
