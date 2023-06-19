import React, { useContext, useState } from 'react';

import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { Button, TextField } from "@mui/material";
import { Typography } from '@mui/material';
import { AuthContext } from './context/AuthContext';
import { editPost, getPost } from './api-call/api';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const AddPostModal = ({style, editModalOpen,setEditModalOpen, selectedPost,setPosts}) => {
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


  const { user } = useContext(AuthContext);
  // modal settings
  const handleOpen = () => setEditModalOpen(true);
  const handleClose = () => setEditModalOpen(false);
  const [textInput, setTextInput] = useState(selectedPost.description);


  const handleTextInputChange = (event) => {
    setTextInput(event.target.value);
  };

  const handleEditSubmit=()=>{
    editPost(textInput, selectedPost._id, user.token, (res) => {
      if (res) {
        setAlertConfig({msg: 'Post updated successfully!', severity:'success'})
        handleAlertClick()
        getPost((res2) => {
          handleClose()
          setPosts(res2.reverse());
        });
      }
    });
  }

    return (
        <>
        <Snackbar anchorOrigin={{ vertical:'top', horizontal:'right' }} open={alertopen} autoHideDuration={3000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alertConfig.severity} sx={{ width: '100%' }}>
          {alertConfig.msg}
        </Alert>
      </Snackbar>

             <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={editModalOpen}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={editModalOpen}>
          <Box sx={style}>
            <Typography id="transition-modal-title" className='edit-post-title' variant="h6" component="h2">
              Edit your post
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
                 <Button onClick={handleEditSubmit}  className="editSubmitBtn" type="submit" variant="contained" size="small" color="secondary">Submit</Button> 

            {/* <Upload handleClose={handleClose}/> */}
          </Box>
        </Fade>
      </Modal>
        </>
    );
};

export default AddPostModal;