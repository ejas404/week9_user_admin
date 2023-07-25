const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const sessions = require('express-session')
const nocache = require('nocache')

const userRoute = require('./routes/users')
const adminRoute = require('./routes/admin')


const oneDay = 1000 * 60 * 60 * 24;


app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:false,
    cookie: { maxAge: oneDay },
    resave: false
}));

app.use(cookieParser())
app.use(nocache())

app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
//setting ejs as view engine
app.set('view engine','ejs')

//user router 
app.use('/user',userRoute)

//admin router
app.use('/admin',adminRoute)


app.get('/',(req,res)=>{
 
    res.render('homepage');
})


// app.get('/',(req,res)=>{
//     if (req.session.user) {
//         res.redirect('/user/login')
//     } else {

//         res.render('homepage');
//     }
// })


/* app.post('/login',(req,res)=>{
    console.log(req.username)
    console.log(req.body);
    res.send('logged in')
})
 */


mongoose.connect('mongodb://127.0.0.1:27017/employee')
.then(()=>{
    app.listen(3300,()=>{
        console.log("Server started at 3300");
    })
})
.catch((e)=>{ console.log(e)})