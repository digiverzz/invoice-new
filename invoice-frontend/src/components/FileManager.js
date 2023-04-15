import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import { Container, Grid, TextField } from '@mui/material';
import AppsIcon from '@mui/icons-material/Apps';
import InputAdornment from '@mui/material/InputAdornment';
import { InsertDriveFileOutlined, PictureAsPdfOutlined, DescriptionOutlined, ImageOutlined } from '@mui/icons-material';
import DensitySmallIcon from '@mui/icons-material/DensitySmall';
import IconButton from '@mui/material/IconButton';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import { styled } from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';

import Nav from './reusable/navBar';

import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { makeStyles } from '@mui/styles';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { height } from '@mui/system';



const placeholders = ['Search for...', 'Find...', 'Explore...'];

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));

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
    backgroundColor: 'white',
    padding: '16px',
    borderRadius: '8px',
  },
  searchBarRoot: {
    borderRadius: '20px',
    backgroundColor: '#FFF',
  },
  searchBarOutline: {
    borderRadius: '20px',
    borderColor: '#FFF',
  },
  textField: {
    width: '100%',
  },
  list: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  listItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5px',
    width: '15%',
    boxSizing: 'border-box', '&:hover': {
      backgroundColor: '#E4E7EB',
      cursor: 'pointer',
    },
  },
  listItemSmall: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "50px",
    margin: "10px",
    padding: "5px",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "0.3s",
    "&:hover": {
      backgroundColor: "#f5f5f5",
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

const dataURLtoFile = (dataurl, filename) => {

  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

const previewFile = (filename, url) => {
  var files = dataURLtoFile(url, filename);
  // console.log(files)
  // var base64 = "data:"+type+";base64,"+dataBase64  ;
  var fileURL = URL.createObjectURL(files);
  window.open(fileURL);
}


const getExtension = (filename) => {
  const parts = filename.split('.');
  return parts[parts.length - 1];
}

const fileClick = (file) => {
  console.log(file['name'])
  previewFile(file['name'], file['dataurl'])
}


export default function FileManager() {

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [fileList, setfileList] = useState([]);
  const dataFetchedRef = useRef(false);

  const classes = useStyles();

  const searching = async (e) => {
    console.log(e.target.value)
    var temp = [];
    const response = await axios.post("http://127.0.0.1:5000/elastic/search", { "query": e.target.value, "username": localStorage.getItem('uid') })
    response.data.forEach((Source) => {
      temp.push({
        "name": Source['_source']['filename'],
        "date": Source['_source']['datetime'],
        "dataurl": Source['_source']['dataurl'],
        "size": Source['_source']['size']
      })
    })

    setfileList(temp)
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(intervalId);
  }, []);


  useEffect(() => {


    async function fetchData() {


      if (dataFetchedRef.current) return;
      dataFetchedRef.current = true;
      console.log("useeffect")
      try {
        const response = await axios.post("http://127.0.0.1:5000/elastic/getallfiles", { 'username': localStorage.getItem('uid') });
        console.log(response.data)
        response.data.forEach((Source) => {
          setfileList(fileList => [...fileList, {
            "name": Source['_source']['filename'],
            "date": Source['_source']['datetime'],
            "dataurl": Source['_source']['dataurl'],
            "size": Source['_source']['size']
          }])
        })

        console.log(fileList)
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);



  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <PictureAsPdfOutlined className={classes.pdf} sx={{ fontSize: "70%" }} />;
      case 'docx':
        return <DescriptionOutlined className={classes.docx} sx={{ fontSize: "70%" }} />;
      case 'jpg':
        return <ImageOutlined className={classes.jpg} sx={{ fontSize: "70%" }} />;
      case 'png':
        return <ImageOutlined className={classes.png} sx={{ fontSize: "70%" }} />;
      default:
        return <InsertDriveFileOutlined />;
    }
  }

  const [isLargeView, setIsLargeView] = useState(false);

  const handleToggleView = () => {
    setIsLargeView(!isLargeView);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const placeholder = placeholders[placeholderIndex];
  return (

    <Box
      position="fixed"
      top={0}
      height="100%"
      width="100%"
      sx={{ bgcolor: "#F9FAFB" }}
    >

      <Grid container spacing={2} sx={{ padding: "2%", justifyContent: "right", overflow: "scroll" }}>
        <Nav></Nav>
        <Grid container xs={10} sx={{ justifyContent: "center" }}>
          <Grid xs={8} paddingBottom={3} >
            <TextField
              onChange={searching}
              className={classes.textField}
              InputProps={{
                classes: {
                  root: classes.searchBarRoot,
                  notchedOutline: classes.searchBarOutline,
                },
                placeholder,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }} />
          </Grid>

          <Grid spacing={3} xs={12} className={classes.root} height={"80vh"} >

            <Grid container xs={12} sx={{justifyContent:"right"}}>
              <IconButton size="large" onClick={handleToggleView} sx={{ color: "black", ":hover": { background: "#6b7682" } }}>
                {isLargeView? <AppsIcon />: <DensitySmallIcon/>}
              </IconButton>
            </Grid>
            <List className={classes.list}>
              {fileList.map((file) => (<HtmlTooltip
                title={
                  <React.Fragment>
                    <p>name: {file.name}<br></br>
                      status: {file.name}<br></br>
                      size: {file.size} bytes<br></br>
                      Date Uploaded: {file.date}</p>
                  </React.Fragment>
                }
              >

                <ListItem key={file.name} className={`${classes.listItem} ${isLargeView ? classes.listItemSmall : ""
                  }`} onClick={() => { fileClick(file) }} >
                  <ListItemIcon className={classes.icon} >
                    {getFileIcon(getExtension(file.name))}
                  </ListItemIcon>
                  <ListItemText primary={file.name.length > 10 ? file.name.substring(0, 10) + "..." : file.name} sx={{ boxSizing: "20px" }} size="small" />
                </ListItem>

              </HtmlTooltip>
              ))}
            </List>
          </Grid>
        </Grid>
      </Grid>




      {/* <Box sx={{height:"10%"}}>
      <Skeleton variant="rectangular" height="100%" />
      </Box> */}

    </Box>
  )
}
