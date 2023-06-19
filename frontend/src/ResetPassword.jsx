import React, { useContext, useEffect, useState } from "react";
import "./Register.css";
import {Button, TextField} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { doLogin, updatePassword } from "./api-call/api";
import { AuthContext } from "./context/AuthContext";

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const ResetPassword = () => {
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



  const {  authenticated} = useContext(AuthContext)
  const [isError, setIsError] = useState('')
   const navigate= useNavigate()
   const search = useLocation().search;
   const userid = new URLSearchParams(search).get("user");
   const resetcode = new URLSearchParams(search).get("code");
    const handleSubmit = (e) => {
      e.preventDefault()
      const password= e.target.password.value
      const conpassword= e.target.conpassword.value
    
      if (password==='' || conpassword==='') {
        setIsError('Invalid input')
        return
      }
      if (password !== conpassword) {
        setIsError(`password doesn't match`)
        return
      }

      updatePassword({userid, resetcode, password}, (res)=>{
        
        if (res) {
        e.target.reset()
    
    setAlertConfig({msg: 'password has been updated. please login now', severity:'success'})
        handleAlertClick()
    navigate('/login')
          
        }else{
          setAlertConfig({msg: 'Something went wrong', severity:'error'})
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
          <TextField  className="inputField"required name="password" label="Password" type="password"autoComplete="current-password"variant="standard"/>

          </div>

          <div className="form-group">
          <TextField  className="inputField" required name="conpassword" label="Confirm Password" type="password" autoComplete="current-password"variant="standard"/>
{isError && <span className="errorMessage">*{isError}</span> }
          </div>

         
          {/* <button type="submit">Login</button> */}
          
          <Button className="loginButton" type="submit" variant="contained" color="error">Submit</Button>
          </form>
          <Link to={'/login'}>
          <p className="newuser">remember your password ? <span className="signup">Signin</span></p></Link>
      </div>
    </div>
  );
};

export default ResetPassword;