const express=require('express');
const user_router=express();
const userController=require('../Controller/userController');
const verifyToken=require('../Middleware/verifyToken')
const upload =require('../config/multer')


user_router.post('/signup',upload.single('file'),userController.signUpUser);
user_router.post('/login',userController.loginUser)
user_router.get('/user/:userId',verifyToken,userController.getUserData)
module.exports=user_router;