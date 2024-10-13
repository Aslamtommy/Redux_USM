const User=require('../Model/userModel')

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const securepassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error);
    }
}

const signUpUser = async (req, res) => {
    try {
        const { username, email, phone, password } = req.body

const existinguser=await User.findOne({email})
if(existinguser){
    return res.status(400).json({error:'email already exists'})
}

        const spassword = await securepassword(password)
        const userData = new User({
            username, email, phone, password: spassword, profilePicture: `/uploads/${req.file.filename}`
        })
        const saveUserData = await userData.save()
        if (!saveUserData) {
            return res.json({ error: "something went wrong", succces: false })
        }
        return res.json({ user: userData, success: true })
    } catch (error) {
        console.log(error);
    }
}


const loginUser=async(req,res)=>{
    try {

       
        const {email,password}=req.body
       
        const userData=await User.findOne({email:email})

   
      
        if(!userData){
            return res.json({error:'invalid email'})
        }
       
        const passwordMatch =await bcrypt.compare(password, userData.password);
        if (!passwordMatch) {
            return res.json({ error: "invalid password"})
        }
 
        const token=jwt.sign({username:userData.username},process.env.SECRET_KEY,{expiresIn:'1h'})
     console.log('hin',token)
        return res.json({user:userData,token})
    } catch (error) {
        
    }
}
const getUserData=async(req,res)=>{
    try {
        console.log(req.params);
        const userId=req.params.userId;
        const userData=await User.findOne({_id:userId})
        console.log('userData',userData);
        return res.json({user:userData,token:req.user})
    } catch (error) {
        
    }
}
module.exports = {
  
    signUpUser,
  loginUser,
  getUserData
}