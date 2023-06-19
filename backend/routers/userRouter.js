const router = require("express").Router();
const User = require("../models/userModel");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const {sendResetEmail} =require('../utils/sendEmail')
//register router
//api/user/register
router.post("/register", async (req, res) => {
  try {
    const { email, name, password } = req.body;

    //validation
    if (!email || !name || !password)
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });

    

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({
        errorMessage: "This email already exists.",
      });

   

    const newUser = new User({
      email: req.body.email,
      name: req.body.name,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PW_SECRET
      ).toString(),
    });
    try {
      const savedUser = await newUser.save();
      res.status(200).json({name: savedUser.name, email: savedUser.email});
    } catch (err) {
      res.status(500).json(err);
    }
  } catch (err) {
    console.error(err);
    //internal server error
    res.status(500).send('Something went wrong!');
  }
});


//login router
// api/user/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });

    const user = await User.findOne({ email: req.body.email });
    !user && res.status(401).json("Wrong email or does not exist!");

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PW_SECRET
    );
    const originalpassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    
    if (originalpassword !== req.body.password ) {
      res.status(401).json("Oops.. Wrong password!");
      return
    }
     

    //jwt token
    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

   
    res.status(200).json({id:user._id, name: user.name, email:user.email, isAdmin: user.isAdmin, token });
  } catch (err) {
    res.status(500).json(err);
  }
});



//password reset router
//api/user/resetpassword
router.post("/resetpassword", async (req, res) => {
  try {
    const { email } = req.body;

    //validation
    if (!email )
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });

    

    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(400).json({
        errorMessage: "No account found on this email.",
      });
     
 
      function generateString(length) {
          const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = ' ';
            const charactersLength = characters.length;
            for ( let i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
        
            return result.trim();
        }
  
      const user= await User.findOneAndUpdate({email:email}, {resetcode: generateString(50) }, {new:true} )
  
  if (user) {
      sendResetEmail(user.email, user.resetcode)
     
      res.status(200).json({
                   success: true
                      
                  })
      
  }else{
      res.status(500).json({
          success: false
             
         })
  }
   
    }catch (err) {
      res.status(500).json(err);
    }
});

//password update
//api/user/updatepassword
router.put("/updatepassword", async (req, res) => {
  try {
    
    function generateString(length) {
      const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = ' ';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
    
        return result.trim();
    }
  const matchuser=await User.findOne({email:req.body.userid, resetcode: req.body.resetcode})

  

  if (matchuser) {
      const user= await User.findOneAndUpdate({email: req.body.userid}, {password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PW_SECRET
      ).toString(), resetcode: generateString(50)} )
 
  if (user) {
      res.json({success: true})
  }else{
      res.status(404)
      res.json({success: false})
  }
  }else{
      res.status(200)
      res.json({success: false})
      
  }
   
    }catch (err) {
      res.status(500).json(err);
    }
});


module.exports = router;