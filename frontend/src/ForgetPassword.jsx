import React, { useContext, useEffect, useState } from "react";
import "./Register.css";
import {Button, TextField} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { resetPassword } from "./api-call/api";


import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const ForgetPassword = () => {
  const {  authenticated} = useContext(AuthContext)
  const [isError, setIsError] = useState('')
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

   const navigate= useNavigate()

    const handleSubmit = (e) => {
      e.preventDefault()
      const email= e.target.email.value
     
      if (email==='') {
        setAlertConfig({msg: 'Invalid input. please write your email', severity:'warning'})
        handleAlertClick()
        return
      }

      resetPassword({email}, (res)=>{
        
        if (res) {
        
          setAlertConfig({msg: 'Reset code sent successfully! please check', severity:'success'})
          handleAlertClick()
          e.target.reset()
          
        }else{
          
          setIsError('You do not have account with this email.')
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
          
        <h2 className="welcomeBack">Reset Password</h2>
        </div>
        <form onSubmit={(e)=>handleSubmit(e)}>

          <div className="form-group">
          <TextField  className="inputField" type="email" name="email"  id="standard-read-only-input"label="Email"variant="standard"/>
          {isError && <span className="errorMessage">*invalid input</span>}
          </div>

         
          {/* <button type="submit">Login</button> */}
          
          <Button className="loginButton" type="submit" variant="contained" color="error">Submit</Button>
          </form>
          <Link to={'/login'}>
          <p className="newuser">Already have account ? <span className="signup">Signin</span></p></Link>
      </div>
    </div>
  );
};

export default ForgetPassword;