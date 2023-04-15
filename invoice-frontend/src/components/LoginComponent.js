import React from 'react';
import { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import './StylesLogin.css'
import { ScopedCssBaseline} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import URI from "../utils/request";
import axios, * as others from "axios";
import jwt_decode from "jwt-decode";
import { Link,useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';

function Login() {
    const navigate = useNavigate();
    const [light, setLight] = useState(true);
    const [Loginstatus,setLoginstatus] = useState('');
    const [showalert,setshowalert] = useState(false);
    const [alertcontent,setalertcontent] = useState("")
    const themeLight = createTheme({
        palette: {
          background: {
            default: "#F6F1F1"
          },
          text: {
            default: "#000"
          }
        }
      });

    useEffect(()=>{
      if (localStorage.getItem('uid')){
        navigate('/dashboard')
      }


    },[]);
    //   const themeDark = createTheme({
    //     palette: {
    //       background: {
    //         default: "#000"
    //       },
    //       text: {
    //         primary: "#fff"
    //       }
    //     }
    //   });
    
    const handleSubmit = async (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      console.log({
        uid: data.get("uid"),
        password: data.get("password"),
      });
      let res = {
        data: {
          message: "Failure",
          token: "",
        },
      };
      data.append("uid",data.get("uid"))
      data.append("password",data.get("password"))
      res = await axios.post(URI + "login", data);
      console.log("login submit res",res)
      if (res.data.message == "Success") {
        setLoginstatus("success")
        setalertcontent("Login Successfull")
        setshowalert(true)

        let decoded = {
          name: "",
          uid: "",
          role: "",
          dept: "",
        };
        decoded = jwt_decode(res.data.token);
        localStorage.setItem("name", decoded.name);
        localStorage.setItem("role", decoded.role);
        localStorage.setItem("uid", decoded.uid);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("dept", decoded.dept);
        
        if (decoded.role == "Practice head") {
          navigate("/head");
        }
        if (decoded.role == "Admin") {
          navigate("/admin");
        } else {
          setTimeout(() => {
            navigate("/dashboard"); //this.props.navigation.navigate('Login')
        }, 200);
        }
      } else {
        setLoginstatus("error")
        setalertcontent("Invalid Username or Password")
        setshowalert(true)
      }
    };

    return (
    <ThemeProvider theme={themeLight}>
      { showalert ? <div className='container'><div className='col-lg-4'><Alert size="small" severity={Loginstatus}>{alertcontent}</Alert></div></div> : ''}
      <div className='container-fluid py-5 my-3'>
       <div className='row'>
        <div className='col-lg-6 text-center text-start d-flex flex-column justify-content-center'>
        <h1 className="my-5 display-3 fw-bold ls-tight px-3">
            The best offer <br />
            <span className="text-primary">for your business</span>
          </h1>
          <p className='px-3' style={{color: 'hsl(217, 10%, 50.8%)'}}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Eveniet, itaque accusantium odio, soluta, corrupti aliquam
            quibusdam tempora at cupiditate quis eum maiores libero
            veritatis? Dicta facilis sint aliquid ipsum atque?
          </p>
        </div>
         <div className='col-lg-6 my-5 px-5'>
         <div class="card">
         <div class="card-body">
         <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: '#000000' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="uid"
              label="Username"
              name="uid"
              autoComplete="uid"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
      </div>
      </div>
         </div>

       </div>
      </div>
      </ThemeProvider>

    );
  }

export default Login;
  