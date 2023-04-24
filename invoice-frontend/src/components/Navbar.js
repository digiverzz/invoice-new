import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import  Button from '@mui/material/Button';


const styles = {
    flex: {
      flex: 1,
    },
  };


  
  const Navbar = () => {
    const navigate = useNavigate()
    return (
      <>
        <Box sx={styles.flex} className="container-fluid" >
          <AppBar position='sticky' disablegutters='true' style={{backgroundColor:"transparent",color:"#000000",boxShadow:"none",borderColor:"none"}}>
            <Toolbar>
              
              <Typography variant="h5" sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 800,
              letterSpacing: '.1rem',
              color: 'inherit',
              flex: 1,
            }}
            >
                Invoice Recognition
              </Typography>
              <Button>
              <HomeIcon fontSize="medium" onClick={() => navigate("/dashboard")} sx={{color:"#000000"}}/>
              </Button>
            </Toolbar>
          </AppBar>
        </Box>
        
      </>
    );
  };
  
  export default Navbar;