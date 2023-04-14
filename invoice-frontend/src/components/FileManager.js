import React from 'react';

import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import { Container, Grid, Box, TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import {  InsertDriveFileOutlined, PictureAsPdfOutlined, DescriptionOutlined, ImageOutlined} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import { makeStyles } from '@mui/styles';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';


const fileList = [
  { name: 'file1.pdf', type: 'pdf' },
  { name: 'file2.jpg', type: 'jpg' },
  { name: 'file3.docx', type: 'docx' },
  { name: 'file4.png', type: 'png' },
  { name: 'file3.docx', type: 'docx' },
  { name: 'file4.png', type: 'png' },
  { name: 'file4.png', type: 'png' },
  { name: 'file3.docx', type: 'docx' },
  { name: 'file4.png', type: 'png' },
  { name: 'file4.png', type: 'png' },
];


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


const getExtension = (filename) => {
  const parts = filename.split('.');
  return parts[parts.length - 1];
}


export default function FileManager() {

  const classes = useStyles();

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
          <ListItem key={file.name} className={classes.listItem}>
            <ListItemIcon className={classes.icon}>
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
