const express = require('express')
const router = express.Router()
// const nocache = require('nocache')

// router.use(nocache())
const Register = require('../models/userregist')

//user logout collection function

const logoutUser = async (req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.log('could not destroy the session')
        }else{
            console.log('session destroyed succesfully')
        }
    })
    res.redirect('/')
}

// user login collection function

const loginUser = async (req,res)=>{
    const {email, password} = req.body

   try{
    const checkUser = await Register.findOne({email:email})
   
    if(checkUser.email === email && checkUser.password === password){
        req.session.user = {email:email,isAdmin:false,name:checkUser.name}
        if(checkUser.position === 'admin'){
            req.session.user.isAdmin = true;
            return res.redirect('/admin/login')
        }else{
            console.log('in uslog')
           return res.redirect('/user/dashboard')
        }    
    }
   }catch(e){
    console.log(e.message)
   }
   res.render('homepage',{message:'no user existing', color:'red'})
}

// create new user collection function
const createNew = async (req,res)=>{
    const {name,email,password} = req.body
    try{
        const checkUser = await Register.find({email: email});
        if(checkUser.length){
            console.log(checkUser);
            return res.render('form',{message :"already exist", color:"red", heading:'Sign Up Now'})
        }else{
            try{
                const newEmp = await Register.create({
                    name:name,
                    email:email,
                    password:password,
                    position:"employee"
                })
                console.log(newEmp)
                if(req.session.adminUserCreated){
                    req.session.adminUserCreated = false;
                    res.redirect('/admin/userdatas')
                }else{
                    res.redirect('/');
                }
                
            }catch(e){
                console.log(e.message)
            }
        }
        
    }catch(e){
        console.log(e.message)
    }
} 

//user signup page rendering  route

router.get('/signup',(req,res)=>{
    res.render('form',{heading:"Sign Up Now", url:'/user/signup'});
})

//user login route
router.post('/login',logger,loginUser)

function logger(req,res,next){
    console.log('login')
    next()
}
//user signup route
router.post('/signup',createNew)

//user logout
router.get('/logout',logoutUser)

//user dashboard

router.get('/dashboard',(req,res)=>{
    console.log('indboard')
    if(req.session.user){
        res.render('dashboard',{logoname:'User Login',isAdmin:false,name:req.session.user.name })
    }else{
        res.end('please log in')
    }
})

module.exports = router
