const router = require("express").Router();
const Reply = require("../models/replyModel");
const User = require("../models/userModel");
const { verifyToken } = require("./verifyToken");

// add reply
router.post("/add",verifyToken,  async (req, res) => {

   try {
    
     const replydone = new Reply({
        postid: req.body.postid,
        replyby: req.user._id,
        commentid: req.body.commentid,
        username: req.user.name,
        reply: req.body.reply,
     });
    const savedReply = await replydone.save();
    res.status(200)
      .send(
        savedReply
      );
  } catch (err) {
    console.log(err);
  }
  
});


//get all reply 
router.get("/", async (req, res) => {
  
  try {
      const reply = await Reply.find({  })
      
      res.status(200).json(reply)
  } catch (err) {
    res.status(500).json(err);
  }
});
//get reply by commentid
router.get("/:id", async (req, res) => {
  
  try {
      const reply = await Reply.find({ commentid: req.params.id })
      
      res.status(200).json(reply)
  } catch (err) {
    res.status(500).json(err);
  }
});


router.put("/liketoreply/:id", verifyToken, async (req, res) => {

  const islike =await Reply.find({$and:[{_id: req.params.id}, {like: {$in: [req.user.id]}}]})

  if (islike.length > 0) {
   
    const post= await Reply.findOneAndUpdate(
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
      const post= await Reply.findOneAndUpdate(
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
