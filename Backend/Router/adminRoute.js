const express=require('express')
const admin_router=express()
const upload =require('../config/multer')
const verifyToken=require('../Middleware/verifyToken')
const adminController=require('../Controller/adminController')


admin_router.post('/',adminController.loginAdmin)
admin_router.get('/users',verifyToken,adminController.fetchUsers);
admin_router.post('/updateuser/:userId',verifyToken,upload.single('file'),adminController.updateUser);
admin_router.delete('/deleteuser/:userId',adminController.deleteUser)
admin_router.post('/adduser',verifyToken,upload.single('file'),adminController.adduser)
module.exports=admin_router
