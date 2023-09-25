// require('dotenv').config()
// const dotenv = require('dotenv')
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
// const secret_key=process.env.Secret_key;

const employeSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    confirmPassword:{
        type:String,
        require:true
    },
    tokens:[{
        token:{
            type:String,
            require:true 
        }
     }]
})

employeSchema.methods.generateAuthToken = async function () {
    try {
        const token =jwt.sign({id:this._id.toString()}, "mynamisdeepchandraiamaprogrammerofnodejs")
        this.tokens = this.tokens.concat({token:token})
        console.log(token)
        await this.save()
        return token
    } catch (error) {
        res.send("the error is"+ error)
        console.log("the erroe is"+ error)
    }
}
  
employeSchema.pre("save", async function(next) {
    if(this.isModified("password")){
         this.password = await bcrypt.hash(this.password,10)
         this.confirmPassword = undefined;
    }
next()
})

// we creating a collectiom
const Register = new mongoose.model("Register", employeSchema)

module.exports = Register;