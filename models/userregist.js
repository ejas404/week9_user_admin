const mongoose = require('mongoose')

const employSchema = new mongoose.Schema({
    name: {type: String, required:true},
    email:{type:String, required:true},
    password:{type: String, required:true},
    position:{type:String, required:true}
})

const Register = new mongoose.model("Register",employSchema)
module.exports = Register;