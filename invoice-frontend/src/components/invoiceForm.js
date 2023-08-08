import React from "react";
import { styled } from '@mui/material/styles';
import { useState } from "react";
import SplitPane, { Pane } from "react-split-pane";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import './invoiceFormStyles.css';
import 'split-pane-react/esm/themes/default.css'
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
import tag from "../images/tag.png";
import uploadgif from "../images/output-onlinegiftools.gif";
import InvoiceData from "./InvoiceData";
import Grid from "@mui/material/Grid";
import TextField from '@mui/material/TextField';
import { DataGrid } from '@mui/x-data-grid';
import sampleimg from '../images/modern.png'
import { useEffect } from "react";
import { tab } from "@testing-library/user-event/dist/tab";
import { Document,Page } from 'react-pdf/dist/esm/entry.webpack';
import ButtonGroup from '@mui/material/ButtonGroup';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import PublishRoundedIcon from '@mui/icons-material/PublishRounded';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export default function InvoiceForm(props){

  const [index,setIndex] = useState(0);
  let bill_of_materials=props.responsedata[index]
  let tax=bill_of_materials.tax
  let img =props.responsedata[index].pdf_image
  if(tax)
    tax=tax
  else
    tax=0;
  /* console.log(props.responsedata[index]) */
  const navigate = useNavigate();

  const [tableData, setTableData] = useState(()=>props.responsedata);
  const [image, setImage] = useState(() => props.images);
    /* Defining states, const and variables */
/*   console.log("props",props.responsedata)
  console.log("props",tableData.bill_of_materials)
   console.log("props",props.images)  */
   let i=0;
   /* let comp_name,from_addr,to_addr,inv_no,ph_no,dt,des=[] */
   const [companyName,setcompanyName]=useState([])
   const [fromAddress,setFromAddress]=useState([])
   const [toAddress,setToAddress]=useState([])
   const [invoiceNo,setInvoiceNo]=useState([])
   const [phoneNo,setPhoneNo]=useState([])
  /*  const [img,setImg]=useState([]) */
   const [des,setDes]=useState([])
   const [category,setCategory]=useState([])
   const [date, setDate] = useState(dayjs(new Date()));
   const [display,setDisplay]=useState(false)
   const [numPages, setNumPages] = useState(null);
   const [pageNumber, setPageNumber] = useState(1);
   
   const [loading, setLoading] = useState(false);
   const [totalreq, setTotalreq] = useState(0);
   const [open, setOpen] = React.useState(false);
   const [total,setTotal]=useState([])
   
   const [discount,setDiscount]=useState([])

   const [height, setHeight] = useState(150);
   const [openClosed, setOpenClosed]= useState(true)
   const [openBack,setOpenBack]=useState(false)
   const [price,setPrice]=useState([])


   function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }
 
  
  

   const columns = [
    {
      field: 'slno',
      headerName: 'Sl:no',
      type: 'number',
      width: "10px",
      editable: true,
      align: 'left',
      headerAlign: 'left',
    },
  
    { 
      field: 'total', 
      headerName: 'Total', 
      width: 80, 
      type: 'number',
      editable: true ,
      align: 'left',
      headerAlign: 'left',
    },
   
  ];
  // const row = [
  //   {
      
  //       id: index,
  //       total: total[index],
  //     /*   tax: tax[index],
  //       discount:discount[index], */
  //       description: des[index],
        
      
  //   },
   
   

    
  // ]  

  

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;
 

  const handleClickOpen = () => {
    setOpen(true);
  };

    const handleNo= async () =>{
      setOpen(false)
      setOpenBack(false)
    }

   
    const handleYes = async () =>{
     setLoading(true);
     setOpen(false)
    for (var i = 0; i < props.responsedata.length; i++) {
      const formData1 = new FormData();

      formData1.append("filename", props.images[i].name);
      formData1.append("data", JSON.stringify(props.responsedata[i]));
      formData1.append("id", "dl/0" + Math.floor(totalreq + 1).toString());
      formData1.append("name", localStorage.getItem("name"));
      formData1.append("uid", localStorage.getItem("uid"));
      formData1.append("role", localStorage.getItem("role"));
      formData1.append("submitted", today);
      formData1.append("dept", localStorage.getItem("dept"));
      formData1.append("status", "waiting");
      formData1.append("token", localStorage.getItem("token"));
      if (localStorage.getItem("role") == "Associate Practice Lead") {
        formData1.append("l1", "yes");
        formData1.append("l2", "no");
      }
      if (localStorage.getItem("role") == "Employee") {
        formData1.append("l1", "no");
        formData1.append("l2", "no");
      }
      if (localStorage.getItem("role") == "Practice Lead") {
        formData1.append("l2", "yes");
        formData1.append("l1", "yes");
      }
      formData1.append("l3", "no");
      let res;
      let res1;
      const formData2 = new FormData();
      formData2.append("token", localStorage.getItem("token"));
      formData2.append("total", totalreq + 1);
      try {
        res = await axios.post(URI + "request", formData1);
        res1 = await axios.post(URI + "addtotalreq", formData2);
      } catch (error) {
        window.alert("Server Error");
      }
    }

    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 3000);



  }; 
  const handleClose = async () => {
    
    setOpen(false)
  
  };

  const handleExpand =()=>{
    if(openClosed==true){
      setHeight(550)
      setOpenClosed(!openClosed)
    }
    else{
      setHeight(170)
      setOpenClosed(!openClosed)
    }
      
  }
 useEffect(()=>{


 },[index])


 
  function onDocumentLoadSuccess({numPages}){
    setNumPages(numPages);
    setPageNumber(1);
  }
  useEffect(()=>{
    setDisplay(true)

  })
  function incIndex(){
    setIndex(index+1)
   /*  console.log("incremented: ",index) */
  }
  function decIndex(){
    setIndex(index-1)
    /* console.log("Decremented: ",index) */
  }

  

  function backButton(){
   setOpenBack(true)
  }
   //console.log(tableData[0].company_name)
   useEffect(()=>{
    if (tableData && tableData.length > 0) {
     
      setcompanyName((prevCompanyNames) => prevCompanyNames.concat(tableData.map((item) => item.company_name)))
      setFromAddress((prevFromAddress) => prevFromAddress.concat(tableData.map((item) => item.from_address)))
      setToAddress((prevToAddress) => prevToAddress.concat(tableData.map((item) => item.to_address)))
      setInvoiceNo((prevInvoiceNo) => prevInvoiceNo.concat(tableData.map((item) => item.invoice_number)))
      setPhoneNo((prevPhoneNo) => prevPhoneNo.concat(tableData.map((item) => item.phone_number)))
      setDes((prevDes) => prevDes.concat(tableData.map((item) => item.bill_of_materials[0].description)))
      setCategory((prevCategory) => prevCategory.concat(tableData.map((item) => item.category)))
      setTotal((prevTotal) => prevTotal.concat(tableData.map((item) => item.total)))
      setDiscount((prevDiscount) => prevDiscount.concat(tableData.map((item) => item.discount)))
      setPrice((prevPrice)=>prevPrice.concat(tableData.map((item)=>item.bill_of_materials[0].unit_price)))
     

    }  
   }, [tableData])
   
   /* console.log("props of",tableData.company_name) */
  

    return(
        /************ main div **************/
        <Box sx={{width:"100%"}}>
        <div className="main-div"> 
          
           
          <div className="large-screen">
          <div className="loader">
          {loading===true? (<Box sx={{ width: '100%' }}>

          <LinearProgress />
                  </Box>):(<>
                    

                  </>)
                  }
          </div>
              <SplitPane split="vertical" minSize={700} maxSize={900} defaultSize={900} >
                <Pane className="form-img">
                  <Grid container>
                    {/* side images from the invoice */}
                    <Grid item xs={1} sm={1} >
                      <div className="sidenav">
                        {/* back button */}
                        
                        <IconButton onClick={backButton}
                           size="large"
                           edge="start"
                           color="primary"
                           variant="contained"
                           aria-label="menu"
                           
                            sx={{ ml: 4, bgcolor:'whitesmoke', mt:4}}>
                        <ArrowBackTwoToneIcon />
                        </IconButton>
                    
                      </div>
                    </Grid>



                    {/* main image of invoice */}
                    <Grid item xs={12} sm={11} >
                      <div className="image-shower"  key={"okayg_" + (10000 + Math.random() * (1000000 - 10000))}>
                     
                      <Box
                        
                         sx={{
          
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent:"center",
                          '& > :not(style)': {
                                  m: 1,
                                  width: "595px",
                                  height: "742px",
                                },
                              }}>
                        <div>
                       <img
                            
                           src={img}
                           alt=""
                           style={{ width: '100%', height: '100%' }} /> 
                           
                        </div>
                        
                           
                           
                       
                        <div className="fileNav-btn">
                     
                        <Button sx={{ marginRight: '5px' }}
                        onClick={decIndex}  disabled={index==0?true:false}>
                        <IconButton 
                            size="small"
                            sx={{color:'Black'}}>
                        <KeyboardArrowLeftRoundedIcon /></IconButton>Previous file
                        </Button>
                        
                        
                        <Button sx={{ marginLeft: '290px' }} disabled={index===tableData.length-1 ? true: false}
                            onClick={incIndex}
                        >Next file
                          <IconButton 
                            size="small"
                            sx={{color:'Black'}}>
                        <KeyboardArrowRightRoundedIcon /></IconButton>
                        </Button>
                      </div>
                     
                      </Box>
                      
                      </div>
                     

                      
                    </Grid>
                  </Grid>
                </Pane> 


                {/* Results shown here */}
                <Pane>
                 <Grid item xs={12} sm={12}>
                     <div className="results">
                      <div className="fileName">
                        <h3>{image[index].name}</h3>
                      </div>
                      <hr></hr> 
                      {/* General info */}
                     
                     

                      <Accordion defaultExpanded>
                        <AccordionSummary onClick={handleExpand}
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header">
                              <Stack direction="row" spacing={1}>
                                  <div className="heading">
                                   <h5>General info: </h5></div>
                                    <div className="tag">
                                  <Stack direction="row" spacing={1}>
                                    <Chip
                                      avatar={<Avatar alt="catagory" src={tag}  />}
                                      label={category[index]}
                                      color="primary" />
                                  </Stack>
                      
                      </div>
                      </Stack> 
                        </AccordionSummary>
                        <AccordionDetails>
                        {display==true ?
                     (
                      <>
                      <Grid container spacing={1}>
                      <Grid item sm={4}>
                      <TextField 
                      defaultValue={invoiceNo[index]}
                      key={"okayg_" + (10000 + Math.random() * (1000000 - 10000))}
                      id="invoice_no" 
                      label=" Invoice number"
                      variant="outlined"
                      autoFocus
                      margin="dense"
                      type="text"
                      color="primary" focused/>
                      </Grid>

                      <Grid item sm={4}>
                      <TextField 
                      defaultValue={phoneNo[index]}   
                      key={"okayg_" + (10000 + Math.random() * (1000000 - 10000))}                   
                      id="ph_no" 
                      label="Phone number" 
                      variant="outlined"
                      autoFocus
                      margin="dense"
                      type="text"
                      color="primary" focused/>
                      </Grid>

                      <Grid item  sm={4}>
                      
                      <div className="date">
                      <LocalizationProvider dateAdapter={AdapterDayjs} >
                        <DatePicker 
                          label="Date"
                          value={date}
                          autoFocus
                          variant="outlined"
                          margin="dense"
                          onChange={(newValue) => setDate(newValue)}
                          />
                      </LocalizationProvider></div>
                      </Grid>
                      </Grid> 
                      <TextField 
                      defaultValue={companyName[i]}
                      key={"okayg_" + (10000 + Math.random() * (1000000 - 10000))}
                      id="CompanyName" 
                      label="Company name" 
                      variant="outlined"
                      autoFocus
                      margin="dense"
                      type="text"
                      fullWidth
                      color="primary" focused/>

                      <TextField 
                      defaultValue={fromAddress[i]}
                      key={"okayg_" + (10000 + Math.random() * (1000000 - 10000))}
                      id="fromAddress" 
                      label="From address" 
                      variant="outlined"
                      multiline
                      maxRows={3}
                      autoFocus
                      margin="dense"
                      type="text"
                      fullWidth
                      color="primary" focused/>

                      <TextField 
                      defaultValue={toAddress[index]}
                      key={"okayg_" + (10000 + Math.random() * (1000000 - 10000))}
                      id="toAddress" 
                      label="To address" 
                      variant="outlined"
                      multiline
                     
                      autoFocus
                      margin="dense"
                      type="text"
                      fullWidth
                      color="primary" focused/> 

                
                  
                        
                        {/* Line items */}
                     
                      </>
                     ):(

                      <div>
                      </div>
                     )}
                      </AccordionDetails>
                      </Accordion>
                      
                      {/* <ul class="tags blue">
                          <li><a href="#">Infrastructure <span>31</span></a></li> 
                      </ul> */}
                     
                     
                   
                        
                      
                         
                         
                       
                        <Grid container>
                          <Grid item sm={12}>
                          <div className="heading">
                          <h5>Line items:</h5>
                        </div>
                          </Grid>
                        
                          <Grid item sm={12}>
                          <div style={{ height: height}} className="table-container" id="customers">
                          <table style={{display: "block", height: height}}>
                              <thead>
                                <tr>
                                  <td><h6 style={{fontWeight:"bold"}}>S:NO</h6></td>
                                  <td><h6 style={{fontWeight:"bold"}}>Description</h6></td>
                                  <td><h6 style={{fontWeight:"bold"}}>Amount</h6></td>
                                </tr>
                              </thead>
                              <tbody key={"okayg_" + (10000 + Math.random() * (1000000 - 10000))}>
                              {bill_of_materials.bill_of_materials[0].description.map((item, i) => (
                                <tr key={i} >
                                  <td>{i+1}</td>
                                  <td>{bill_of_materials.bill_of_materials[0].description[i]}</td>
                                  <td>{bill_of_materials.bill_of_materials[0].unit_price[i]}</td>
                                </tr>))}
                              <tr style={{textAlign:"right"}}>
                                <td></td>
                                <td>Total with {tax}% of tax:</td>
                                <td>{bill_of_materials.total}</td>
                              </tr>  
                                
                              </tbody>
                            </table>
                          </div>
                          </Grid>
                        </Grid>
                    
                          
                        <Button variant="contained" color="primary" sx={{ ml:'40%', marginTop:3}} onClick={handleClickOpen}>
                            Submit
                          <IconButton 
                           size="small"
                           edge="start"
                           color="primary"
                           variant="contained"
                           aria-label="menu"
                            
                            sx={{ ml:2, bgcolor:'whitesmoke'}}>
                        <PublishRoundedIcon />
                        </IconButton>
                        </Button>
                       
                        <div className="submit-btn">
                        
                          <Dialog
                          open={open}
                          onClose={handleClose}
                          aria-labelledby="alert-dialog-title"
                          aria-describedby="alert-dialog-description"
                        >
                        <DialogTitle id="alert-dialog-title">
                            {"Are you sure that you want to submit the invoice?"}
                        </DialogTitle>
                        <DialogActions>
                           <Button onClick={handleNo}>NO</Button>
                           <Button onClick={handleYes} autoFocus>
                               YES
                          </Button>
                        </DialogActions>
                        </Dialog> 

                        <Dialog
                          open={openBack}
                          onClose={handleClose}
                          aria-labelledby="alert-dialog-title"
                          aria-describedby="alert-dialog-description"
                        >
                        <DialogTitle id="alert-dialog-title">
                            {"Are you sure that you want to go back?"}
                        </DialogTitle>
                        <DialogActions>
                           <Button onClick={handleNo}>NO</Button>
                           <Button onClick={()=> props.updateParentState()} autoFocus>
                               YES
                          </Button>
                        </DialogActions>
                        </Dialog>  
                        </div>
                 

                     
                     
                  </div>
                </Grid>
                </Pane>       
              </SplitPane> 







            </div>


            {/* Rendered if the screen is small */} 
            <div className="small-screen">
              <Grid container spacing={2}>
                
                <Grid item xs={12} sm={12}>
                <Grid item container={true} xs={12}>
                    {/* side images from the invoice */}
                   



                    {/* main image of invoice */}
                    <Grid item xs={12} sm={12} >
                      <div className="img-show"  key={"okayg_" + (10000 + Math.random() * (1000000 - 10000))}>
                      <IconButton onClick={backButton}
                           size="large"
                           edge="start"
                           color="primary"
                           variant="contained"
                           aria-label="menu"
                           
                            sx={{ ml: 4, bgcolor:'whitesmoke', mt:4}}>
                        <ArrowBackTwoToneIcon />
                        </IconButton>
                    
                      <Box
                        
                         sx={{
          
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent:"center",
                          '& > :not(style)': {
                                  m: 1,
                                  width: "595px",
                                  height: "742px",
                                },
                              }}>
                        <Paper elevation={3} >
                       

                           <img
                           key={"okayg_" + (10000 + Math.random() * (1000000 - 10000))}
                           src={img}
                           alt=""
                           style={{ width: '100%', height: '100%' }} />
                           
                        </Paper><br></br>
                        <div className="fileNav-btn">
                     
                        <Button sx={{ marginRight: '5px' }}
                        onClick={decIndex}  disabled={index==0?true:false}>
                        <IconButton 
                            size="small"
                            sx={{color:'Black'}}>
                        <KeyboardArrowLeftRoundedIcon /></IconButton>Previous file
                        </Button>
                        
                        
                        <Button sx={{ marginLeft: '290px' }} disabled={index===tableData.length-1 ? true: false}
                            onClick={incIndex}
                        >Next file
                          <IconButton 
                            size="small"
                            sx={{color:'Black'}}>
                        <KeyboardArrowRightRoundedIcon /></IconButton>
                        </Button>
                      </div>
                     
                      </Box>
                      
                      </div>
                     

                      
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={12}>
                <Grid item xs={12} sm={12}>
                     <div className="results">
                      <div className="fileName">
                        <h3>{image[index].name}</h3>
                      </div>
                      <hr></hr> 
                      {/* General info */}
                     
                     

                      <Accordion defaultExpanded>
                        <AccordionSummary onClick={handleExpand}
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header">
                              <Stack direction="row" spacing={1}>
                                  <div className="heading">
                                   <h5>General info: </h5></div>
                                    <div className="tag">
                                  <Stack direction="row" spacing={1}>
                                    <Chip
                                      avatar={<Avatar alt="catagory" src={tag}  />}
                                      label={category[index]}
                                      variant="outlined"/>
                                  </Stack>
                      
                      </div>
                      </Stack> 
                        </AccordionSummary>
                        <AccordionDetails>
                        {display==true ?
                     (
                      <>
                          <Grid container={'true'} item sx={12}>
                      <Grid item={'true'} md={4}>
                      <TextField 
                      defaultValue={invoiceNo[index]}
                      key={"okayg_" + (10000 + Math.random() * (1000000 - 10000))}
                      id="invoice_no" 
                      label=" Invoice number"
                      variant="outlined"
                      autoFocus
                      margin="dense"
                      type="text"
                      color="primary" focused/>
                      </Grid>

                      <Grid item={'true'} md={4}>
                      <TextField 
                      defaultValue={phoneNo[index]}   
                      key={"okayg_" + (10000 + Math.random() * (1000000 - 10000))}                   
                      id="ph_no" 
                      label="Phone number" 
                      variant="outlined"
                      autoFocus
                      margin="dense"
                      type="text"
                      color="primary" focused/>
                      </Grid>

                      <Grid item={'true'}  md={4}>
                      
                      <div className="date">
                      <LocalizationProvider dateAdapter={AdapterDayjs} margin="dense" color="primary">
                        <DatePicker 
                          label="Date"
                          value={date}
                           autoFocus
                          variant="outlined"
                          margin="dense"
                          id="date"
                          onChange={(newValue) => setDate(newValue)}/>
                      </LocalizationProvider></div>
                      </Grid>
                      </Grid> 
                      <TextField 
                      defaultValue={companyName[i]}
                      key={"okayg_" + (10000 + Math.random() * (1000000 - 10000))}
                      id="CompanyName" 
                      label="Company name" 
                      variant="outlined"
                      autoFocus
                      margin="dense"
                      type="text"
                      fullWidth
                      color="primary" focused/>

                      <TextField 
                      defaultValue={fromAddress[i]}
                      key={"okayg_" + (10000 + Math.random() * (1000000 - 10000))}
                      id="fromAddress" 
                      label="From address" 
                      variant="outlined"
                      multiline
                      maxRows={3}
                      autoFocus
                      margin="dense"
                      type="text"
                      fullWidth
                      color="primary" focused/>

                      <TextField 
                      defaultValue={toAddress[index]}
                      key={"okayg_" + (10000 + Math.random() * (1000000 - 10000))}
                      id="toAddress" 
                      label="To address" 
                      variant="outlined"
                      multiline
                     
                      autoFocus
                      margin="dense"
                      type="text"
                      fullWidth
                      color="primary" focused/> 

                
                  
                        
                        {/* Line items */}
                     
                      </>
                     ):(

                      <div>

                      </div>
                     )}
                      </AccordionDetails>
                      </Accordion>
                      
                      {/* <ul class="tags blue">
                          <li><a href="#">Infrastructure <span>31</span></a></li> 
                      </ul> */}
                     
                     
                   
                        <div className="heading">
                          <h5>Line items:</h5>
                        </div>
                      
                         
                         
                       
                 
                    
                        <div style={{width: 'auto', height: height}} className="table-container" id="customers">
                          <table style={{display: "block", height: height}}>
                              <thead>
                                <tr>
                                  <td><h6 style={{fontWeight:"bold"}}>S:NO</h6></td>
                                  <td><h6 style={{fontWeight:"bold"}}>Description</h6></td>
                                  <td><h6 style={{fontWeight:"bold"}}>Amount</h6></td>
                                </tr>
                              </thead>
                              <tbody key={"okayg_" + (10000 + Math.random() * (1000000 - 10000))}>
                              {bill_of_materials.bill_of_materials[0].description.map((item, i) => (
                                <tr key={i} >
                                  <td>{i+1}</td>
                                  <td>{bill_of_materials.bill_of_materials[0].description[i]}</td>
                                  <td>{bill_of_materials.bill_of_materials[0].unit_price[i]}</td>
                                </tr>))}
                              <tr style={{textAlign:"right"}}>
                                <td></td>
                                <td>Total with {tax}% of tax:</td>
                                <td>{bill_of_materials.total}</td>
                              </tr>  
                                
                              </tbody>
                            </table>
                          </div>
                        <Button variant="contained" color="primary" sx={{ ml:'40%', marginTop:3}} onClick={handleClickOpen}>
                            Submit
                          <IconButton 
                           size="small"
                           edge="start"
                           color="primary"
                           variant="contained"
                           aria-label="menu"
                            
                            sx={{ ml:2, bgcolor:'whitesmoke'}}>
                        <PublishRoundedIcon />
                        </IconButton>
                        </Button>
                       
                        <div className="submit-btn">
                        <Dialog
                          open={open}
                          onClose={handleClose}
                          aria-labelledby="alert-dialog-title"
                          aria-describedby="alert-dialog-description"
                        >
                        <DialogTitle id="alert-dialog-title">
                            {"Are you sure that you want to submit the invoice?"}
                        </DialogTitle>
                        <DialogActions>
                           <Button onClick={handleNo}>NO</Button>
                           <Button onClick={handleYes} autoFocus>
                               YES
                          </Button>
                        </DialogActions>
                        </Dialog> 


                          <Dialog
                          open={openBack}
                          onClose={handleClose}
                          aria-labelledby="alert-dialog-title"
                          aria-describedby="alert-dialog-description"
                        >
                        <DialogTitle id="alert-dialog-title">
                            {"Are you sure that you want to go back?"}
                        </DialogTitle>
                        <DialogActions>
                           <Button onClick={handleNo}>NO</Button>
                           <Button onClick={()=> props.updateParentState()} autoFocus>
                               YES
                          </Button>
                        </DialogActions>
                        </Dialog> 


                        
                        </div>
                 

                     
                     
                  </div>
                </Grid>
                </Grid>
                </Grid>

              </div>

        
        </div>
        </Box>);
}