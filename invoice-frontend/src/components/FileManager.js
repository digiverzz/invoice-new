import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import DoneIcon from "@mui/icons-material/Done";

import loader from "../images/loader.gif";
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import { green } from "@mui/material/colors";
import CheckIcon from "@mui/icons-material/Check";
import BlockIcon from "@mui/icons-material/Block";
import SearchIcon from "@mui/icons-material/Search";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Avatar, Grid, ListItemButton, TextField } from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import { Card, CardContent, CardMedia } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import {
  InsertDriveFileOutlined,
  PictureAsPdfOutlined,
  DescriptionOutlined,
  ImageOutlined,
} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Nav from "./reusable/navBar";
import TuneIcon from "@mui/icons-material/Tune";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { makeStyles } from "@mui/styles";
import URI from "../utils/request";

import CircularProgress from "@mui/material/CircularProgress";
import InvoiceData from "./InvoiceData";

const placeholders = ["Search for...", "Find...", "Explore..."];

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: "white",
    padding: "16px",
    borderRadius: "8px",
  },
  searchBarRoot: {
    borderRadius: "20px",
    backgroundColor: "#FFF",
  },
  searchBarOutline: {
    borderRadius: "20px",
    borderColor: "#FFF",
  },
  textField: {
    width: "100%",
  },
  list: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  listItem: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "5px",
    width: "15%",
    boxSizing: "border-box",
    "&:hover": {
      backgroundColor: "#E4E7EB",
      cursor: "pointer",
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
    fontSize: "72px",
    marginBottom: "8px",
  },
  pdf: {
    color: "#FF5722",
  },
  docx: {
    color: "#2196F3",
  },
  jpg: {
    color: "#F44336",
  },
  png: {
    color: "#4CAF50",
  },
}));

const dataURLtoFile = (dataurl, filename) => {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};

const previewFile = (filename, url) => {
  var files = dataURLtoFile(url, filename);
  // console.log(files)
  // var base64 = "data:"+type+";base64,"+dataBase64  ;
  var fileURL = URL.createObjectURL(files);
  window.open(fileURL);
};

const getExtension = (filename) => {
  const parts = filename.split(".");
  return parts[parts.length - 1];
};

const fileClick = (file) => {
/*   console.log(file["name"]); */
  previewFile(file["name"], file["dataurl"]);
};

export default function FileManager() {
  const [istotalloading, setistotalloading] = useState(false);
  const [fieldName, setfieldName] = useState([
    "name",
    "size",
    "date",
    "status",
  ]);

  const mapping = {
    name: "filename",
    size: "size",
    date: "datetime",
    status: "status",
  };

  const [anchorElsort, setAnchorElsort] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElupload, setAnchorElupload] = React.useState(null);
  const [currentName, setCurrentName] = React.useState(null);
  const open = Boolean(anchorEl);
  const opensort = Boolean(anchorElsort);

  const openupload = Boolean(anchorElupload);
  const [loading, setloading] = useState(true);
  const [currentfield, setcurrentfield] = useState(fieldName[0]);
  const [isdesc, setisdesc] = useState(false);

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [fileList, setfileList] = useState([]);
  const dataFetchedRef = useRef(false);
  const [uploadedFile, setuploadedFile] = useState([]);
  const [resData, setResdata] = useState([]);
  const [selectedfile, setSelectedfile] = useState();
  const [fileBase, setFilebase] = useState([]);

  const buttonSx = {
    ...(true && {
      bgcolor: green[500],
      "&:hover": {
        bgcolor: green[700],
      },
    }),
  };

  const classes = useStyles();

  const StreamingFileUpload = async (request) => {
    const response = await fetch(URI + "elastic/streamupload", {
      method: "POST",
      body: JSON.stringify(request),
    });
    // const response = await axios.get('http://localhost:8000/streamjson')
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    reader.read().then(function processResult(result) {
      /* console.log(result); */
      if (result.done) {
        return;
      }
      const text = decoder.decode(result.value, { stream: true });
      const data = JSON.parse(text);
      // setData(prevData => [...prevData, JSON.parse(text)]);
      // need to handle storage exceeds
      setuploadedFile((uploadedFile) =>
        uploadedFile.map((item) => {
          if (item.name == data["filename"]) {
            var temp = item;
            temp["status"] = "done";
/* 
            console.log("status updated...", temp); */
            return temp;
          }
          return item;
        })
      );

      return reader.read().then(processResult);
    });
  };

  const handleCloseupload = () => {
    setAnchorElupload(null);
    fetchData();
    setuploadedFile([]);
  };

  const handleApprove = async () => {

    setAnchorEl(false);
    const response = await axios.post(URI + 'statusupdate', { "filename": currentName, "uid": localStorage.getItem('uid'), "status": "accepted" })

  };

  const handleReject = async () => {

    setAnchorEl(false);

    const response = await axios.post(URI + 'statusupdate', { "filename": currentName, "uid": localStorage.getItem('uid'), "status": "rejected" })

  };

  const handleupload = (e) => {
    setAnchorElupload(e.currentTarget);
  };

  const sort = () => {
    // setloading(true)
    setTimeout(() => { }, 300);
 /*    console.log("sorting...", currentfield, isdesc); */
    const changer = isdesc ? -1 : 1;

    setfileList(
      fileList.sort((a, b) => {
        if (a[currentfield] > b[currentfield]) {
          return 1 * changer;
        } else if (a[currentfield] < b[currentfield]) {
          return -1 * changer;
        } else {
          return 0;
        }
      })
    );
    // setloading(false)
  };

  const searching = async (e) => {
  /*   console.log(e.target.value); */
    setloading(true)
    var temp = [];
    const response = await axios.post(URI + "elastic/search", {
      query: e.target.value,
      username: localStorage.getItem("uid"),
    });
    response.data.forEach((Source) => {
      temp.push({
        name: Source["_source"]["filename"],
        date: Source["_source"]["datetime"],
        dataurl: Source["_source"]["dataurl"],
        size: Source["_source"]["size"],
      });
    });
    setloading(false)
    setfileList(temp);
  };

  async function fetchData() {
   /*  console.log("inside fetchData"); */
    setloading(true);
    try {
      const response = await axios.post(
        URI + "elastic/getallfiles",
        { username: localStorage.getItem("uid") },
        {
          headers: {
            "content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      const temp = [];
      response.data.forEach((Source) => {
        temp.push({
          name: Source["_source"]["filename"],
          date: Source["_source"]["datetime"],
          dataurl: Source["_source"]["dataurl"],
          size: Source["_source"]["size"],
          status: Source["_source"]["status"],
        });
      });

      setfileList((fileList) => temp);

      setloading(false);

      // console.log("setted false")
    } catch (error) {
   /*    console.error(error); */
    }
  }
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    fetchData();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
 
    sort();
  }, [currentfield, isdesc]);

  useEffect(() => {
    if (uploadedFile.length > 0) {
     /*  console.log("change in uploaded file", uploadedFile); */
      fetchData();
    }
  }, [uploadedFile]);

  const getFileIcon = (type) => {
    switch (type) {
      case "pdf":
        return (
          <PictureAsPdfOutlined className={classes.pdf} sx={{ fontSize: 25 }} />
        );
      case "docx":
        return (
          <DescriptionOutlined className={classes.docx} sx={{ fontSize: 25 }} />
        );
      case "jpg":
        return <ImageOutlined className={classes.jpg} sx={{ fontSize: 25 }} />;
      case "png":
        return <ImageOutlined className={classes.png} sx={{ fontSize: 25 }} />;
      default:
        return <InsertDriveFileOutlined />;
    }
  };

  const [isLargeView, setIsLargeView] = useState(false);

  const handleToggleView = () => {
    setIsLargeView(!isLargeView);
  };
  const handleClick = (event, name) => {
    setAnchorEl(event.currentTarget);
    setCurrentName(name);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOrder = () => {
    setisdesc(!isdesc);
  };

  const handleuploadmul = (e) => {
   /*  console.log(e.target.files); */
    const files = Array.from(e.target.files);
    const filesasdict = [];
    const dataUrls = [];
    const FileName = [];
    const FileSize = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        filesasdict.push({
          name: file.name,
          size: file.size,
          url: event.target.result,
          status: "pending",
        });
        dataUrls.push(event.target.result);
        FileName.push(file.name);
        FileSize.push(file.size);
        if (dataUrls.length === files.length) {
          // All files have been converted to data URLs
          StreamingFileUpload({
            filename: FileName,
            dataurl: dataUrls,
            size: FileSize,
            username: "emp001",
            status: "pending",
          });
          // axios.post("http://127.0.0.1:5000/elastic/upload",{"filename":FileName,"dataurl":dataUrls,"size":FileSize,"username":"emp001","status":"pending"})
          setuploadedFile(filesasdict);
         /*  console.log(FileName); */
          // navigate('/dashboard');
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleClicksort = (event, name) => {
    setAnchorElsort(event.currentTarget);
    // setCurrentName(name)
  };
  const handleClosesort = async (fname, index) => {
   /*  console.log("sorting...."); */
    setfieldName((fieldName) => {
      var temp = fieldName;
      temp[index] = temp[0];
      temp[0] = fname;
      return temp;
    });
    setcurrentfield(fname);
    setAnchorElsort(null);
  };

  const handleClaim = async () => {
    // settotloading(true)
    setAnchorEl(false);
    setistotalloading(true)


    var tempfiles = [];

    var format = {
      name: "",
      data: "",
    };
    format["name"] = selectedfile.name;
    format["data"] = selectedfile.dataurl;
    tempfiles.push(format);
    axios
      .post(URI + "predict", {"data":tempfiles}, {
        headers: {
          "content-Type": "application/json",
        },
      })
      .then((response) => {
        let data = response.data.response;
        setResdata(data);
        // console.log("response", data);
        setistotalloading(false)
      });
    setFilebase([...tempfiles]);
  };

  const handleDelete = async () => {
    setAnchorEl(false);
    setloading(true);
   /*  console.log(currentName, fileList); */

    const response = await axios.post(URI + "elastic/delete", {
      filename: currentName,
      username: localStorage.getItem("uid"),
    });
    // const hi = await fetchData();

    setfileList((fileList) => {
      var remp = fileList.filter((item) => {
        // console.log(item)
        return item.name != currentName;
      });
      /* console.log(remp); */
      return remp;
    });
    // setSeed(Math.random())
    setloading(false);
    // window.location.reload(false);
  };

  const placeholder = placeholders[placeholderIndex];
  return (
    <>
      {resData.length <= 0 ? (
        <Box
          position="fixed"
          top={0}
          height="100%"
          width="100%"
          sx={{ bgcolor: "#F9FAFB" }}
        >
          {istotalloading ? 
            <Box 
          position="fixed"
          top={0}
          height="100%"
          width="100%"
          sx={{ bgcolor: "white" }}>
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={5}
                sx={{marginTop:22}}
              >
                <img src={loader} alt="" style={{ width: "17rem" }} />
              </Grid>
            </Box> : <Grid container spacing={0} sx={{ justifyContent: "left" }}>
            <Grid item xs={0.6}>
              <Nav></Nav>
            </Grid>
            <Grid item xs={11.4}>
              <Grid container padding={2}>
                <Grid
                  item
                  xs={12}
                  paddingBottom={2}
                  sx={{ justifyContent: "center" }}
                >
                  <Grid container justifyContent={"right"}>
                    <Grid item xs={10}>
                      <TextField
                        onChange={searching}
                        sx={{ width: "90%" }}
                        InputProps={{
                          placeholder,
                          startAdornment: (
                            <InputAdornment position="start">
                              <IconButton>
                                <SearchIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton>
                                <TuneIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={2} sx={{ textAlign: "right", marginTop: 1 }}>
                      <IconButton
                        sx={{ color: "rgba(0, 0, 0, 0.54)" }}
                        aria-controls={openupload ? "upload-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={openupload ? "true" : undefined}
                        onClick={handleupload}
                        component="label"
                      >
                        <input
                          multiple
                          hidden
                          accept="image/*"
                          type="file"
                          onChange={handleuploadmul}
                        />
                        <Tooltip title="Upload a file">
                          <AddIcon sx={{ fontSize: 20 }}></AddIcon>
                        </Tooltip>
                      </IconButton>

                      <Button
                        id="sort-button"
                        sx={{ color: "rgba(0, 0, 0, 0.54)" }}
                        aria-controls={opensort ? "sort-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={opensort ? "true" : undefined}
                        onClick={handleClicksort}
                      >
                        {fieldName[0]}
                      </Button>

                      <IconButton onClick={handleOrder}>
                        {isdesc ? (
                          <ArrowDownwardIcon sx={{ fontSize: 18 }} />
                        ) : (
                          <ArrowUpwardIcon sx={{ fontSize: 18 }} />
                        )}
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Box
                    sx={{
                      p: 3,
                      overflow: "auto",
                      borderRadius: 3,
                      width: "100%",
                      height: "80vh",
                      bgcolor: "white",

                      "&::-webkit-scrollbar": {
                        width: "0.5em",
                      },
                      "&::-webkit-scrollbar-track": {
                        boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
                        webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "rgba(0,0,0,.1)",
                        outline: "0px solid slategrey",
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress
                        sx={{ position: "relative", top: "50%", left: "50%" }}
                        color="inherit"
                      />
                    ) : (
                      <Grid container xs={12} sx={{ justifyContent: "right" }}>
                        <Grid
                          xs={12}
                          sx={{
                            width: "100%",
                            boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                          }}
                          bgcolor={"white"}
                        >
                          {/* <IconButton size="large" onClick={handleToggleView} sx={{ color: "black", ":hover": { background: "#6b7682" } }}>
                      {isLargeView ? <AppsIcon color='action' /> : <DensitySmallIcon color='action' />}
                    </IconButton> */}
                        </Grid>
                        <Grid container xs={12} sx={{ p: 1 }}>
                          {fileList.map((file, index) => (
                            <HtmlTooltip
                              title={
                                <React.Fragment>
                                  <p>
                                    name: {file.name}
                                    <br></br>
                                    status: {file.status}
                                    <br></br>
                                    size: {file.size} bytes<br></br>
                                    Date Uploaded: {file.date}
                                  </p>
                                </React.Fragment>
                              }
                            >
                              <Box spacing={3} sx={{ p: 2 }}>
                                <Card
                                  sx={{
                                    pb: 2,
                                    background: "#F9FAFB",
                                    border: "1px ",
                                    width: 200,
                                    height: 200,
                                    borderRadius: "8px",
                                    "&:hover": {
                                      boxShadow: "0px 0px 8px 2px grey",
                                    },
                                  }}
                                >
                                  <CardContent
                                    sx={{
                                      p: 1,
                                      display: "flex",
                                      justifyContent: "left",
                                    }}
                                  >
                                    <Box pr={1}>
                                      {getFileIcon(getExtension(file.name))}
                                    </Box>
                                    <Box flexGrow={1}>
                                      <Typography
                                        variant="small"
                                        sx={{ fontSize: 12 }}
                                      >
                                        {file.name.length > 20
                                          ? file.name.substring(0, 10) + "..."
                                          : file.name}
                                      </Typography>
                                    </Box>
                                    <Box>
                                      <IconButton
                                        id="basic-button"
                                        aria-controls={
                                          open ? "basic-menu" : undefined
                                        }
                                        aria-haspopup="true"
                                        aria-expanded={
                                          open ? "true" : undefined
                                        }
                                        onClick={(e) => {
                                          handleClick(e, file.name);
                                          setSelectedfile(file);
                                        }}
                                      >
                                        <MoreVert sx={{ fontSize: 15 }} />
                                      </IconButton>
                                    </Box>
                                  </CardContent>

                                  <Box
                                    sx={{
                                      borderRadius: 5,
                                      paddingLeft: 1,
                                      paddingRight: 1,
                                      justifyContent: "center",
                                      bgcolor: "#F9FAFB",
                                    }}
                                  >
                                    <CardMedia
                                      onClick={() => {
                                        fileClick(file);
                                      }}
                                      component="img"
                                      image={file.dataurl}
                                      sx={{ height: 140, width: 180 }}
                                    />
                                  </Box>
                                </Card>
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
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>}

          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <Box>
              <MenuItem onClick={handleDelete}>
                <Box flexGrow={1}>
                  <DeleteOutlineIcon color="action" sx={{ fontSize: 20 }} />
                  <span style={{ fontSize: 12, paddingLeft: 3 }}>Delete</span>
                  {/* <Typography >Delete</Typography> */}
                </Box>
              </MenuItem>

              <MenuItem onClick={handleApprove}>
                <Box flexGrow={1}>
                  <DoneIcon color="action" sx={{ fontSize: 20 }} />
                  <span style={{ fontSize: 12, paddingLeft: 3 }}>Approve</span>
                  {/* <Typography sx={{ fontSize: 10 }} >Approve</Typography> */}
                </Box>
              </MenuItem>

              <MenuItem onClick={handleReject}>
                <Box flexGrow={1}>
                  <BlockIcon color="action" sx={{ fontSize: 20 }} />
                  <span style={{ fontSize: 12, paddingLeft: 3 }}>Reject</span>
                  {/* <Typography>Reject</Typography> */}
                </Box>
              </MenuItem>

              <MenuItem onClick={handleClaim}>
                <Box flexGrow={1}>
                  <DocumentScannerIcon color="action" sx={{ fontSize: 20 }} />
                  <span style={{ fontSize: 12, paddingLeft: 3 }}>Claim</span>
                  {/* <Typography>Reject</Typography> */}
                </Box>
              </MenuItem>
            </Box>
          </Menu>

          <Menu
            id="sort-menu"
            anchorEl={anchorElsort}
            open={opensort}
            onClose={() => {
              setAnchorElsort(null);
            }}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem
              onClick={() => {
                handleClosesort(fieldName[1], 1);
              }}
            >
              {fieldName[1]}
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClosesort(fieldName[2], 2);
              }}
            >
              {fieldName[2]}
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClosesort(fieldName[3], 3);
              }}
            >
              {fieldName[3]}
            </MenuItem>
          </Menu>
          <Menu
            id="upload-menu"
            anchorEl={anchorElupload}
            open={openupload}
            onClose={handleCloseupload}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            {uploadedFile.length ? (
              <List
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  maxHeight: 250,
                  bgcolor: "background.paper",
                  overflow: "auto",

                  "&::-webkit-scrollbar": {
                    width: "0.5em",
                  },
                  "&::-webkit-scrollbar-track": {
                    boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
                    webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "rgba(0,0,0,.1)",
                    outline: "0px solid slategrey",
                  },
                }}
              >
                {uploadedFile.map((file) => (
                  <ListItem
                    alignItems="flex-start"
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete">
                        {/* <CheckIcon  sx={{ fontSize: 18 }} /> */}
                        {file.status == "pending" ? (
                          <CircularProgress size="1.2rem" />
                        ) : (
                          <CheckIcon
                            sx={{
                              fontSize: 18,
                              bgcolor: "#5cb85c",
                              color: "white",
                            }}
                          />
                        )}
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={file.url}
                        sx={{ border: "1px solid grey" }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primaryTypographyProps={{ fontSize: "13px" }}
                      secondaryTypographyProps={{ fontSize: "10px" }}
                      primary={file.name}
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            size:
                          </Typography>
                          {file.size} bytes
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ padding: 2 }}>
                <Typography>No file selected</Typography>
              </Box>
            )}
          </Menu>
        </Box>
      ) : (
        <InvoiceData images={fileBase} responsedata={resData} />
      )}
    </>
  );
}
