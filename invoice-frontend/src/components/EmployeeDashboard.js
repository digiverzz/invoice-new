import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { useState, useEffect} from "react";
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
import LogoutIcon from '@mui/icons-material/Logout';
import Skeleton from '@mui/material/Skeleton';


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






export default function MiniDrawer() {

  useEffect(()=>{
    
    if (!localStorage.getItem('uid')){
      navigate('/login')
    }
  },[]);
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(true);
  const [total, setTotal] = useState(0);
  const [acctotal, setaccTotal] = useState(0);
  const [rejtotal, setrejTotal] = useState(0);
  const [pentotal, setpenTotal] = useState(0);
  const [automobileCount,setautomobileCount] = useState(0);
  const [electronicsCount,setelectronicsCount] = useState(0);
  const [appliancesCount,setappliancesCount] = useState(0);
  const [healthcareCount,sethealthcareCount] = useState(0);
  const [beautyCount,setbeautyCount] = useState(0);
  const [foodCount,setfoodCount] = useState(0);
  const [industryCount,setindustryCount] = useState(0);
  const [tabData,setTabData] = useState([])
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
      const formData2 = new FormData();
      formData2.append("token", localStorage.getItem("token"));
      try {
        res = await axios.post(URI + "requests", formData1);
        console.log("requests",res['data']);
        
        setTotal(res['data'].length)
        setWholeData(res['data'])

        console.log("table data",wholeData)
        const tempTable = [];
        for(let i=0;i<res['data'].length;i++){
          console.log(JSON.parse(res['data'][i].data).category)
          const cat = JSON.parse(res['data'][i].data).category
          const parseddata = JSON.parse(res['data'][i].data)
          tempTable.push({"Date":getCurrentDate(),"Category":cat,"Amount":Number(parseddata.total).toFixed(2),"currency":parseddata.currency,"status":res['data'][i].status[0].toUpperCase() + res['data'][i].status.slice(1)})
          
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
      
        setautomobileCount(Automotive)
        setappliancesCount(Appliances)
        setbeautyCount(beauty)
        sethealthcareCount(Health)
        setindustryCount(industry)
        setfoodCount(food)
        setelectronicsCount(Electronics)
        setaccTotal(acctot)
        setrejTotal(rejtot)
        setpenTotal(pentot)
        console.log("tabData",tabData)
        console.log([automobileCount,electronicsCount,appliancesCount,industryCount,foodCount,healthcareCount,beautyCount])
      } catch (error) {
        console.log(error);
      }
      
    }
    fetchData()
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
      <AppBar position="fixed" open={open} style={{backgroundColor:"#ffff",color:"#000000"}}>
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
            {
              localStorage.getItem('role')=="Practice Lead" ?
              <Button     color="primary" style={{

                marginRight:"15px",
                borderRadius:"5px",
                
                }}
                variant="contained" onClick={()=> navigate('/approve')}>Pending Approvals </Button> : ""
            }
            <Button     color="primary" style={{

        marginRight:"15px",
        borderRadius:"5px",
        
    }}
    variant="contained" onClick={()=> navigate('/uploadfile')}>Create Claim</Button>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
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
        <Box>
                    <Grid container xs={11} justifyContent={"center"}>
                        <Grid container xs={11} justifyContent={"center"} padding={2} sx={{alignItems:"center"}}>
                    
                            <Avatar sx={{ width: 80, height: 80, background:"#3498DB" }}>{localStorage.getItem('name')[0]}</Avatar>
                        </Grid>
                    
                        <Grid xs={12} textAlign={"center"} padding={2}>
                            <Typography color={"#FFFFFF"}>{localStorage.getItem('name')}</Typography>
                        </Grid>
                    </Grid>
                </Box>  
            
        <Divider />
        <List>
        <ListItem key="Dashboard" disablePadding sx={{ display: 'block',
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
                <ListItemText primary="Dashboard" sx={{ opacity: open ? 1 : 0 }} />
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
        {/* <ListItem key="Dark Mode" disablePadding sx={{ display: 'block',
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
            </ListItem> */}
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
  {
    total ? (
      <Grid item xs={3}>
      <div class="card" id="storageCard">
        <div class="card-title">Total Claim Requests</div>
        <div class="card-icon"><AccountBalanceWalletIcon /></div>
        <div class="card-data"><h4>{total}</h4></div>
        
      </div>
</Grid>
    ) :     (<Grid item xs={3}><Skeleton sx={
      {
        borderRadius:4
      }
    }  variant="rounded" animation="wave" width={240} height={120} /></Grid>)

  }
    {
    acctotal ? (
      <Grid item xs={3}>
      <div class="card" id="loveCard" >
              <div class="card-title">Total claim Approved</div>
              <div class="card-icon"><CheckCircleIcon /></div>
              <div class="card-data"><h4>{acctotal}</h4></div>
              
            </div>
      </Grid>
    ) :     (<Grid item xs={3}><Skeleton sx={
      {
        borderRadius:4
      }
    }  variant="rounded" animation="wave" width={240} height={120} /></Grid>)

  }
      {
    rejtotal ? (
      <Grid item xs={3}>
      <div class="card" id="pizzaCard">
              <div class="card-title">Total claim Rejected</div>
              <div class="card-icon"><DangerousIcon /></div>
              <div class="card-data"><h4>{rejtotal}</h4></div>
              
            </div>
      </Grid>
    ) :     (<Grid item xs={3}><Skeleton sx={
      {
        borderRadius:4
      }
    }  variant="rounded" animation="wave" width={240} height={120} /></Grid>)

  }
        {
    rejtotal ? (

      <Grid item xs={3}>
      <div class="card" id="gameCard">
              <div class="card-title">Total claim Pending</div>
              <div class="card-icon"><PendingActionsIcon /></div>
              <div class="card-data"><h4>{pentotal}</h4></div>
              
            </div>
      </Grid>
    ) :     (<Grid item xs={3}><Skeleton sx={
      {
        borderRadius:4
      }
    }  variant="rounded" animation="wave" width={240} height={120} /></Grid>)

  }
  
</Grid>


<Grid container spacing={5} id="charttype">
{
    tabData.length>0 ? (
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
             </TableRow>
           </TableHead>
           <TableBody>
             {tabData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
               <StyledTableRow key={row.name}>
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
     
     </Grid>

    ) :     (<Grid item xs={3}><Grid ></Grid><Skeleton variant="rounded"  sx={
      {
        borderRadius:1
      }
    }  animation="wave" width={1060} height={400} /></Grid>)

  }

</Grid>
      </Box>
    </Box>
  );
}