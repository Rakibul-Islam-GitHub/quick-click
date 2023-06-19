import React, { useContext, useState } from "react";
import "./Upload.css";
import { Button, TextField } from "@mui/material";
import imageProfile from "./images/avatar.png";
import { AuthContext } from "./context/AuthContext";

import {
  Card,
  CardActionArea,
  Typography,
  CardActions,
  Avatar,
} from "@mui/material";
import { doAddPost, getPost } from "./api-call/api";

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ScrollUpload = ({setPosts, handleClose}) => {
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


  const { user} = useContext(AuthContext)
  const [selectedImage, setSelectedImage] = useState(null);
  const [image, setImage] = useState(null);
  const [textInput, setTextInput] = useState("");

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setSelectedImage(URL.createObjectURL(file));
    setImage(file)
   
  };

  const handleTextInputChange = (event) => {
    setTextInput(event.target.value);
  };

  const handleSubmit=()=>{
    
    if (image===null || textInput==='') {
     
      setAlertConfig({msg: 'please add an image and caption', severity:'warning'})
        handleAlertClick()
        return
    }
    const formData= new FormData()
    formData.append('image', image)
    formData.append('description', textInput)
    doAddPost(formData, user.token, (res)=>{
        
      if (res) {
        
        getPost((res2) => {
          setPosts(res2.reverse())
          setSelectedImage(null)
          setImage(null)
          setTextInput('')
          handleClose && handleClose()
      });
      }else{alert('Server error')}
    })
  }

  return (
    <div className="feed-main">
      <Snackbar anchorOrigin={{ vertical:'top', horizontal:'right' }} open={alertopen} autoHideDuration={3000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alertConfig.severity} sx={{ width: '100%' }}>
          {alertConfig.msg}
        </Alert>
      </Snackbar>

      <div className={handleClose? '' : "post-home"}>
        <div className="single-post">
          <Card className="post">
            <CardActionArea>
              <div className="image-container">
                <Typography
                  component={'span'}
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: "flex",
                    padding: "10px",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {user && <Avatar className="ProfilePhoto" alt="Remy Sharp" src={imageProfile} />}
                    <span className="name">{user && user.name}</span>
                  </div>
                  <div>
                    <label  htmlFor="upload-input-scroll">
                      <Button className="uploadBtn-scroll" component="span" sx={{color:'white', backgroundColor:'#00B4FF',textTransform:'none' , '&:hover': {
      backgroundColor: 'white', color: '#00B4FF', border:'2px solid #00B4FF'} }}>
                        upload Image
                      </Button>
                      <input
                        id="upload-input-scroll"
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                </Typography>
                <TextField
                  multiline
                  rows={2}
                  value={textInput}
                  onChange={handleTextInputChange}
                  label="Caption"
                  variant="outlined"
                  fullWidth
                />
                {selectedImage && (
                  <img className="imagePost" src={selectedImage} alt="postimage" />
                )}
                <div className="name-time-container"></div>
              </div>
            </CardActionArea>
            <CardActions
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >

             

              {!user.token ?  <span>
                  <Button disabled className="loginButton" type="submit" size="small" color="primary">POST</Button> 
                  <span className="comment-disable-msg">You need to login to post here!</span>
                </span> :
                <Button onClick={handleSubmit}  sx={{color:'white', backgroundColor:'#ff7f50',textTransform:'none' , '&:hover': {
                  backgroundColor: 'white', color: '#ff7f50', border:'2px solid #ff7f50'} }} type="submit" className="loginButton"   color="primary">POST</Button>
                }
    
            </CardActions>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ScrollUpload;
