const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const userRouter = require("./routers/userRouter");
const postRouter = require("./routers/postRouter");
const commentRouter = require("./routers/commentRouter");
const replyRouter = require("./routers/replyRouter");
const fileUpload = require("./utils/fileUpload");



require("dotenv").config();

//set up server
const app = express();
const upload = multer();
const PORT = process.env.PORT || 3001;
app.use(express.json());

//connection to DB
const uri = process.env.MDB;
mongoose.set('strictQuery', false);
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

//using local server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));


//set up routes

app.use('/api/user', upload.none(), userRouter)
app.use('/api/post', fileUpload.single('image'), postRouter)
app.use('/api/comment', upload.none(), commentRouter)
app.use('/api/reply', upload.none(), replyRouter)



app.get('/', (req, res)=>{
res.send(
  "App is running!"
)
})
