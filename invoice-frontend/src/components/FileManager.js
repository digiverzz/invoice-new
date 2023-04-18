import React, { useEffect, useState, useRef } from 'react';

import Button from '@mui/material/Button';
import axios from 'axios';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import SearchIcon from '@mui/icons-material/Search';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Container, Grid, TextField } from '@mui/material';
import { MoreVert, Padding } from '@mui/icons-material';
import { Card, CardContent, CardMedia, Checkbox } from '@mui/material';
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
import { fontGrid } from '@mui/material/styles/cssUtils';
import URI from "../utils/request";


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
    const response = await axios.post(URI+"elastic/search", { "query": e.target.value, "username": localStorage.getItem('uid') })
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

  async function fetchData() {

    console.log("fetching data")
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    console.log("useeffect")
    try {
      const response = await axios.post(URI+"elastic/getallfiles", { 'username': localStorage.getItem('uid') });
      console.log(response.data)
      response.data.forEach((Source) => {
        setfileList(fileList => [...fileList, {
          "name": Source['_source']['filename'],
          "date": Source['_source']['datetime'],
          "dataurl": Source['_source']['dataurl'],
          "size": Source['_source']['size'],
          "status": Source['_source']['status']
        }])
      })

      console.log(fileList)
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(intervalId);
  }, []);


  useEffect(() => {
    fetchData();
  }, [fileList]);



  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <PictureAsPdfOutlined className={classes.pdf} sx={{ fontSize: 25 }} />;
      case 'docx':
        return <DescriptionOutlined className={classes.docx} sx={{ fontSize: 25 }} />;
      case 'jpg':
        return <ImageOutlined className={classes.jpg} sx={{ fontSize: 25 }} />;
      case 'png':
        return <ImageOutlined className={classes.png} sx={{ fontSize: 25 }} />;
      default:
        return <InsertDriveFileOutlined />;
    }
  }

  const [isLargeView, setIsLargeView] = useState(false);

  const handleToggleView = () => {
    setIsLargeView(!isLargeView);
  };

  const [anchorElsort, setAnchorElsort] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [currentName, setCurrentName] = React.useState(null);
  const open = Boolean(anchorEl);
  const opensort = Boolean(anchorElsort);
  const [seed, setSeed] = useState(1);
  const [field, setfield] = useState('Name');
  const [order, setorder] = useState('asc');
  const [isdesc, setisdesc] = useState(false);
  const handleClick = (event, name) => {
    setAnchorEl(event.currentTarget);
    setCurrentName(name)
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClicksort = (event, name) => {
    setAnchorElsort(event.currentTarget);
    // setCurrentName(name)
  };
  const handleClosesort = () => {
    setAnchorElsort(null);
  };


  const handleDelete = async () => {
    console.log(currentName)


    const response = await axios.post(URI+"elastic/delete", { "filename": currentName, "username": localStorage.getItem('uid') })
    await fetchData();
    setSeed(Math.random())
    setAnchorEl(null);
    
    window.location.reload(false);

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

      <Grid container spacing={2} xs={12} sx={{ padding: "2%", paddingRight: 0, justifyContent: "right" }}>
        <Nav></Nav>
        <Grid container xs={10} sx={{ justifyContent: "center" }}>
          <Grid container xs={12} paddingBottom={3} sx={{ justifyContent: "center" }} >
            <Grid xs={8}>
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
            {/* <Grid container p={1} xs={2} sx={{ justifyContent: "right" }}>
              <Box pt={0.5}>      
              <Button
                id="sort-button"
                aria-controls={opensort ? 'sort-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={opensort ? 'true' : undefined}
                onClick={handleClicksort}
              >
                {field}
              </Button>
              </Box>
              <Box >
                <IconButton>
                  <ArrowUpwardIcon />
                </IconButton>
              </Box>

            </Grid> */}
          </Grid>

          <Box sx={{
            p: 3, overflow: "auto", borderRadius: 3, width: "100%", height: "80vh", bgcolor: "white",

            '&::-webkit-scrollbar': {
              width: '0.5em',
            },
            '&::-webkit-scrollbar-track': {
              boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
              webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,.1)',
              outline: '0px solid slategrey'
            }
          }}>

            <Grid container xs={12} sx={{ justifyContent: "right" }}>
              <Grid xs={12} sx={{ width: "100%",boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px" }} bgcolor={"white"} >

                {/* <IconButton size="large" onClick={handleToggleView} sx={{ color: "black", ":hover": { background: "#6b7682" } }}>
                  {isLargeView ? <AppsIcon color='action' /> : <DensitySmallIcon color='action' />}
                </IconButton> */}
              </Grid>
              <Grid container xs={12} sx={{ p: 1 }}>

                {fileList.map((file, index) => (<HtmlTooltip
                  title={
                    <React.Fragment>
                      <p>name: {file.name}<br></br>
                        status: {file.status}<br></br>
                        size: {file.size} bytes<br></br>
                        Date Uploaded: {file.date}</p>
                    </React.Fragment>
                  }
                >
                  <Box spacing={3} sx={{ p: 2 }}  >
                    <Card

                      sx={{ pb: 2, background: "#F9FAFB", border: '1px ', width: 200, height: 200, borderRadius: '8px', '&:hover': { boxShadow: '0px 0px 8px 2px grey' } }}

                    >
                      <CardContent sx={{ p: 1, display: "flex", justifyContent: "left" }}>
                        <Box pr={1}>
                          {getFileIcon(getExtension(file.name))}

                        </Box>
                        <Box flexGrow={1}>
                          <Typography variant='small' sx={{ fontSize: 12 }}>{file.name}</Typography>
                        </Box>
                        <Box>

                          <IconButton
                            id="basic-button"
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={(e) => handleClick(e, file.name)}>
                            <MoreVert sx={{ fontSize: 15 }} />
                          </IconButton>


                        </Box>
                      </CardContent>

                      <Box sx={{ borderRadius: 5, paddingLeft: 1, paddingRight: 1, justifyContent: "center", bgcolor: "#F9FAFB" }}>
                        <CardMedia

                          onClick={() => { fileClick(file) }} component="img" image={file.dataurl} sx={{ height: 140, width: 180 }} />
                      </Box></Card>
                  </Box>



                  {/* <ListItem key={file.name} className={`${classes.listItem} ${isLargeView ? classes.listItemSmall : ""
                  }`} onClick={() => { fileClick(file) }} >
                  <ListItemIcon className={classes.icon} >
                    {getFileIcon(getExtension(file.name))}
                  </ListItemIcon>
                  <ListItemText primary={file.name.length > 10 ? file.name.substring(0, 10) + "..." : file.name} sx={{ boxSizing: "20px" }} size="small" />
                </ListItem> */}

                </HtmlTooltip>
                ))}


              </Grid>

            </Grid>
          </Box>
        </Grid>
      </Grid>


      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      ><Box>

          <MenuItem onClick={handleDelete}>
            <Box flexGrow={1}>
              <DeleteOutlineIcon color="action" sx={{ fontSize: 20 }} />
            </Box></MenuItem>
        </Box>
      </Menu>

      <Menu
        id="sort-menu"
        anchorEl={anchorElsort}
        open={opensort}
        onClose={handleClosesort}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClosesort}>Profile</MenuItem>
        <MenuItem onClick={handleClosesort}>My account</MenuItem>
        <MenuItem onClick={handleClosesort}>Logout</MenuItem>
      </Menu>



      {/* <Box sx={{height:"10%"}}>
      <Skeleton variant="rectangular" height="100%" />
      </Box> */}

    </Box>
  )
}
