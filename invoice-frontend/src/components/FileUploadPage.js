import React ,{ useState} from 'react';
import './FileUploadPage.css'; // Import custom CSS file
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DragAndDropFileInput from './DragAndDropFileInput';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import Alert from '@mui/material/Alert';
import { Stack } from '@mui/material';
import { Snackbar } from '@material-ui/core';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import { Box } from '@mui/material';
import {  PictureAsPdf, Image } from '@mui/icons-material';
import URI from "../utils/request";
import { toast, ToastContainer } from 'react-toastify';
import InvoiceForm from "./invoiceForm.js";
import uploadGIF from "../images/loader.gif";
import axios, * as others from "axios";
import InvoiceData from './InvoiceData';

export default class FileUploadPage extends React.Component
{      
    constructor(props){
        super(props)

        this.state={
           opened:false,
           uploadedFiles:[],
           resData:undefined,
           loader:false,
           fileBase:[]
        }
     }
    
    handleClose=()=>{
        this.setState({
            opened:false
         })
    }
 
    uploadFiles=(file)=>{

        const newFiles = file;
        console.log(newFiles);        
        this.setState((prevState) => ({ uploadedFiles: [...prevState.uploadedFiles, ...newFiles] }));
       
        console.log(this.state.uploadedFiles)
     }
    // File upload icon selection
    getFileIcon = (fileType) => {
        switch (fileType) {
          case 'image/jpeg':
          case 'image/png':
          case 'image/jpg':
            return <Image />;
          case 'application/pdf':
            return <PictureAsPdf  />;
          default:
            return <FilePresentIcon />;
        }
      };

      handleClose=()=>{
        this.setState({
            opened:false
         })
    }
    //uploaded file deletion
     deleteFiles=(index)=>{
        const updatedFiles=[...this.state.uploadedFiles]
        updatedFiles.splice(index,1)
        console.log("locally updated"+updatedFiles)
        this.setState({
            uploadedFiles:updatedFiles
        }) 
        }
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
                      console.log(response.message)
                      let data = response.data.response;
                      console.log("response", data);
                      
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
     
    
    
render(){  
return (
    <div className="main">
        {/* if !resData and fileBase are empty render outerPart-1 else outerPart-2 */}    
        {!this.state.resData && this.state.fileBase ? (
        /* outerPart-1 */    
        <>
        {/* if loader is false render "innerPart-1" else render "innerPart-2" */}
        {this.state.loader===false ? (
        <>
        {/*  innerPart-1  */}  
         <div className='uploadpage'>

                <div className='navbar'>
                        <IconButton 
                            size="large"
                            edge="start"
                            color="primary"
                            variant="contained"
                            aria-label="menu"

                            sx={{ ml: 2, bgcolor:'whitesmoke'}}>

                        <ArrowBackIcon />

                        </IconButton>
                </div> 
                <div className='form'>
                    <div className='wborder'>
                      <br></br>
                    <div className="title">Upload</div>
                        <div className="file-card">
                            <div className="file-inputs">
                            {/* // drag and drop */}
                            <Grid container>
                            <Grid item >
                                <DragAndDropFileInput onFileSelected={this.uploadFiles} /> 
                            </Grid>
                            </Grid>                             
                            </div>
                        </div>
                        {/* list the user uploaded files */}

                     <List style={{ padding:'0px 25%', }} >
                            {this.state.uploadedFiles.map((file, index) => (
                    <ListItem
                  
                             key={index}
                            style={{ backgroundColor: '#b9d7f03b',borderRadius:'8px',margin :'0.5em' }}>
                  <ListItemAvatar>
                    <Avatar sx={{ color:'#1e88e5',bgcolor: 'white'}}>
                        {this.getFileIcon(file.type)}
                    </Avatar>
                   </ListItemAvatar>
                         <ListItemText  primary={file.name} primaryTypographyProps={{ align: 'center' }} />
                             
                  <IconButton edge="end" aria-label="delete" onClick={()=>this.deleteFiles(index)}>
                            <DeleteRoundedIcon />
                </IconButton>
                </ListItem>
                  ))}
                        </List>
                    {/*  Extract  button */}
                    <Button variant="contained"
                                color="primary" 
                                size="medium" 
                               style={{width:'70%',color: 'white',
                                      marginbotttom:'5px',

                               }}
                                 onClick={this.pushFilesToBackend}
                    >Extract</Button>


                    

                        <Stack spacing={2} sx={{ width: '100%' }}>
                            
                            <Snackbar open={this.state.opened} autoHideDuration={6000} onClose={this.handleClose}>
                                <Alert onClose={this.handleClose} severity="error" sx={{ width: '100%' }}>
                                    Please select ateast one file!
                                </Alert>
                             </Snackbar>
                            </Stack>  

            </div>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            </div>
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
        </Box>)}

        </>):
      
        /* outerPart-2 */    
        (
            <InvoiceForm images={this.state.fileBase} responsedata={this.state.resData} ></InvoiceForm>
        )}
        
    
    </div>
  );
}}
