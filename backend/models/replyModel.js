
const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
    {
    replyby: {type: mongoose.Types.ObjectId,  ref: 'User'},
    postid: {type: mongoose.Types.ObjectId, ref: 'Post'},
    commentid: {type: mongoose.Types.ObjectId, ref: 'Comment'},
    
    username: { type: String },
    reply: { type: String },
    like: [{ type: String }],
  },
  { timestamps: true }
);

const Reply = mongoose.model("Reply", replySchema);

module.exports = Reply;
