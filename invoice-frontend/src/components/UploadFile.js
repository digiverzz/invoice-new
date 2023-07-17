import React from "react";
import { useState } from "react";
import { Button } from "@mui/material";
import UploadFileStyles from "../components/UploadFileStyles.css";
import URI from "../utils/request";
import NavigateNextTwoToneIcon from "@mui/icons-material/NavigateNextTwoTone";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { UploadFile } from "@mui/icons-material";
import axios, * as others from "axios";
import { Buffer } from "buffer";
import PropTypes from "prop-types";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import InvoiceData from "./InvoiceData";
import { Link, useNavigate } from "react-router-dom";
import loader from "../images/loader.gif";
import FileUpload from "react-material-file-upload";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function UploadFileComp() {
  const navigate = useNavigate();
  const [spinner, setSpinner] = useState(false);
  const [files, setFiles] = useState([]);
  const [errorUpload, setErrorUpload] = useState(false);
  const [resData, setResData] = useState();
  const [fileBase, setfilesBase] = useState([]);
  const [extension,setExtension] = useState([]);


  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };
  
  const base64toBlob = (data) => {
    // Cut the prefix `data:application/pdf;base64` from the raw base 64
    const base64WithoutPrefix = data.substr('data:application/pdf;base64,'.length);

    const bytes = atob(base64WithoutPrefix);
    let length = bytes.length;
    let out = new Uint8Array(length);

    while (length--) {
        out[length] = bytes.charCodeAt(length);
    }

    return new Blob([out], { type: 'application/pdf' });
};


  const uploadFiles = async () => {
    
    setSpinner(true);
    const tempfiles = [];
    // setfilesBase([...tempfiles2]);

    console.log("files input formdata", files.length);
    // var tempfiles = [];
    const dataUrls = [];
    const FileName = [];
    const FileSize = [];
    files.forEach(async (item) => {
      
      const reader = new FileReader();
      reader.onload = (event) => {
        
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
        if (dataUrls.length === files.length) {
          // All files have been converted to data URLs
          // axios.post("http://127.0.0.1:5000/elastic/upload",{"filename":FileName,"dataurl":dataUrls,"size":FileSize,"username":"emp001","status":"pending"})
          console.log(tempfiles.length)
          axios
          .post(URI + "predict", {"data":tempfiles}, {
            headers: {
              "content-Type": "application/json",
            },
          })
          .then((response) => {
            let data = response.data.response;
            console.log("response", data);
            setResData(data);
            setSpinner(false);
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
              setFiles([])
              setSpinner(false)
              
              navigate("/uploadfile")
          })

          setfilesBase([...tempfiles])
          console.log(FileName);
          // navigate('/');
        }
      };
      reader.readAsDataURL(item);
    });
      // const elastic = await axios.post(URI+"elastic/upload",{"filename":FileName,"dataurl":dataUrls,"size":FileSize,"username":localStorage.getItem("uid"),"status":"pending"},{
      //   headers: {
      //     'content-Type': 'application/json'
      //   }
      // })
      // console.log(elastic)


  };

  return (
    <div>
      {!resData && fileBase ? (
        <>
          {spinner === false ? (
            <Box sx={{
              marginTop:15

            }}>
              <Grid
                container
                spacing={5}
                direction="column"
                alignItems="center"
                justifyContent="center"

              >
                <Grid item xs={10}>
                <ToastContainer
position="top-right"
autoClose={2000}
hideProgressBar
newestOnTop
closeOnClick
rtl={false}
draggable
theme="colored"
/>
                  <FileUpload value={files} onChange={setFiles} sx={{width:500,height:250,backgroundColor:"#edf2f7",
                    borderStyle: "dashed",
                    borderColor: "#cbd5e0",
                    borderWidth: 1,
                }}/>
                </Grid>
                <Grid item xs={3} sx={{
              marginLeft:1

            }}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      uploadFiles();
                    }}
                    sx={ { borderRadius: 28,backgroundColor:"#ff0000" } }
                    disabled={files.length<=0}
                  >
                    Extract
                    <NavigateNextTwoToneIcon />
                  </Button>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Box sx={{ mt: 30 }}>
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={5}
              >
                <img src={loader} alt="" style={{ width: "17rem" }} />
              </Grid>
            </Box>
          )}
        </>
      ) : (
        <InvoiceData images={fileBase} responsedata={resData} />
      )}
    </div>
  );
}
