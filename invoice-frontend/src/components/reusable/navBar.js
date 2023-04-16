import React from 'react';

import { useNavigate } from 'react-router-dom';

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

function Nav() {
    
    const navigate = useNavigate();
    const drawerWidth = 200;
    return (
            <Drawer anchor='left'
            variant='permanent'
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                  width: drawerWidth,
                  boxSizing: 'border-box',
                  background:"#1e2833"
                },
              }}
            >
                <Box>
                    <Grid container xs={12} justifyContent={"center"}>
                        <Grid xs={12}>
                            <IconButton size="large" onClick={()=>{navigate("/dashboard")}} sx={{color:"white",":hover":{background:"#6b7682"}}}>
                            <ChevronLeftRoundedIcon />
                            </IconButton>

                        </Grid>
                        <Grid container xs={12} justifyContent={"center"} padding={2} sx={{alignItems:"center"}}>
                    
                            <Avatar sx={{ width: 80, height: 80, background:"#D3D3D3" }}><Typography sx={{color:"#1e2833"}}>{localStorage.getItem('uid')[0]}</Typography></Avatar>
                        </Grid>
                    
                        <Grid xs={12} textAlign={"center"} padding={1}>
                            <Typography color={"#FFFFFF"}>{localStorage.getItem('name')}</Typography>
                        </Grid>
                    </Grid>
                </Box>  
            </Drawer>
    );
}

export default Nav;