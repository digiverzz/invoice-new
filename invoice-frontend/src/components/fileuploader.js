import React from "react";
import './fileUploader.css'
import AppBar from '@mui/material/AppBar';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import { Navigate, redirect } from "react-router-dom";
import {useNavigate} from "react-router-dom"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Button, CardActionArea, CardActions } from '@mui/material';


export default function FileUploader (){
    const navigate = useNavigate();

    //variables and constants used
    
    

    //*****************************return******************************//
    return(

       <div className="uploader-main">
            {/********************Top navbar ***************/}
           {/* <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" sx={{ height: "500" }}>
                    <Toolbar >
                        <IconButton onClick={()=>navigate('/dashboard')}
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}>
                        <ArrowBackTwoToneIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Box>
 */}
            {/***************** Main card ******************/}
            <div className="container">
                        <IconButton onClick={()=>navigate('/dashboard')}
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2, color:'white'}}>
                        <ArrowBackTwoToneIcon />
                        </IconButton>
            </div>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', borderLeft : '50px solid #10478A', borderTop: '50px solid #10478A' }}>
            <Card sx={{ width: 500, height:500,  border: '2px solid #1a8cff'}}>
                 <CardActionArea>
                  {/*    <CardMedia
                        component="img"
                        height="140"
                        image="/static/images/cards/contemplative-reptile.jpg"
                        alt="green iguana"/> */}
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' ,fontWeight: 'bold' }}>
                        Upload your file
                     </Typography>
                    <Typography variant="body2" color="text.secondary">
                        
                    </Typography>
                </CardContent>
                </CardActionArea>
                <CardActions>
                    <Button size="small" color="primary">
                         UPLOAD FILES
                    </Button>
                </CardActions>
            </Card>
            </Box>

       </div>
    )
}