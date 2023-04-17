import React from 'react';

import { useNavigate } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';

import { Container, Grid, TextField, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DraftsOutlinedIcon from '@mui/icons-material/DraftsOutlined';
import DarkModeSharpIcon from '@mui/icons-material/DarkModeSharp';
import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';
import MuiDrawer from '@mui/material/Drawer';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import LogoutIcon from '@mui/icons-material/Logout';
import Paper from '@mui/material/Paper';



function Nav() {
    const theme = useTheme();
    const navigate = useNavigate();
    const drawerWidth = 240;
    const [open, setOpen] = React.useState(true);


const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));
const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handlesearch = () =>{
    console.log("hi at handle search")
    navigate("/filemanager")
  }
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));


const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);
    return (
        <Drawer variant="permanent" open={open} PaperProps={{
            sx: {
              backgroundColor: "#1e2833",
              width: 300,
              color:"#6b7682"
            },
          }}>
        <DrawerHeader>
          <IconButton style={{color:"#ffff"}} onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon style={{ color:"#ffff" }}/> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Box>
                    <Grid container xs={11} justifyContent={"center"}>
                        <Grid container xs={11} justifyContent={"center"} padding={2} sx={{alignItems:"center"}}>
                    

                            <Avatar sx={{ width: 80, height: 80, background:"#3498DB" }}>{localStorage.getItem('name')[0]}</Avatar>
                        </Grid>
                    
                        <Grid xs={12} textAlign={"center"} padding={2}>
                            <Typography color={"#FFFFFF"}>{localStorage.getItem('name')}</Typography>
                        </Grid>
                    </Grid>
                </Box>  
            
        <Divider />
        <List>
        <ListItem key="Drafts" disablePadding sx={{ display: 'block',
            '&& .Mui-selected, && .Mui-selected:hover': {
              bgcolor: 'red',
              '&, & .MuiListItemIcon-root': {
                color: 'pink',
              },
            },
            
            '& .MuiListItemButton-root:hover': {
              bgcolor: '#6b7682',
              '&, & .MuiListItemIcon-root': {
                color: 'white'
           
              },
            },
          }}
            
           >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    
                  }}
                >
                  <DraftsOutlinedIcon style={{ color:"#ffff" }}/>
                </ListItemIcon>
                <ListItemText primary="Drafts" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
            <ListItem key="Search" disablePadding sx={{ display: 'block',
            '&& .Mui-selected, && .Mui-selected:hover': {
              bgcolor: 'red',
              '&, & .MuiListItemIcon-root': {
                color: 'pink',
              },
            },
            
            '& .MuiListItemButton-root:hover': {
              bgcolor: '#6b7682',
              '&, & .MuiListItemIcon-root': {
                color: 'white'
           
              },
            },
          }}
            
           >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  
                }} onClick={handlesearch}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    
                  }}
                >
                  <FindInPageIcon style={{ color:"#ffff" }}/>
                </ListItemIcon>
                <ListItemText primary="Search" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
        </List>
        <Divider color="white"/>
        <List>
        <ListItem key="Dark Mode" disablePadding sx={{ display: 'block',
            '&& .Mui-selected, && .Mui-selected:hover': {
              bgcolor: 'red',
              '&, & .MuiListItemIcon-root': {
                color: 'pink',

              },
            },
            
            '& .MuiListItemButton-root:hover': {
              bgcolor: '#6b7682',
              '&, & .MuiListItemIcon-root': {
                color: '#e3e8eb',
              },
            },
            }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }} 
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <DarkModeSharpIcon style={{ color:"#ffff" }}/>
                </ListItemIcon>
                <ListItemText primary="Dark Mode" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
            <ListItem key="Logout" disablePadding sx={{ display: 'block',
            '&& .Mui-selected, && .Mui-selected:hover': {
              bgcolor: 'red',
              '&, & .MuiListItemIcon-root': {
                color: 'pink',

              },
            },
            
            '& .MuiListItemButton-root:hover': {
              bgcolor: '#6b7682',
              '&, & .MuiListItemIcon-root': {
                color: '#e3e8eb',
              },
            },
            }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }} onClick={() => {
                  window.localStorage.clear();
                  navigate("/login");
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <LogoutIcon style={{ color:"#ffff" }}/>
                </ListItemIcon>
                <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
        </List>
      </Drawer>
    );
}

export default Nav;

