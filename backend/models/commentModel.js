
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
    commentby: {type: mongoose.Types.ObjectId,  ref: 'User'},
    postid: {type: mongoose.Types.ObjectId, ref: 'Post'},
    
    username: { type: String },
    comment: { type: String },
    like: [{ type: String }],
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
