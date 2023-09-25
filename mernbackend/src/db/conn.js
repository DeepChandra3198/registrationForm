const mongoose = require("mongoose")

const connectionMongo=() =>{mongoose.connect("mongodb://127.0.0.1/onlineRegistration",{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("connection Succsessful")
}).catch((error)=>{
    console.log("failed connection",error)
})
} 
module.exports = connectionMongo;