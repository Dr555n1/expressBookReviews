const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
    //console.log(req.headers);
    //console.log(req.headers.authorization);
    if (req.headers.authorization)
    {
        //console.log("header found");
        //console.log(req.headers.authorization['jwtToken']);
        //console.log(req.headers.authorization.replace('Bearer ', ''));
        let jwtToken = req.headers.authorization.replace('Bearer ', '');
        console.log(jwtToken);
        jwt.verify(jwtToken, "access", (err,user)=>{
            if(err)
            {
                return res.status(401).json({message: "No Authorized"});
            }
            else
            {
                console.log("user",user);
                req.user =user;
                next();
            }
        });

    }
    else
    {
        return res.status(401).json({message: "Login Info Not Available, No Authorized"});
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
