const express = require('express')
const router = express.Router()
const nocache = require('nocache')
const Regiser = require('../models/userregist')
router.use(nocache())

//admin update a user

router.get('/updateuser/:id', async (req,res)=>{
    req.session.updateUserId = req.params.id
    try{
    const userToUpdate = await Regiser.findOne({_id:req.params.id})
    // rendering form to update with templates
    res.render('form',
    {
        heading:'Update User',
        button:'update',
        url:'/admin/update',
        name:userToUpdate.name,
        email: userToUpdate.email,
        password: userToUpdate.password
    })
    }catch(e){
        console.log(e.message)
    }
})

//admin side upadating the userdetails

router.post('/update', async (req,res)=>{
    try{
        const { name, email, password} = req.body
        const updateUser = await Regiser
          .updateOne({_id:req.session.updateUserId},
            {$set:{
                name:name,
                email: email,
                password:password
            }})
            console.log(updateUser)
    }
    catch(e){
        console.log(e.message)
        console.log('erroreed catched')
    }
    res.redirect('/admin/userdatas')
   
})

// admin create user

router.get('/createUser',(req,res)=>{
    req.session.adminUserCreated = true;
    res.render('form',{heading:'Create User', button: 'create',url:'/user/signup'})
})

//admin delete users

router.get('/deleteuser/:id',async (req,res)=>{
    const userid = req.params.id
    try{
        const deleteUser = await Regiser.deleteOne({_id:userid})
    }catch(e){
        if(e){
            console.log(e.message)
        }else{
            console.log(`${deleteUser.name} deleted successfully`)
        }
    }
    res.redirect('/admin/userdatas')
})

//admin user lists

router.get('/userdatas',async (req,res)=>{
   
    try{
        const userDatas = await Regiser.find({})
        if(req.session.user){
            res.render('userdata',{datas:userDatas, logoname:'Dashboard'})
        }else{
            res.end('no entry')
        }
        
    }catch(e){
        console.log(e.message)
    }
    
})

//admin login
router.get('/login',(req,res)=>{
    if(req.session.user){
       return res.render('dashboard',{isAdmin:true,logoname:'Admin Login',name:req.session.user.name })
    }
    res.end('not possible')
})

//admin logout
router.get('logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.log('could not destroy')
        }else{
            console.log('session destroyed')
        }
    })
    res.redirect('/')
})

module.exports = router