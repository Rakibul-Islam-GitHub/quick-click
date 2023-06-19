import React from "react";
import "./Register.css";
import {Button, TextField} from "@mui/material";
import { Link } from "react-router-dom";
const Register = () => {
  return (
    
    <div className="login-container">
      <div className="login-form">
        <div>
          <h1 className="logoName">Quick Click</h1>
          {/* <img className="logoImage" src={logoImage}/> */}
        <h2 className="welcomeBack">Welcome Back</h2>
        </div>
        <form>
          <div className="form-group">
          <TextField  className="inputField" type="email" required id="standard-read-only-input"label="Email"variant="standard"/>
            <span className="errorMessage">*Incorrect Email</span>
          </div>
          <div className="form-group">
          <TextField  className="inputField"required id="standard-password-input"label="Password" type="password"autoComplete="current-password"variant="standard"
    />
            <span className="errorMessage">*Incorrect Password</span>
          </div>
          {/* <button type="submit">Login</button> */}
          <Link to={'/home'}>
          <Button className="loginButton" color="error"  variant="contained">Login</Button></Link>
          </form>
          <Link to={'/register'}>
          <p className="newuser">New user ? <span className="signup">SignUp</span></p></Link>
      </div>
    </div>
  );
};

export default Register;