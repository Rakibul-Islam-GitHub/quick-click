import React, { useContext, useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import "./Feed.css";
import imageProfile from "./images/avatar.png";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { BsThreeDotsVertical} from "react-icons/bs";
import { FcRightDown2} from "react-icons/fc";
import {
  AiOutlineUpSquare,
  AiFillUpSquare,
  AiOutlineDownSquare,
  AiFillDownSquare,
} from "react-icons/ai";
import {
  Card,
  CardActionArea,
  Typography,
  CardActions,
  Avatar,
} from "@mui/material";
import {
  doComment,
  doDownvote,
  doLikeToComment,
  doReply,
  doUpvote,
  getComment,
  getPost,
  getReply,
} from "./api-call/api";
import { AuthContext } from "./context/AuthContext";


import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import EditPostModal from "./EditPostModal";
import DeletePostModal from './DeletePostModal'
import ScrollUpload from "./ScrollUpload";

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};



const Feed = ({ posts, setPosts }) => {
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

  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState([]);
  const [expandedComments, setExpandedComments] = useState({});
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [showActionBtn, setShowActionBtn] = useState(false);
  const [selectedPost, setSelectedPost]=useState({})

  // modal settings
  const [open, setOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen]=useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  useEffect(() => {

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
          setShowTopBtn(true);
      } else {
          setShowTopBtn(false);
      }
  });


    getComment((res) => {
      setComments(res);
    });
  }, []);


const handlePost=()=>{
  handleOpen()
}

const handleEdit=(data)=>{
setSelectedPost(data)
setEditModalOpen(true)
}
const handleDelete=(data)=>{
  setSelectedPost(data)
  setDeleteModalOpen(true)
  }

  const toggleComments = (postId) => {
    setExpandedComments((prevExpandedComments) => {
      const newExpandedComments = { ...prevExpandedComments };
      newExpandedComments[postId] = !newExpandedComments[postId];

      return newExpandedComments;
    });
  };

  const handleHeartLike = (cmtid) => {
    if (!user.token) {
      alert("please login to like this comment!");
    }
    doLikeToComment(cmtid, user.token, (res) => {
      if (res) {
        
        getComment((res2) => {
          setComments(res2);
        });
      }
    });
  };
  const handleUpvote = (postid) => {
    if (!user.token) {
      alert("please login to upvote this post!");
    }
    doUpvote(postid, user.token, (res) => {
      if (res) {
        
        getPost((res2) => {
          setPosts(res2.reverse());
        });
      }
    });
  };

  const handleDownvote = (postid) => {
    if (!user.token) {
      alert("please login to downvote this post!");
    }
    doDownvote(postid, user.token, (res) => {
      if (res) {
       
        getPost((res2) => {
          setPosts(res2.reverse());
        });
      }
    });
  };

  const handleComment = (e, postid) => {
    e.preventDefault();
    if (!user.token) {
      alert("You have to login first to comment!");
    }
    const comment = e.target.comment.value;
    if (comment === "") {
      
      setAlertConfig({msg: 'Comment cannot be empty', severity:'warning'})
      handleAlertClick()
      return
      
    }

    doComment({ comment, postid }, user.token, (res) => {
      if (res) {
        e.target.reset();
        getComment((res2) => {
          setComments(res2);
        });
      }
    });
  };
  const handleReply = (e, commentid, postid) => {
    e.preventDefault();
    if (!user.token) {
      alert("You have to login first to reply!");
    }
    const reply = e.target.reply.value;
    if (reply === "") {
      setAlertConfig({msg: 'Reply cannot be empty', severity:'warning'})
      handleAlertClick()
      
      
      return;
    }


    doReply({ reply, postid, commentid }, user.token, (res) => {
      if (res) {
        e.target.reset();
        getReply((res2) => {
          setReplies(res2);
        });
      }
    });
  };

  const getTimeDifference = (createdAt) => {
    const currentTime = new Date();
    const postTime = new Date(createdAt);
    const timeDiffInSeconds = Math.floor((currentTime - postTime) / 1000);

    if (timeDiffInSeconds < 60) {
      return `${timeDiffInSeconds} seconds ago`;
    } else if (timeDiffInSeconds < 3600) {
      const minutes = Math.floor(timeDiffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (timeDiffInSeconds < 86400) {
      const hours = Math.floor(timeDiffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(timeDiffInSeconds / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
  };

  return (
    <>



    {showTopBtn && <div>
      <button onClick={handlePost} className="scroll-btn">
        +
      </button>
    </div> }

    <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >

        <Fade in={open}>
          <Box sx={style}>
            
            <ScrollUpload setPosts={setPosts} handleClose={handleClose}/>
            {/* <AddPostModal style={style}/> */}
          </Box>
        </Fade>
      </Modal>

{
  editModalOpen && <EditPostModal style={style} editModalOpen={editModalOpen} setEditModalOpen={setEditModalOpen} selectedPost={selectedPost} setPosts={setPosts}/>
}

{
  deleteModalOpen && <DeletePostModal style={style} deleteModalOpen={deleteModalOpen} setDeleteModalOpen={setDeleteModalOpen} selectedPost={selectedPost} setPosts={setPosts}/>
}

      {posts.length > 0 &&
        posts.map((single) => (
          <div key={single._id} className="feed-main">

<Snackbar anchorOrigin={{ vertical:'top', horizontal:'right' }} open={alertopen} autoHideDuration={3000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alertConfig.severity} sx={{ width: '100%' }}>
          {alertConfig.msg}
        </Alert>
      </Snackbar>


            <div className="post-home">
              <div className="single-post">
              <div className="post-top">
                    <Typography
                      component={"span"}
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: "flex",
                        padding: "10px",
                        justifyContent: "space-between",
                        alignItems: "center", // corrected typo in 'alignItems'
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          className="ProfilePhoto"
                          alt="Remy Sharp"
                          src={imageProfile}
                        />
                        <div
                          className="nameTime"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            marginLeft: 5,
                          }}
                        >
                          <span className="name">{single.postby.name}</span>
                          <span className="time">
                            {getTimeDifference(single.createdAt)}
                          </span>
                        </div>

                      </div>
                    </Typography>
                    {single.postby._id === user.id && <div className="action-section" onClick={()=>setShowActionBtn(!showActionBtn)}>
                          <BsThreeDotsVertical/>
                            {
                              showActionBtn &&                          
                               <div className="action-btn">

                                    <Button variant="outlined" color="success" size="small" startIcon={<EditIcon />} onClick={()=>handleEdit(single)}>
                                      Edit
                                    </Button>
                              <Button variant="outlined" color="error" size="small" startIcon={<DeleteIcon />} onClick={()=>handleDelete(single)}>
                                Delete
                              </Button>
                            </div>
                            }
                          </div>}
                  </div>
                <Card className="post">

                  <CardActionArea>
                    <div className="post-wrapper">
                      <p>{single.description}</p>
                      <img
                        className="imagePost"
                        src={single.image}
                        alt="postimage"
                      />
                      <div className="name-time-container"></div>
                    </div>
                  </CardActionArea>
                  <CardActions
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      className="vote-outer"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      {single.upvote.includes(user.id) ? (
                        <>
                          <span className="numbers-up">
                            {single.upvote.length}
                          </span>
                          <AiFillUpSquare
                            className="liked-icon"
                            cursor="pointer"
                            onClick={() => handleUpvote(single._id)}
                          />
                          <Button
                            className="liked-btn"
                            onClick={() => handleUpvote(single._id)}
                            size="small"
                            color="primary"
                            sx={{ textTransform: "none", color: "green" }}
                          >
                            UPVOTE
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="numbers-up">
                            {single.upvote.length}
                          </span>
                          <AiOutlineUpSquare
                            className="liked-icon"
                            cursor="pointer"
                            onClick={() => handleUpvote(single._id)}
                          />
                          <Button
                            onClick={() => handleUpvote(single._id)}
                            size="small"
                            color="primary"
                            sx={{ textTransform: "none", color: "green" }}
                          >
                            UPVOTE
                          </Button>
                        </>
                      )}

                      {single.downvote.includes(user.id) ? (
                        <>
                          <span className="numbers-down">
                            {single.downvote.length}
                          </span>
                          <AiFillDownSquare
                            className="disliked-icon"
                            cursor="pointer"
                            onClick={() => handleDownvote(single._id)}
                          />
                          <Button
                            className="disliked-btn"
                            onClick={() => handleDownvote(single._id)}
                            size="small"
                            color="primary"
                            sx={{ textTransform: "none", color: "red" }}
                          >
                            DOWNVOTE
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="numbers-down">
                            {single.downvote.length}
                          </span>
                          <AiOutlineDownSquare
                            className="disliked-icon"
                            cursor="pointer"
                            onClick={() => handleDownvote(single._id)}
                          />

                          <Button
                            onClick={() => handleDownvote(single._id)}
                            size="small"
                            color="primary"
                            sx={{ textTransform: "none", color: "red" }}
                          >
                            DOWNVOTE
                          </Button>
                        </>
                      )}
                    </div>
                  </CardActions>
                </Card>
              </div>
              <div className="comment-main">
                <div className="writeComment">
                  <form
                    className="comment-box"
                    onSubmit={(e) => handleComment(e, single._id)}
                  >
                    <TextField
                      className=".commentInput"
                      // multiline
                      // rows={1}
                      size="small"
                      name="comment"
                      placeholder="Write your comment here.."
                      // label="Write your comment here..."
                      variant="outlined"
                      // style={{ width: 300 }}
                      sx={{ "& fieldset": { border: "none" } }}
                    />
                    {!user.token ? (
                      <span>
                        <Button
                          disabled
                          className="loginButton"
                          type="submit"
                          variant="contained"
                          color="primary"
                        >
                          Submit
                        </Button>
                        <span className="comment-disable-msg">
                          You have to login to comment here!
                        </span>
                      </span>
                    ) : (
                      <Button
                        type="submit"
                        sx={{
                          color: "white",
                          backgroundColor: "#ff7f50",
                          textTransform: "none",
                          marginLeft: 43,
                          alignItems:"right",
                    
                          "&:hover": {
                            backgroundColor: "white",
                            color: "#ff7f50",
                            border: "1px solid #ff7f50",
                          },
                        }}
                        className="loginButton"
                        variant="contained"
                        color="primary"
                      >
                        Comment
                      </Button>
                    )}
                  </form>
                </div>
                <div className="comment-section">
                  <div className="comment-list">
                    {comments.length > 0 &&
                      comments
                        .filter((el) => el.postid === single._id)
                        .reverse() // Reverse the comments array
                        .slice(
                          0,
                          expandedComments[single._id] ? comments.length : 2
                        )
                        .map((cmt) => (
                          <li key={cmt._id} className="single-comment">
                            <div className="cmt-wrapper">
                            <div className="cmt-user">
                            <span className="comment-name">{cmt.username}</span>
                            <span className="comment-time">
                              {getTimeDifference(cmt.createdAt)}
                            </span>
                            </div>
                            
                            <p className="comment">{cmt.comment}</p>

                            <div className="reply-btn">
                              <span title="reply">
                               
                                reply here
                                <FcRightDown2/>
                              </span>
                              <div >
                              <form className="reply-input" onSubmit={(e) => handleReply(e, cmt._id, single._id)}>
                              <TextField
                      className=".commentInput"
                      size="small"
                      name="reply"
                      placeholder="Write your repy here.."
                      variant="outlined"
                      sx={{ "& fieldset": { border: "none" } }}
                    />
                    
                    <Button
                        type="submit"
                        size="small"
                        sx={{
                          color: "white",
                          backgroundColor: "#ff7f50",
                          textTransform: "none",
                          marginLeft: 43,
                          alignItems:"right",
                    
                          "&:hover": {
                            backgroundColor: "white",
                            color: "#ff7f50",
                            border: "1px solid #ff7f50",
                          },
                        }}
                        className="replybtn"
                        variant="contained"
                        color="primary"
                      >
                        Reply
                      </Button>
                      
                              </form>
                              
                              </div>
                            </div>
                            {replies.length >0 && replies.filter(e=> e.commentid=== cmt._id).reverse().map((rep=>(
                              <div key={rep._id} className="comment-reply-list">
                              <div>
                                <span className="comment-name">{rep.username}</span>
                            <span className="comment-time">
                              {getTimeDifference(rep.createdAt)}
                            </span>
                            <p className="comment">{rep.reply}</p>
                            </div>
                              
                            </div>
                            )))}
                            </div>
                            

                            <div className="comment-like">
                              {cmt.like && cmt.like.includes(user.id)? 
                              <>
                              <span className="heart-count">{cmt.like.length}</span>
                              <AiFillHeart onClick={() => handleHeartLike(cmt._id)}/>
                              </> :
                              <>
                              <span className="heart-count">{cmt.like? cmt.like.length : 0}</span>
                              <AiOutlineHeart onClick={() => handleHeartLike(cmt._id)}/>
                              </> }
                              
                            </div>
                            
                          </li>
                        ))}
                  </div>
                </div>
                {comments.length > 2 && (
                  <span
                    className="viewComments"
                    onClick={() => toggleComments(single._id)}
                  >
                    {expandedComments[single._id]
                      ? "Hide comments"
                      : "Show all comments"}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default Feed;
