import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from "react";
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import DraftsOutlinedIcon from '@mui/icons-material/DraftsOutlined';
import DarkModeSharpIcon from '@mui/icons-material/DarkModeSharp';
import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';
import Badge from '@mui/material/Badge';
import { Grid } from '@mui/material';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import './EmployeeDashboardDesign.css'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DangerousIcon from '@mui/icons-material/Dangerous';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import { useNavigate } from 'react-router-dom';
import URI from "../utils/request";
import axios, * as others from "axios";
import FindInPageIcon from '@mui/icons-material/FindInPage';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import LogoutIcon from '@mui/icons-material/Logout'
import FileOpenIcon from '@mui/icons-material/FileOpen';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';

const drawerWidth = 240;


const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  });
  
  const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
  });
  
  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  }));
  
  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));
  
  const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
      ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
      }),
      ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
      }),
    }),
  );
  
  // Table functions
  
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      color: theme.palette.common.white,
  
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.white,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));
  
  
  // Modal


  
  





function HeadDashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const dataFetchedRef = useRef(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(true);
  const [total, setTotal] = useState(0);
  const [acctotal, setaccTotal] = useState(0);
  const [rejtotal, setrejTotal] = useState(0);
  const [pentotal, setpenTotal] = useState(0);
  const [accepted, setAccepted] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [waiting, setWaiting] = useState(0);
  const [tabData,setTabData] = useState([])
  const [openmodal, setOpenmodal] = React.useState(false);
  const [selectedValue,setselectedValue] = useState({})
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('lg');


  const [wholeData,setWholeData] = useState([{
    id: "",
    status: "",
    l1: "",
    l2: "",
    l3: "",
    submitted: "",
    data: {
      company_name: "",
      from_address: "",
      to_address: "",
      invoice_date: "",
      due_date: "",
      phone_number: "",
      invoice_number: "",
      currency: "",
      total: "",
      sub_total: "",
      tax: "",
      category: "",
      discount: "",
      barcode: "",
      logo: "",
      bill_of_materials: [
        {
          description: [""],
          quantity: [""],
          unit_price: [""],
          price: [""],
        },
      ],
    },
  }])
  let acc = 0;
  let rej = 0;
  let wait = 0;
  let tot = 0;
  let acctot = 0;
  let rejtot = 0;
  let pentot = 0;
  let Appliances = 0;
  let Automotive = 0;
  let Electronics = 0;
  let Health = 0;
  let beauty = 0;
  let food = 0;
  let industry = 0
  
  useEffect(()=>{
    
    if (!localStorage.getItem('uid')){
      navigate('/login')
    }
  },[]);
  
  

  const handleModal = (value) => {
    setselectedValue(value)
    setOpenmodal(true);
  };

  const handleClose = () => {
    setOpenmodal(false);
  };

  const approve = async (data) => {
    let temp = {
     
    };
    temp = data;
    try {
      const formData1 = new FormData();
      formData1.append("id", temp.id);
      formData1.append("name", temp.name);
      formData1.append("uid", temp.uid);
      formData1.append("role", temp.role);
      formData1.append("dept", temp.dept);
      formData1.append("submitted", temp.submitted);
      var data1 = {
        company_name: temp.company_name,
        from_address:temp.from_address,
        to_address: temp.to_address,
        invoice_date: temp.invoice_Date,
        due_date: temp.due_date,
        phone_number: temp.phone_number,
        invoice_number: temp.invoice_number,
        currency:temp.currency,
        total: temp.total,
        sub_total: temp.sub_total,
        tax: temp.tax,
        category:temp.category,
        discount: temp.discount,
        barcode: temp.barcode,
        logo:temp.logo,
        bill_of_materials: [
          {
            description: temp.bill_of_materials[0].description,
            quantity: temp.bill_of_materials[0].quantity,
            unit_price: temp.bill_of_materials[0].unit_price,
            price: temp.bill_of_materials[0].price,
          }
      ]
    
       
      }

  
      if (localStorage.getItem("role") == "Associate Practice Lead") {
        formData1.append("l1", "yes");
        formData1.append("l2", temp.l2);
        if (temp.l2 == "yes" && temp.l3 == "yes") {
          formData1.append("status", "accepted");
        } else {
          formData1.append("status", temp.status);
        }
      }
      if (localStorage.getItem("role") == "Practice Lead") {
        formData1.append("l2", "yes");
        formData1.append("l1", temp.l1);
        if (temp.l1 == "yes" && temp.l3 == "yes") {
          formData1.append("status", "accepted");
        } else {
          formData1.append("status", temp.status);
        }
      }
      formData1.append("l3", temp.l3);
      formData1.append("data", JSON.stringify(data1));
      formData1.append("token", localStorage.getItem("token"));
      console.log("temp",temp)
      let res = await axios.post(URI + "update", formData1);
    } catch (error) {
      window.alert("Some thing went wrong please try again");
      console.log(error);
      window.location.reload();
    }
    // window.location.reload();
    setOpenmodal(false)

  };

  const reject = async (data) => {
    let temp = {
      
    };
    temp = data;
    var data = {
      company_name: temp.company_name,
      from_address:temp.from_address,
      to_address: temp.to_address,
      invoice_date: temp.invoice_Date,
      due_date: temp.due_date,
      phone_number: temp.phone_number,
      invoice_number: temp.invoice_number,
      currency:temp.currency,
      total: temp.total,
      sub_total: temp.sub_total,
      tax: temp.tax,
      category:temp.category,
      discount: temp.discount,
      barcode: temp.barcode,
      logo:temp.logo,
      bill_of_materials: [
        {
          description: temp.bill_of_materials[0].description,
          quantity: temp.bill_of_materials[0].quantity,
          unit_price: temp.bill_of_materials[0].unit_price,
          price: temp.bill_of_materials[0].price,
        }
    ]
  
     
    }
    try {
      const formData1 = new FormData();

      formData1.append("id", temp.id);
      formData1.append("name", temp.name);
      formData1.append("uid", temp.uid);
      formData1.append("role", temp.role);
      formData1.append("dept", temp.dept);
      formData1.append("submitted", temp.submitted);
      
      if (localStorage.getItem("role") == "Associate Practice Lead") {
        formData1.append("l1", "rej");
        formData1.append("l2", "rej");
        formData1.append("l3", "rej");
        formData1.append("status", "rejected");
      }
      if (localStorage.getItem("role") == "Practice Lead") {
        formData1.append("l1", "rej");
        formData1.append("l2", "rej");
        formData1.append("l3", "rej");
        formData1.append("status", "rejected");
      }
      formData1.append("data", JSON.stringify(data));
      formData1.append("token", localStorage.getItem("token"));

      let res = await axios.post(URI + "update", formData1);
    } catch (error) {
      window.alert("Some thing went wrong please try again");
      console.log(error);
      window.location.reload();
    }
    setOpenmodal(false)
  };



  



  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handlesearch = () =>{
    console.log("hi at handle search")
    navigate("/filemanager")
  }
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  const getCurrentDate = (separator='/')=>{

    let newDate = new Date()
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    
    return `${date}${separator}${month<10?`0${month}`:`${month}`}${separator}${year}`
    }
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };
  
  useEffect(() => {

    async function fetchData() {
      let res = {
        data: [
          {
            id: "",
            status: "",
            l1: "",
            l2: "",
            l3: "",
            submitted: "",
            data: `{
          company_name: "",
          from_address: "",
          to_address: "",
          invoice_date: "",
          due_date: "",
          phone_number: "",
          invoice_number: "",
          currency:"",
          total: "",
          sub_total: "",
          tax: "",
          category:"",
          discount: "",
          barcode: "",
          logo:"",
          bill_of_materials: [
            {
                description: [
                    ""
                ],
                quantity: [
                    ""
                ],
                unit_price: [
                    ""
                ],
                price: [
                    ""
                ]
            }
        ]
      
         
        }`,
          },
        ],
      };
      const formData1 = new FormData();
      formData1.append("uid", localStorage.getItem("uid"));
      formData1.append("token", localStorage.getItem("token"));
      res = await axios.post(URI + "allrequests", formData1);

      if (localStorage.getItem("role") == "Associate Practice Lead") {
        res.data = res.data.filter(function (itm) {
          return itm.role != "Associate Practice Lead";
        });
        res.data = res.data.filter(function (itm) {
          return itm.role != "Practice Lead";
        });
        res.data.map((it, index) => {
          if (it.l1 == "rej") {
            rej = rej + 1;
            let temp = {
              company_name: "",
              from_address: "",
              to_address: "",
              invoice_date: "",
              due_date: "",
              phone_number: "",
              invoice_number: "",
              currency: "",
              total: "",
              sub_total: "",
              tax: "",
              category: "",
              discount: "",
              barcode: "",
              logo: "",
              bill_of_materials: [
                {
                  description: [""],
                  quantity: [""],
                  unit_price: [""],
                  price: [""],
                },
              ],
            };
            try {
              temp = JSON.parse(it.data);
            } catch (error) {
              temp = it.data;
            }

            // rejtot = rejtot + parseFloat(temp.total);
          }
          if (it.l1 == "no") {
            wait = wait + 1;
            let temp = {
              company_name: "",
              from_address: "",
              to_address: "",
              invoice_date: "",
              due_date: "",
              phone_number: "",
              invoice_number: "",
              currency: "",
              total: "",
              sub_total: "",
              tax: "",
              category: "",
              discount: "",
              barcode: "",
              logo: "",
              bill_of_materials: [
                {
                  description: [""],
                  quantity: [""],
                  unit_price: [""],
                  price: [""],
                },
              ],
            };
            try {
              temp = JSON.parse(it.data);
            } catch (error) {
              temp = it.data;
            }

            // pentot = pentot + parseFloat(temp.total);

          }
          if (it.l1 == "yes") {
            acc = acc + 1;
            let temp = {
              company_name: "",
              from_address: "",
              to_address: "",
              invoice_date: "",
              due_date: "",
              phone_number: "",
              invoice_number: "",
              currency: "",
              total: "",
              sub_total: "",
              tax: "",
              category: "",
              discount: "",
              barcode: "",
              logo: "",
              bill_of_materials: [
                {
                  description: [""],
                  quantity: [""],
                  unit_price: [""],
                  price: [""],
                },
              ],
            };
            try {
              temp = JSON.parse(it.data);
            } catch (error) {
              temp = it.data;
            }
            
            // acctot = acctot + parseFloat(temp.total);
          }
          res.data = res.data.filter(function (itm) {
            return itm.l1 != "yes";
          });
          res.data = res.data.filter(function (itm) {
            return itm.status != "accepted";
          });
          res.data = res.data.filter(function (itm) {
            return itm.status != "rejected";
          });
        });
      }
      if (localStorage.getItem("role") == "Practice Lead") {
        res.data = res.data.filter(function (itm) {
          return itm.role != "Practice Lead";
        });
        res.data.map((it, index) => {
          if (it.l2 == "rej") {
            rej = rej + 1;
            let temp = {
              company_name: "",
              from_address: "",
              to_address: "",
              invoice_date: "",
              due_date: "",
              phone_number: "",
              invoice_number: "",
              currency: "",
              total: "",
              sub_total: "",
              tax: "",
              category: "",
              discount: "",
              barcode: "",
              logo: "",
              bill_of_materials: [
                {
                  description: [""],
                  quantity: [""],
                  unit_price: [""],
                  price: [""],
                },
              ],
            };
            try {
              temp = JSON.parse(it.data);
            } catch (error) {
              temp = it.data;
            }

            // rejtot = rejtot + parseFloat(temp.total);
          }
          if (it.l2 == "no") {
            wait = wait + 1;
            let temp = {
              company_name: "",
              from_address: "",
              to_address: "",
              invoice_date: "",
              due_date: "",
              phone_number: "",
              invoice_number: "",
              currency: "",
              total: "",
              sub_total: "",
              tax: "",
              category: "",
              discount: "",
              barcode: "",
              logo: "",
              bill_of_materials: [
                {
                  description: [""],
                  quantity: [""],
                  unit_price: [""],
                  price: [""],
                },
              ],
            };
            try {
              temp = JSON.parse(it.data);
            } catch (error) {
              temp = it.data;
            }

            // pentot = pentot + parseFloat(temp.total);
          }
          if (it.l2 == "yes") {
            acc = acc + 1;
            let temp = {
              company_name: "",
              from_address: "",
              to_address: "",
              invoice_date: "",
              due_date: "",
              phone_number: "",
              invoice_number: "",
              currency: "",
              total: "",
              sub_total: "",
              tax: "",
              category: "",
              discount: "",
              barcode: "",
              logo: "",
              bill_of_materials: [
                {
                  description: [""],
                  quantity: [""],
                  unit_price: [""],
                  price: [""],
                },
              ],
            };
            try {
              temp = JSON.parse(it.data);
            } catch (error) {
              temp = it.data;
            }

            // acctot = acctot + parseFloat(temp.total);

          }
          res.data = res.data.filter(function (itm) {
            return itm.l2 != "yes";
          });
          res.data = res.data.filter(function (itm) {
            return itm.status != "accepted";
          });
  
          res.data = res.data.filter(function (itm) {
            return itm.status != "rejected";
          });
        });
      }
      setWholeData(res.data);
      console.log("response data",res.data)
        const tempTable = [];
        for(let i=0;i<res['data'].length;i++){
          console.log(JSON.parse(res['data'][i].data).category)
          const cat = JSON.parse(res['data'][i].data).category
          const parseddata = JSON.parse(res['data'][i].data)
          tempTable.push({
            "Date":getCurrentDate(),"Category":cat,"Amount":Number(parseddata.total).toFixed(2),"currency":parseddata.currency,"status":res['data'][i].status[0].toUpperCase() + res['data'][i].status.slice(1),
              company_name: parseddata.company_name,
              from_address: parseddata.from_address,
              to_address: parseddata.to_address,
              invoice_date: parseddata.invoice_date,
              due_date: parseddata.due_date,
              phone_number: parseddata.phone_number,
              invoice_number: parseddata.invoice_number,
              sub_total: parseddata.sub_total,
              tax: parseddata.tax,
              discount: parseddata.discount,
              barcode: parseddata.barcode,
              logo: parseddata.logo,
              total:parseddata.total,
              id: res.data[i].id,
              l1: res.data[i].l1,
              l2: res.data[i].l2,
              l3: res.data[i].l3,
              name:localStorage.getItem("name"),
              uid:localStorage.getItem("uid"),
              role:localStorage.getItem("role"),
              dept:localStorage.getItem("dept"),
              submitted: wholeData.submitted,
              bill_of_materials: [
                {
                  description: parseddata.bill_of_materials[0].description!=null ? parseddata.bill_of_materials[0].description : [],
                  quantity: parseddata.bill_of_materials[0].quantity!=null ? parseddata.bill_of_materials[0].quantity : [],
                  unit_price: parseddata.bill_of_materials[0].unit_price != null ? parseddata.bill_of_materials[0].unit_price : [],
                  price: parseddata.bill_of_materials[0].price!=null ? parseddata.bill_of_materials[0].price : [],
                },
              ],
          })
          console.log(tempTable)
          if(cat=='Automotive'){
            Automotive+=1
          }
          else if(cat=='Electronics'){
            Electronics+=1
          }
          else if(cat=='Health Care'){
            Health+=1
          }
          else if(cat=='beauty'){
            beauty+=1
          }
          else if(cat=='food'){
            food+=1
          }
          else if(cat=='industry'){
            industry+=1
          }
          else if(cat=='Appliances'){
            Appliances+=1
          }
          if(res['data'][i].status ==='accepted'){
            acctot+=1
          }
          else if(res['data'][i].status ==='rejected'){
            rejtot+=1
          } 
          else if(res['data'][i].status ==='waiting'){
            pentot+=1
          }
        }
      setTabData(tempTable)
     
      setTotal((acctot + rejtot + pentot).toFixed(2));
      setaccTotal(acctot.toFixed(2));
      setrejTotal(rejtot.toFixed(2));
      setpenTotal(pentot.toFixed(2));
      setAccepted(acc);
      setRejected(rej);
      setWaiting(wait);
    }
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    fetchData();

  },[]);


  const styles = {
    paper: {
      background: "blue"
    }
  }
  const useStyles = {
    list: {
      width: 250
    },
    fullList: {
      width: "auto"
    },
    paper: {
      background: "blue"
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="absolute" open={open} style={{backgroundColor:"#ffff",color:"#000000"}}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Dashboard
            </Typography>
            
            
            <IconButton color="inherit">
              <Badge badgeContent={Number(total)} color="warning">
                <AccountCircleSharpIcon />
              </Badge>
            </IconButton>
            
          </Toolbar>
        </AppBar>
      <Drawer variant="permanent" open={open} PaperProps={{
            sx: {
              backgroundColor: "#1e2833",
              width: 300,
              color:"#6b7682"
            },
          }}>
        <DrawerHeader>
          <IconButton style={{color:"#ffff"}} onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon style={{ color:"#ffff" }}/> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
        <ListItem key="Drafts" disablePadding sx={{ display: 'block',
            '&& .Mui-selected, && .Mui-selected:hover': {
              bgcolor: 'red',
              '&, & .MuiListItemIcon-root': {
                color: 'pink',
              },
            },
            
            '& .MuiListItemButton-root:hover': {
              bgcolor: '#6b7682',
              '&, & .MuiListItemIcon-root': {
                color: 'white'
           
              },
            },
          }}
            
           >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    
                  }}
                >
                  <DraftsOutlinedIcon style={{ color:"#ffff" }}/>
                </ListItemIcon>
                <ListItemText primary="Drafts" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
            <ListItem key="Search" disablePadding sx={{ display: 'block',
            '&& .Mui-selected, && .Mui-selected:hover': {
              bgcolor: 'red',
              '&, & .MuiListItemIcon-root': {
                color: 'pink',
              },
            },
            
            '& .MuiListItemButton-root:hover': {
              bgcolor: '#6b7682',
              '&, & .MuiListItemIcon-root': {
                color: 'white'
           
              },
            },
          }}
            
           >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  
                }} onClick={handlesearch}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    
                  }}
                >
                  <FindInPageIcon style={{ color:"#ffff" }}/>
                </ListItemIcon>
                <ListItemText primary="Search" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
        </List>
        <Divider color="white"/>
        <List>
        <ListItem key="Dark Mode" disablePadding sx={{ display: 'block',
            '&& .Mui-selected, && .Mui-selected:hover': {
              bgcolor: 'red',
              '&, & .MuiListItemIcon-root': {
                color: 'pink',

              },
            },
            
            '& .MuiListItemButton-root:hover': {
              bgcolor: '#6b7682',
              '&, & .MuiListItemIcon-root': {
                color: '#e3e8eb',
              },
            },
            }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }} 
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <DarkModeSharpIcon style={{ color:"#ffff" }}/>
                </ListItemIcon>
                <ListItemText primary="Dark Mode" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
            <ListItem key="Logout" disablePadding sx={{ display: 'block',
            '&& .Mui-selected, && .Mui-selected:hover': {
              bgcolor: 'red',
              '&, & .MuiListItemIcon-root': {
                color: 'pink',

              },
            },
            
            '& .MuiListItemButton-root:hover': {
              bgcolor: '#6b7682',
              '&, & .MuiListItemIcon-root': {
                color: '#e3e8eb',
              },
            },
            }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }} onClick={() => {
                  window.localStorage.clear();
                  navigate("/login");
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <LogoutIcon style={{ color:"#ffff" }}/>
                </ListItemIcon>
                <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Grid container spacing={4}   id="portfolio">
  <Grid item xs={3}>
        <div class="card" id="storageCard">
          <div class="card-title">Total Claim Requests</div>
          <div class="card-icon"><AccountBalanceWalletIcon /></div>
          <div class="card-data"><h4>{total}</h4></div>
          
        </div>
  </Grid>
  <Grid item xs={3}>
  <div class="card" id="loveCard" >
          <div class="card-title">Total claim Approved</div>
          <div class="card-icon"><CheckCircleIcon /></div>
          <div class="card-data"><h4>{acctotal}</h4></div>
          
        </div>
  </Grid>
  <Grid item xs={3}>
  <div class="card" id="pizzaCard">
          <div class="card-title">Total claim Rejected</div>
          <div class="card-icon"><DangerousIcon /></div>
          <div class="card-data"><h4>{rejtotal}</h4></div>
          
        </div>
  </Grid>
  <Grid item xs={3}>
  <div class="card" id="gameCard">
          <div class="card-title">Total claim Pending</div>
          <div class="card-icon"><PendingActionsIcon /></div>
          <div class="card-data"><h4>{pentotal}</h4></div>
          
        </div>
  </Grid>
  
</Grid>
<Grid container spacing={5} id="charttype">

  <Grid item xs={12}>
   <div class="card1">
   <Paper sx={{ width: '100%', overflow: 'hidden' }}>
  <TableContainer>
      <Table sx={{ minWidth: 440 }} aria-label="sticky table">
        <TableHead>
          <TableRow id="tableheader">
            <StyledTableCell align="left" style={{width: 200}}>Date</StyledTableCell>
            <StyledTableCell align="left" style={{width: 200}}>Category</StyledTableCell>
            <StyledTableCell align="left" style={{width: 200}}>Amount</StyledTableCell>
            <StyledTableCell align="left" style={{width: 200}}>Approvers</StyledTableCell>
            <StyledTableCell align="left" style={{width: 200}}>Status</StyledTableCell>
            <StyledTableCell align="left" style={{width: 200}}>Currency</StyledTableCell>
            <StyledTableCell align="left" style={{width: 200}}>View</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tabData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell align="left" style={{width: 200}}>
                {row.Date}
              </StyledTableCell>
              
              <StyledTableCell align="left" style={{width: 200}}>{row.Category}</StyledTableCell>
              <StyledTableCell align="left" style={{width: 200}}>{row.Amount}</StyledTableCell>
              <StyledTableCell align="left" style={{width: 200}}>
                <div className='d-flex align-items-center'>
                
                <Avatar  alt="Remy Sharp" src="https://mui.com/static/images/avatar/3.jpg" sx={{ width: 24, height: 24 }} align="left"/>
                <Avatar
  alt="Remy Sharp"
  src="https://mui.com/static/images/avatar/2.jpg"
  sx={{ width: 24, height: 24,marginLeft:"5px" }} align="left"
/>
                </div>
                
                </StyledTableCell>
              <StyledTableCell align="left" style={{width: 200}}><Chip label={row.status} color={row.status=="Accepted" ? "success" : row.status=="Rejected" ? "error" : "warning"} /></StyledTableCell>
              <StyledTableCell align="left" style={{width: 200}}>{row.currency}</StyledTableCell>
              <StyledTableCell align="left" style={{width: 200}}><IconButton color="info" onClick={()=>{
                console.log("button click", row)
                handleModal(row)
              }}><FileOpenIcon /></IconButton></StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
        rowsPerPageOptions={[5,10,15]}
        component="div"
        count={tabData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      </Paper>
   </div>
   <Dialog onClose={handleClose} open={openmodal} fullWidth={fullWidth}
      maxWidth={maxWidth}>
        <DialogTitle>Invoice</DialogTitle>
        <div class="container bootdey">
<div class="row invoice row-printable">
    <div class="col-md-10">
        <div class="panel panel-default plain" id="dash_0">

            <div class="panel-body p30">
                <div class="row">

                    <div class="col-lg-6">

                        <div class="invoice-logo"><img width="150" src={"data:image/png;base64,"+selectedValue.logo} alt="Invoice logo" /></div>
                    </div>

                    <div class="col-lg-4 mt-2">

                        <div class="invoice-from">
                        <strong>Invoice From</strong>
                            <p>{selectedValue.from_address}</p>
                        </div>
                    </div>

                    <div class="col-lg-12 mt-4">

                        <div class="invoice-details mt25">
                            <div class="well">
                                <ul class="list-unstyled mb0">
                                    <li><strong>Invoice</strong> {selectedValue.invoice_number}</li>
                                    <li><strong>Invoice Date:</strong> {selectedValue.invoice_date}</li>
                                    <li><strong>Due Date:</strong> {selectedValue.due_date}</li>
                                    
                                </ul>
                            </div>
                        </div>
                        <div class="invoice-to mt25">
                        <strong>Invoice To</strong><p>{selectedValue.to_address}</p>
                        </div>
                        <div class="invoice-items">
                            <div class="table-responsive" style={{overflow: "hidden", outline: "none"}} tabindex="0">
                                <table class="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th class="per70 text-center">Description</th>
                                            <th class="per5 text-center">Qty</th>
                                            <th class="per25 text-center">Unit Price</th>
                                            <th class="per25 text-center">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                      { selectedValue.bill_of_materials ? 
                                       selectedValue.bill_of_materials.map((item,i) => {
                                        return (
                                                     <tr>
                                                     <td>{item.description[i]!=null?item.description[i]:""}</td>
                                                     <td class="text-center">{item.quantity[i]!=null?item.quantity[i]:""}</td>
                                                     <td class="text-center">{item.unit_price[i]!=null?item.unit_price[i]:""}</td>
                                                     <td class="text-center">{item.price[i]!=null?item.price[i]:""}</td>
                                                 </tr>
                                      );}) : ""}
                            
                                        
                                    </tbody>
                                    <tfoot>
                                       <tr>
                                            <th colspan="3" class="text-right">Currency:</th>
                                            
                                            <th class="text-center">{selectedValue.currency}</th>
                                        </tr>
                                        <tr>
                                            <th colspan="3" class="text-right">Sub Total:</th>
                                            
                                            <th class="text-center">{selectedValue.sub_total}</th>
                                        </tr>
                                        <tr>
                                            <th colspan="3" class="text-right">Tax</th>
                                            
                                            <th class="text-center">{selectedValue.tax}</th>
                                        </tr>
                                        <tr>
                                            <th colspan="3" class="text-right">Discount</th>
                                            
                                            <th class="text-center">{selectedValue.discount}</th>
                                        </tr>
                                        <tr>
                                            <th colspan="3" class="text-right">Total:</th>
                                            
                                            <th class="text-center">{selectedValue.total}</th>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                        <div class="invoice-footer mt25">
                            <p class="text-center">Generated on {selectedValue.invoice_date}</p>
                        </div>
                    </div>

                </div>

            </div>
        </div>

    </div>

</div>
</div>
<DialogActions>
          <Button variant="outlined" color="success" onClick={(event) => {
                  event.preventDefault();
                  approve(selectedValue);
                }}>Accept</Button>
          <Button variant="contained" color="error" onClick={(event) => {
                  event.preventDefault();
                  reject(selectedValue);
                }}>Reject</Button>
        </DialogActions>
      </Dialog>

  
  </Grid>
</Grid>
      </Box>
    </Box>
  )
}

export default HeadDashboard