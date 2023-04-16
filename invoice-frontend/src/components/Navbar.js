import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import HomeIcon from '@mui/icons-material/Home';
const styles = {
    flex: {
      flex: 1,
    },
  };
  
  const Navbar = () => {
    return (
      <>
        <Box sx={styles.flex}>
          <AppBar position='sticky' sx={{ borderRadius: '10px' }} disablegutters='true' style={{backgroundColor:"#ffff",color:"#000000"}}>
            <Toolbar>
              
              <Typography variant="h5" sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'Noto serif',
              fontWeight: 800,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
              flex: 1,
            }}
            >
                Invoice Recognition
              </Typography>
              <HomeIcon fontSize="medium"/>
            </Toolbar>
          </AppBar>
        </Box>
        
      </>
    );
  };
  
  export default Navbar;