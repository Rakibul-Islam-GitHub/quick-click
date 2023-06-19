import React, { useContext, useState } from 'react';

import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { Button } from "@mui/material";
import { Typography } from '@mui/material';
import { deletePost, getPost } from './api-call/api';
import { AuthContext } from './context/AuthContext';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AddPostModal = ({style, deleteModalOpen, setDeleteModalOpen, selectedPost, setPosts}) => {
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
  const handleOpen = () => setDeleteModalOpen(true);
  const handleClose = () => setDeleteModalOpen(false);


  const handleDeleteSubmit=()=>{
    
    deletePost(selectedPost._id, user.token, (res) => {
      if (res) {
        setAlertConfig({msg: 'Post deleted successfully!', severity:'success'})
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
        open={deleteModalOpen}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={deleteModalOpen}>
          <Box sx={style}>
            <Typography id="transition-modal-title" className='edit-post-title' variant="h6" component="h2">
             Want to delete this post?
            </Typography>
            <Button  className="editSubmitBtn" type="submit" variant="contained" size="small" color="error" onClick={handleDeleteSubmit}>Confirm</Button> 

          </Box>
        </Fade>
      </Modal>
        </>
    );
};

export default AddPostModal;