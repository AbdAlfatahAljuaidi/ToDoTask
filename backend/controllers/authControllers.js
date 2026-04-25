const db = require('../config/firestore');
const bcrypt = require ('bcrypt')
const jwt = require('jsonwebtoken')


//user signup 
const SignUp = async (req,res) => {
  try {
   const { username, email, password } = req.body;
  
   if (!username?.trim() || !email?.trim() || !password?.trim()) {
     return res.status(400).json({ error:true, message:"All Fields are required" });
   }
  
   // check existing user
   const snapshot = await db.collection('users')
     .where('email','==',email)
     .get();
  
   if (!snapshot.empty) {
     return res.status(401).json({ error:true, message:"User Already Exist" });
   }
  
   const hashedPassword = await bcrypt.hash(password,10);
  
   const user = {
     username,
     email,
     password: hashedPassword,
     createdAt: new Date()
   };
  
   const doc = await db.collection('users').add(user);
  
   return res.status(200).json({
     error:false,
     message:"User Created Successfully",
     id: doc.id
   });
  
  } catch(error){
   console.log("Failed Create User", error);
  }
  }

//login
const login = async (req,res) => {
  try {
   const { email, password } = req.body;
  
   if (!email?.trim() || !password?.trim()) {
     return res.status(400).json({ error:true, message:"All fields are required" });
   }
  
   const snapshot = await db.collection('users')
     .where('email','==',email)
     .get();
  
   if (snapshot.empty) {
     return res.status(400).json({ error:true, message:"Email not exist" });
   }
  
   const userDoc = snapshot.docs[0];
   const userData = userDoc.data();
  
   const isMatch = await bcrypt.compare(password, userData.password);
  
   if (!isMatch) {
     return res.status(400).json({ error:true, message:"Incorrect password" });
   }
  
   const token = jwt.sign(
     { id: userDoc.id, email: userData.email, username: userData.username },
     process.env.JWT_SECRET,
     { expiresIn: process.env.JWT_EXPIRES_IN }
   );
  
   res.cookie('token', token, {
     httpOnly: true,
     secure: true,
     sameSite: 'None',
     maxAge: 24 * 60 * 60 * 1000
   });
  
   return res.status(200).json({
     error:false,
     message:"Login successful",
     token
   });
  
  } catch (error) {
   console.error("Login error:", error);
  }
  }

  const logout = (req,res)=>{
    res.clearCookie('token');
    return res.status(200).json({
      error:false,
      message:"Logged out successfully"
    });
   }



   const verifyToken = (req,res)=>{
    const token = req.cookies.token;
   
    if(!token){
      return res.status(401).json({error:true,message:"Token not found"});
    }
   
    try{
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return res.status(200).json({error:false,user:decoded});
    }catch(err){
      return res.status(401).json({error:true,message:"Invalid token"});
    }
   }


module.exports ={
    SignUp,
    login,
    logout,
    verifyToken
}