import React, { useState, useEffect} from "react";
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
import Paper from '@mui/material/Paper';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { render } from "@testing-library/react";
import Alert from '@mui/material/Alert';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import axios, * as others from "axios";
import URI from "../utils/request";
import { toast, ToastContainer } from 'react-toastify';
import uploadGIF from "../images/uploadGIF.gif";
import uploadgif from "../images/output-onlinegiftools.gif";
import InvoiceData from "./InvoiceData";
import Grid from "@mui/material/Grid";
import InvoiceForm from "./invoiceForm.js";

 class FileUploader extends React.Component
{
    
   //defining the state through class approach////    
    constructor(props){
        super(props)

        this.state={
           opened:false,
           uploadedFiles:[],
           fileBase:[],
           resData: undefined,
           loader:false
        }
     }
    
    
    handleClose=()=>{
        this.setState({
            opened:false
         })
    }
   
    ////////////Upload files to the state array "uploadedFiles"///////////
    uploadFiles=(event)=>{
           const files = event.target.files
         /*   console.log(files) */
           const newFiles = Array.from(files);
          /*  console.log(newFiles) */
           this.setState((prevState) => ({ uploadedFiles: [...prevState.uploadedFiles, ...newFiles] }));
          
          /*  console.log(this.state.uploadedFiles) */
    }
      

    ////////////Delete files to the state array "uploadedFiles"///////////
    deleteFiles=(index)=>{
        const updatedFiles=[...this.state.uploadedFiles]
        updatedFiles.splice(index,1)
     /*    console.log("locally updated"+updatedFiles) */
        this.setState({
            uploadedFiles:updatedFiles
        }) 
        

    }

    
    ////////////push files to the backend///////////
    pushFilesToBackend= async () =>{


        if(this.state.uploadedFiles.length==0){
           this.setState({
                opened:true,
           })
        }
        else{
          this.setState({
            loader:true,
       })
        }
        
        const  files=this.state.uploadedFiles
        const tempfiles = [];
        const dataUrls = [];
        const FileName = [];
        const FileSize = [];
        
        files.forEach(async (item) => {

            /* reading file(s) from the input and converting to data URLs */
            const reader = new FileReader();
            reader.onload = (event) => {
              
              /* defining the format of the file(s) to be posted to backend */
              var format = {
                name: "",
                data: "",
                extension:"",
                pdf_image:""
              };  
              
              format["name"] = item.name;
              format["data"] = event.target.result;
              format['extension'] = item.name.split(".")[1]
              tempfiles.push(format)
              dataUrls.push(event.target.result);
              FileName.push(item.name);
              FileSize.push(item.size);
              if (dataUrls.length === files.length) {// All files have been converted to data URLs
                
               /* posting the fromat data to backend */
                axios
                .post(URI + "predict", {"data":tempfiles}, {
                  headers: {
                    "content-Type": "application/json",
                  },
                })
                .then((response) => {
                  /* console.log(response.message) */
                  let data = response.data.response;
                  /* console.log("response", data); */
                  
                  this.setState({
                    resData:data
                  })
                })
                .catch((error)=> {
                  
                  toast.error("Something Went Wrong. Try again", {
                    position: "bottom-left",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    });
                    
                    this.setState({
                        uploadedFiles:[], 
                        loader:false
                    })

                    
                    
                    //navigate("/uploadfile")
                })
      
                
                this.setState({
                    fileBase:[...tempfiles]
                })
              }
            };
            reader.readAsDataURL(item);
          });
}

    //*****************************return******************************//
    render(){
    
    let invoiceDataComponent;
return(
    /*******Main div********/
    <div className="main">
    {/* if !resData and fileBase are empty render outerPart-1 else outerPart-2 */}    
    {!this.state.resData && this.state.fileBase ? (
    /* outerPart-1 */    
    <>
        {/* if loader is false render "innerPart-1" else render "innerPart-2" */}
        {this.state.loader===false ? (
         /* innerPart-1 */   
         <>
        <div className="uploader-main">
            {/***************** Main card ******************/}
            <div className="container">
                        <IconButton 
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2, color:'white'}}>
                        <ArrowBackTwoToneIcon />
                        </IconButton>
            </div>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', borderLeft : '50px solid #10478A', borderTop: '50px solid #10478A',top:200 }}>
          
                    <Card sx={{ minWidth: 275,backgroundcolor: "#8b9fe76e", }}>
                        <CardContent
                        sx={{marginbottom: 1.5,
                            marginleft: 200,
                            display: "flex",
                            flexdirection: "column",
                            justifycontent: "center",
                            alignitems: "center",
                            borderradius: 8,
                            
                            maxwidth: 700,
                        }} >  
                         
                        
                           <label  className="drop-container" id="dropcontainer">
                          {/*   <IconButton type="file" 
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{ mr: 2, color:'black'}}>
                                    <CloudUploadIcon />
                            </IconButton> */} 
                                <span className="drop-title">Upload files here</span>
                                 or
                                 <input
                                    id="fileInput"
                                    type="file"
                                    multiple
                                    onChange={this.uploadFiles}
                                    className="inputfile"/> 
                            </label>
                        </CardContent>
                        <CardActions>
                                {/******* List of files chosen ******/}
                        <ul>
                            {this.state.uploadedFiles.map((file, index) => (
                                <li key={index}>
                                    {file.name}
                                <IconButton onClick={()=>this.deleteFiles(index)}
                                    size="large"
                                    edge="start"
                                    color="inherit"
                                    aria-label="menu"
                                    sx={{ mr: 2 }}>
                                    <DeleteForeverRoundedIcon />
                                </IconButton>
                                </li>))}
                        </ul> 
            
                         {/******* Extract the output from backend ******/}
                        <Button onClick={this.pushFilesToBackend}>Extract</Button> 

                        <Stack spacing={2} sx={{ width: '100%' }}>    
                        <Snackbar open={this.state.opened} autoHideDuration={6000} onClose={this.handleClose}>
                            <Alert onClose={this.handleClose} severity="error" sx={{ width: '100%' }}>
                                Please select ateast one file!
                            </Alert>
                         </Snackbar>
                        </Stack>  
                      
                        </CardActions>
                    </Card>
                </Box>
        </div>
        </>):
       
       /* innerPart-2 */
       (
        <Box sx={{ mt: 30 }}>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={5}
          >
          <img src={uploadGIF} alt="" style={{ width: "17rem" }} />
          </Grid>
        </Box>) }

        </>):
      
        /* outerPart-2 */    
        (
          <InvoiceForm images={this.state.fileBase} responsedata={this.state.resData} ></InvoiceForm> 
        

        )}
    </div>
)}}

export default FileUploader