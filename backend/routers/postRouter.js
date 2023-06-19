const router = require("express").Router();
const jwt = require("jsonwebtoken");
const {
  verifyToken,
} = require("./verifyToken");
const Post = require("../models/postModel");
// const {  cloudinary } = require("../utils/cloudinary");
const fileUpload = require("../utils/fileUpload");
const { cloudinary } = require("../utils/cloudinaryConfig");


// add post
router.post("/add",verifyToken,  async (req, res) => {

  

    if (!req.body.description || !req.file) {
        return res.json({message: 'Data field missing!'})
    }


    if (req.file) {
        try {
    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
           
    // Create new post
     const newPost = new Post({
        description: req.body.description,
         postby: req.user._id,
        image: result.secure_url,
     });
    const savedPost = await newPost.save();
    res.status(200)
      .send({
        newPost
      });
  } catch (err) {
    console.log(err);
  }
    } else {
         const newPost = new Post({
        description: req.body.description,
             postby: req.user._id,
        image: 'https://via.placeholder.com/400x300'
  });
      try {
        const savedPost = await newPost.save();
    
      res.json(savedPost);

      } catch (error) {
        res.status(500).json(error);
      }
    }
    
    
     
      
  
});


//get all posts
router.get("/", async (req, res) => {
  
  try {
      const posts = await Post.find({}).populate('postby', 'name')
      res.status(200).json(posts)
  } catch (err) {
    res.status(500).json(err);
  }
});


//get post by id
router.get("/:id", async (req, res) => {
  
  try {
      const post = await Post.findById(req.params.id)
      res.status(200).json(post)
  } catch (err) {
    res.status(500).json(err);
  }
});


// upvote
router.put("/downvote/:id", verifyToken, async (req, res) => {

    try {
        const isUpvote =await Post.find({$and:[{_id: req.params.id}, {upvote: {$in: [req.user.id]}}]})


    if (!isUpvote.length===0) {
       return res.status(200).json({message: 'You already give upvote! you have to remove it to give downvote again'});
    }
    } catch (err) {
        res.status(500).json(err);
    }
  try {
     const post= await Post.findOneAndUpdate(
    {
        _id: req.params.id
    },
    [
        
         {
            $set: {
                downvote: {
                    $cond: [
                        { $in: [req.user.id, '$downvote'] },
                        { $setDifference: ['$downvote', [req.user.id]] },
                        { $setUnion: ['$downvote', [req.user.id]] }
                        
                    ]
                }
            }
        },
         {
            $set: {
                upvote: {
                    $cond: [
                        { $in: [req.user.id, '$upvote'] },
                        { $setDifference: ['$upvote', [req.user.id]] },
                        '$upvote'
                    ]
                }
            }
        }
        
        ],
    { new: true }
);
 
res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});
// downvote
router.put("/upvote/:id", verifyToken, async (req, res) => {

    const isDownvote =await Post.find({$and:[{_id: req.params.id}, {downvote: {$in: [req.user.id]}}]})


    if (!isDownvote.length===0) {
       return res.status(200).json({message: 'You already give downvote! you have to remove it to give upvote again'});
    }
    try {
        const post= await Post.findOneAndUpdate(
    {
        _id: req.params.id
    },
            [
    {
            $set: {
                upvote: {
                    $cond: [
                        { $in: [req.user.id, '$upvote'] },
                        { $setDifference: ['$upvote', [req.user.id]] },
                        { $setUnion: ['$upvote', [req.user.id]] }
                    ]
                }
            }
        },
        
        {
            $set: {
                downvote: {
                    $cond: [
                        { $in: [req.user.id, '$downvote'] },
                        { $setDifference: ['$downvote', [req.user.id]] },
                        '$downvote'
                    ]
                }
            }
        },
         
        
        ],
    { new: true }
);
    
res.status(200).json(post);
   
  } catch (err) {
    res.status(500).json(err);
    }
    


});



// update post

router.put("/update/:id",verifyToken,  async (req, res) => {

    if (!req.body.description) {
        return res.json({message: 'Data field missing!'})
    }

    try {
        const updatedone= await Post.findOneAndUpdate({_id: req.params.id},{description: req.body.description}, {new:true})
       
        if (updatedone) {
            res.status(200).json(updatedone);
        }
    } catch (err) {
        res.status(500).json(err);
    }
    
});


// delete post

router.delete("/delete/:id",verifyToken,  async (req, res) => {

    try {
        const deletedone= await Post.findOneAndDelete({_id: req.params.id})
      
        if (deletedone) {
            res.status(200).json({message: 'Post deleted successfully'});
        }
    } catch (err) {
        res.status(500).json(err);
    }
    
});

module.exports = router;