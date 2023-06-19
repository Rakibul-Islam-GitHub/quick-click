const router = require("express").Router();
const Comment = require("../models/commentModel");
const User = require("../models/userModel");
const { verifyToken } = require("./verifyToken");

// add comment
router.post("/add",verifyToken,  async (req, res) => {

   try {
    
     const commentdone = new Comment({
        postid: req.body.postid,
        commentby: req.user._id,
        username: req.user.name,
        comment: req.body.comment,
     });
    const savedComment = await commentdone.save();
    res.status(200)
      .send(
        savedComment
      );
  } catch (err) {
    console.log(err);
  }
  
});


//get all comment 
router.get("/", async (req, res) => {
  
  try {
      const cmt = await Comment.find({  })
      
      res.status(200).json(cmt)
  } catch (err) {
    res.status(500).json(err);
  }
});
//get comment by postid
router.get("/:id", async (req, res) => {
  
  try {
      const cmt = await Comment.find({ postid: req.params.id })
      
      res.status(200).json(cmt)
  } catch (err) {
    res.status(500).json(err);
  }
});


router.put("/liketocomment/:id", verifyToken, async (req, res) => {

  const islike =await Comment.find({$and:[{_id: req.params.id}, {like: {$in: [req.user.id]}}]})

  if (islike.length > 0) {
   
    const post= await Comment.findOneAndUpdate(
      {
          _id: req.params.id
      },
      {
        $pull: { "like": req.user.id }
      },
      { new: true }
    );
      
    return res.status(200).json(post);
    
  }

 
  try {
      const post= await Comment.findOneAndUpdate(
  {
      _id: req.params.id
  },
  {
    $push: { "like": req.user.id }
  },
  { new: true }
);
  
res.status(200).json(post);
 
} catch (err) {
  res.status(500).json(err);
  }
  


});

module.exports = router;
