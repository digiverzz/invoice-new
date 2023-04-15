import React from 'react'
import { useState } from "react";
import { Button } from '@mui/material';
import UploadFileStyles from '../components/UploadFileStyles.css'
import URI from "../utils/request";
import FileUpload from "react-mui-fileuploader"
import NavigateNextTwoToneIcon from '@mui/icons-material/NavigateNextTwoTone';
import Grid  from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { UploadFile } from '@mui/icons-material';
import axios, * as others from "axios";
import {Buffer} from 'buffer';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import InvoiceData from './InvoiceData';
import { Link, useNavigate } from "react-router-dom";
import loader from "../images/loader.gif"


export default function UploadFileComp() {
  const navigate = useNavigate();
  const [spinner, setSpinner] = useState(false);    
  const [files, setFiles] = useState([]);
  const [errorUpload,setErrorUpload] = useState(false);
  const [resData,setResData] = useState();
  const [fileBase,setfilesBase] = useState([])
  const handleFilesChange = async (files) => {
    var tempfiles2 = []
    // Update chosen files
    setFiles([ ...files ])
    console.log("files",files)
    
   for (var i = 0; i < files.length; i++){
    var format = {
      name: '',
      data: ''
   }
     format['name'] = files[i].name
     format['data'] = files[i].path
     tempfiles2.push(format)
   }
   setfilesBase([...tempfiles2])
  };
  const handleFileUploadError = (err) => {
    setErrorUpload(true)
  }

  const uploadFiles = async () => {
    // Create a form and post it to server
    console.log("files input formdata",files.length)
    var tempfiles = fileBase
    
    console.log("filebase",tempfiles)
    setSpinner(true)
    try{
      const tempres = await axios.post(URI+"predict",tempfiles,{
        headers: {
          'content-Type': 'application/json'
        }
      })
        .then((response) => {
           let data = response.data.response
           console.log("response",data)
           setResData(data)
           setSpinner(false)
        })
        
    }
      catch{
        console.error("error");
      };
      
     
      
  }

  return (
    <div>
      {
        !resData  && fileBase?(
          <>
          {spinner === false ? (
            <Box>
            <Grid container
        direction="row"
        justifyContent="center"
        alignItems="center"  spacing={3}>
                <Grid item xs={10}>
                <FileUpload
          getBase64={true}
          multiFile={true}
          disabled={false}
          title="Upload only image or PDF"
          header="Drag to drop"
          rightLabel=''
          buttonLabel="Click to Upload"
          buttonRemoveLabel="Remove all"
          maxFileSize={10}
          maxUploadFiles={0}
          maxFilesContainerHeight={457}
          acceptedType={'image/*'}
          errorSizeMessage={'fill it or remove it to use the default error message'}
          allowedExtensions={['jpg', 'jpeg','png','pdf']}
          onFilesChange={handleFilesChange}
          onError={handleFileUploadError}
          imageSrc={'path/to/custom/image'}
          BannerProps={{ elevation: 0, variant: "outlined",sx: {backgroundColor: '#0d6efd'}}}
          showPlaceholderImage={false}
          PlaceholderGridProps={{ md: 4 }}
          LabelsGridProps={{ md: 8 }}
          onContextReady={context => {
            // access to component context here
          }}
          ContainerProps={{
            elevation: 0,
            variant: "outlined",
            sx: { width:700,p: 10 ,color: 'primary',marginTop:10,marginLeft:25,backgroundColor:"#F6F1F1",border: '2px dashed grey' },
            
          }}
        />
                </Grid>
                <Grid item xs={3} >
        <Button variant="outlined" onClick={()=>{uploadFiles()}}>Extract<NavigateNextTwoToneIcon /></Button>
        </Grid> 
            </Grid>
      </Box>
              ) : (
                <Box sx={{ mt:30 }}>
                  <Grid container
        direction="row"
        justifyContent="center"
        alignItems="center" spacing={5}>
                <img src={loader} alt="" style={{width:"17rem"}}/></Grid>
              </Box>
              )}
              
              </>
        ): (<InvoiceData images={fileBase} responsedata={resData}/>)
      }
    </div>
    
  )
}
