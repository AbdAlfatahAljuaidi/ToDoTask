const User = require('../models/User')
const bcrypt = require ('bcrypt')
const jwt = require('jsonwebtoken')


//user signup 
const SignUp = async (req,res) => {
try{
    const {username , email,password}=req.body

   

    if (!username?.trim() || !email?.trim() || !password?.trim()) {
        return res.status(400).json({error:true,message:"All Fields are required "})
    }

const existingUser = await User.findOne({username})
if(existingUser){
    return res.status(401).json({error:true,message:"User Already Exist"})
}

const hashedPassword = await bcrypt.hash(password,10)

const user = new User({
    username,email,password:hashedPassword
})

await user.save()

return res.status(200).json({error:false,message:"User Craeted Succesfully"})

} catch(error){
    console.log("Faild Created User" , error);
    
}


}


//login
const login = async (req,res) => {
  try{
    const {email,password}=req.body

    if(!email?.trim() || !password?.trim()){
        return res.status(400).json({error:true,message:"All fields are require"})
        
    }

    const existingUser = await User.findOne({email}) 

    if(!existingUser){
        return res.status(400).json({error:true,message:"Email not exist"})
    }

const isMatch= await bcrypt.compare(password,existingUser.password)

if (!isMatch) {
    return res.status(400).json({
      error: true,
      message: "Incorrect password",
    });
  }

  const token = jwt.sign(
    { id: existingUser._id, email: existingUser.email , username:existingUser.username }
,process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN}  )
res.cookie('token', token, {
  httpOnly: true,
  secure: true, // ضروري إذا تستخدم https
  sameSite: 'None', // يسمح بالإرسال عبر النطاقات
  maxAge: 24 * 60 * 60 * 1000 // 1 يوم مثلاً
});



  return res.status(200).json({
    error: false,
    message: "Login successful",
    token,
  });

  
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};


const logout = (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ error: false, message: 'Logged out successfully' });
};





const verifyToken = (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: true, message: "Token not found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ error: false, message: "Token is valid", user: decoded });
  } catch (err) {
    return res.status(401).json({ error: true, message: "Invalid or expired token" });
  }
};



module.exports ={
    SignUp,
    login,
    logout,
    verifyToken
}