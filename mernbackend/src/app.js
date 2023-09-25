require('dotenv').config()
const express = require("express")
const cookieParser = require("cookie-parser"); 
const path = require("path")
const connectionMongo = require("./db/conn.js")
const Register = require("./model/register")
const hbs = require("hbs")
const bcrypt = require("bcryptjs")
const auth = require("./middleware/auth.js")
const app = express()
const port = process.env.PORT || 4000

connectionMongo();

const staticPath = path.join(__dirname, "public")
const templatePath = path.join(__dirname, "templates",)
const partialsPath = path.join(__dirname, "templates","partials")

app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))

app.use(express.static(staticPath))

app.set("view engine", "hbs")
app.set("views", templatePath)
hbs.registerPartials(partialsPath)

//hadling home 
app.get("/", async (req,res)=>{
    res.render(path.join(__dirname,"templates","views","index"))
})

//hadling secret page 
app.get("/secret", auth, async (req,res)=>{
    res.render(path.join(__dirname,"templates","views","secret"))
})

//hadling registration page
app.get("/registration", async (req,res)=>{
    res.render(path.join(__dirname,"templates","views","registration"))
})

//hadling login page
app.get("/login", async (req,res)=>{
    res.render(path.join(__dirname,"templates","views","login"))
})

//hadling login page
// app.get("/logout",auth, async (req,auth,res)=>{
//    try {
//     // console.log(req.user);

//     // req.user.tokens = req.user.tokens.filter((currElement)=>{
//     //         return currElement.token !== req.token
//     // })
//     // req.user.tokens = []sssss
//     // await req.user.save();
//     //  res.clearCookie('token');

//     res.clearCookie("jwt");
//     //  {
//     //     httpOnly: true,
//     //     expires: new Date(0),
//     // });
//     // console.log("logout successfully");
//     // console.log("logout successfully")
//     // await req.user.save()
//     res.render("login")
//    } catch (error) {
//     console.log(error)
//    }
// })
app.get("/logout", (req, res ) => {
    try {
        res.clearCookie("jwt"); // Replace "jwt" with the name of your cookie
        res.redirect("/login"); // Redirect to the login page or any other desired page
    } catch (error) {
        console.log(error)
    }
  });
  
//hadling post registration
app.post("/registration", async (req, auth, res) => {
    try {
        const password = req.body.password
        const confirmPassword = req.body.confirmPassword

        if(password === confirmPassword){
        const newRegistration = new Register({
            name:req.body.yourName,
            email:req.body.email,
            password:req.body.password,
            confirmPassword:req.body.confirmPassword,
        })

        const token = await newRegistration.generateAuthToken();

        res.cookie("jwt",token,{
            expires:new Date(Date.now() + 100000),
            httpOnly:true,
           //secure:true
        })
        

    const registered = await newRegistration.save()
    res.status(201).render(path.join(__dirname,"templates","views","index"))
        }else{
            res.send("password is not matching")
        }
    } catch (error) {
        res.status(400).send(error);
    }
});

app.post("/login", async(req,res)=>{
    try {
        const email = req.body.email
        const password = req.body.password
    
    const useremail= await Register.findOne({email:email})
    const isMatch = await bcrypt.compare(password, useremail.password)
    const token = await useremail.generateAuthToken();
    res.cookie("jwt",token,{
        expires:new Date(Date.now() + 1000000),
        httpOnly:true,
        //secure:true
    })
    console.log(`this is the cookie ${req.cookies.jwt}`)
    
    console.log(token);
   if(isMatch){
    res.status(201).render(path.join(__dirname,"templates","views","index"))
   }else{
    res.send("invalid login detail")
   }
}
 catch (error) {
    res.status(400).send("invalid login detail")
}
})

// const jwt = require("jsonwebtoken")

// const createToken = async() =>{
//     const token = await jwt.sign({_id:'65096e2c17acc267c01d8f67'}, "mynamisdeepchandraiamaprogrammerofnodejs",{
//         expiresIn:"2 seconds"
//     })
//     console.log(token)

//     const userVer = await jwt.verify(token, "mynamisdeepchandraiamaprogrammerofnodejs")
//     console.log(userVer)
// }
// createToken()

app.listen(port,()=>{
    console.log(`connection is live at port no...${port}`)
})

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MGFiZjFhZjE5MTAwODQ3OWZkYzE0ZiIsImlhdCI6MTY5NTIwMzA5OH0.JClMOePoJMZkX27Wvk_X1v0_iH8apLqU2raPAJ3DLAk
