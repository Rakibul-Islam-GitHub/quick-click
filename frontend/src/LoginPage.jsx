import React, { useContext, useEffect, useState } from "react";
import "./Register.css";
import {Button, TextField} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { doLogin } from "./api-call/api";
import { AuthContext } from "./context/AuthContext";

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const LoginPage = () => {
  //alertconfig
  const [alertConfig, setAlertConfig] = useState({msg:'', severity:'warning'})
  const [alertopen, setAlertOpen] = useState(false);

  const handleAlertClick = () => {
    setAlertOpen(true);
  };

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setAlertOpen(false);
  };


  const { setUser,setAuthenticated , authenticated} = useContext(AuthContext)
   const navigate= useNavigate()
    const handleSubmit = (e) => {
      e.preventDefault()
      const email= e.target.email.value
      const password= e.target.password.value
      if (email==='' || password==='') {
        
        setAlertConfig({msg: 'please fill up all fields!', severity:'warning'})
        handleAlertClick()
        return
      }
      doLogin({email, password}, (res)=>{
        
        if (res) {
        localStorage.setItem("user", JSON.stringify(res));
        localStorage.setItem("authenticated", true);
    setUser(res);
    setAuthenticated(true)
    navigate('/')
          
        }else{
          setAlertConfig({msg: 'Wrong email or password!', severity:'error'})
        handleAlertClick()
        }
      })
    }
    useEffect(()=>{
      if (authenticated) {
        navigate('/')
      }
    },[authenticated, navigate])
  
  return (
   
    <div className="login-container">
      <Snackbar anchorOrigin={{ vertical:'top', horizontal:'right' }} open={alertopen} autoHideDuration={3000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alertConfig.severity} sx={{ width: '100%' }}>
          {alertConfig.msg}
        </Alert>
      </Snackbar>

      <div className="login-form">
        <div>
          <h1 className="logoName"><Link to={'/'}>Quick Click</Link></h1>
          
        <h2 className="welcomeBack">Welcome Back</h2>
        </div>
        <form className="login-form-inner" onSubmit={(e)=>handleSubmit(e)}>

          <div>
          <div className="form-group">
          <TextField  className="inputField" type="email" name="email" required id="standard-read-only-input"label="Email"variant="standard"/>
          </div>

          <div className="form-group">
          <TextField  className="inputField" required name="password" label="Password" type="password"autoComplete="current-password"variant="standard"/>

          <Link to={'/forgetpassword'} className="forgetpassword">
            forget password?
          </Link>
          </div>
          </div>
         
          
          <div>
          <Button className="loginButton" type="submit" variant="contained" color="error">Login</Button>
          </div>
          </form>
          <Link to={'/register'}>
          <p className="newuser">New user ? <span className="signup">SignUp</span></p></Link>
      </div>
    </div>
  );
};

export default LoginPage;