import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { Container, Grid, Box, TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import {  InsertDriveFileOutlined, PictureAsPdfOutlined, DescriptionOutlined, ImageOutlined} from '@mui/icons-material';



import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { makeStyles } from '@mui/styles';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';





// const useStyles = makeStyles(() => ({
//   root: {
//     backgroundColor: '#F9FAFB',
//     padding: '16px',
//     borderRadius: '8px',
//   },
//   list: {
//     display: 'flex',
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   listItem: {
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//     border: '1px solid #E4E7EB',
//     borderRadius: '8px',
//     margin: '8px',
//     padding: '16px',
//     width: '20%',
//     boxSizing: 'border-box',
//   },
//   icon: {
//     fontSize: '72px',
//     marginBottom: '8px',
//   },
//   pdf: {
//     color: '#FF5722',
//   },
//   docx: {
//     color: '#2196F3',
//   },
//   jpg: {
//     color: '#F44336',
//   },
//   png: {
//     color: '#4CAF50',
//   },
// }));

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: '#F9FAFB',
    padding: '16px',
    borderRadius: '8px',
  },  
  searchBarRoot: {
    borderRadius: '20px',
    backgroundColor: '#FFF',
  },
  searchBarOutline: {
    borderRadius: '20px',
    borderColor: '#CCC',
  },
  textField: {
    width: '50%',
  },
  list: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'left',
  },
  listItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #E4E7EB',
    borderRadius: '8px',
    margin: '8px',
    padding: '16px',
    width: '15%',
    boxSizing: 'border-box',    '&:hover': {
      backgroundColor: '#E4E7EB',
      cursor: 'pointer',
    },
  },
  icon: {
    fontSize: '72px',
    marginBottom: '8px',
  },
  pdf: {
    color: '#FF5722',
  },
  docx: {
    color: '#2196F3',
  },
  jpg: {
    color: '#F44336',
  },
  png: {
    color: '#4CAF50',
  },
}));

const dataURLtoFile = (dataurl, filename) =>{
 
  var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), 
      n = bstr.length, 
      u8arr = new Uint8Array(n);
      
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, {type:mime});
}

const previewFile = (filename,url)=> {
  var files = dataURLtoFile(url,filename);
  // console.log(files)
  // var base64 = "data:"+type+";base64,"+dataBase64  ;
  var fileURL = URL.createObjectURL(files);
  window.open(fileURL);
}


const getExtension = (filename) => {
  const parts = filename.split('.');
  return parts[parts.length - 1];
}

const fileClick = (file) =>{
  console.log(file['name'])
  previewFile(file['name'],file['dataurl'])
}


export default function FileManager() {
  const [fileList, setfileList] = useState([]);
  const dataFetchedRef = useRef(false);
  
  const classes = useStyles();

  const searching = async (e)=>{
    console.log(e.target.value)
    var temp = [];
    const response = await axios.post("http://127.0.0.1:5000/elastic/search",{"query":e.target.value,"username":localStorage.getItem('uid')})
    response.data.forEach((Source)=>{
      temp.push({"name":Source['_source']['filename'],
                  "date":Source['_source']['datetime'],
                  "dataurl":Source['_source']['dataurl'],
                "size":Source['_source']['size']})
    })

    setfileList(temp)
}


  useEffect(() => {
    async function fetchData() {

      
      if (dataFetchedRef.current) return;
      dataFetchedRef.current = true;
      console.log("useeffect")
      try {
        const response = await axios.post("http://127.0.0.1:5000/elastic/getallfiles",{'username':localStorage.getItem('uid')});
        console.log(response.data)
        response.data.forEach((Source)=>{
          setfileList(fileList =>[...fileList,{"name":Source['_source']['filename'],
                      "date":Source['_source']['datetime'],
                      "dataurl":Source['_source']['dataurl'],
                    "size":Source['_source']['size']}])
        })

        console.log(fileList)
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);



  const getFileIcon = (type) => {
    switch(type) {
      case 'pdf':
        return <PictureAsPdfOutlined className={classes.pdf} sx={{fontSize:"60%"}}/>;
      case 'docx':
        return <DescriptionOutlined className={classes.docx} sx={{fontSize:"60%"}}/>;
      case 'jpg':
        return <ImageOutlined className={classes.jpg} sx={{fontSize:"60%"}}/>;
      case 'png':
        return <ImageOutlined className={classes.png} sx={{fontSize:"60%"}}/>;
      default:
        return <InsertDriveFileOutlined />;
    }
  }


  return (

    <Box
      position="fixed"
      top={0}
      height="100%"
      width="100%"
      sx={{ bgcolor: "#F6F1F1" }}
    >
      <Grid container spacing={2} sx={{  padding: "3%", justifyContent: "center" }} >
        <TextField label="search"
        onChange={searching}
        className={classes.textField}
          InputProps={{
            classes: {
              root: classes.searchBarRoot,
              notchedOutline: classes.searchBarOutline,
            },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}  />
      </Grid>

      <Container className={classes.root}>
      <List className={classes.list}>
        {fileList.map((file) => (
          <ListItem key={file.name} className={classes.listItem} onClick={()=>{fileClick(file)}}>
            <ListItemIcon className={classes.icon} >
              {getFileIcon(getExtension(file.name))}
            </ListItemIcon>
            <ListItemText primary={file.name} />
          </ListItem>
        ))}
      </List>
    </Container>
    </Box>
  )
}
