const express =  require('express');
const morgan  = require('morgan');
const createError = require('http-errors');
const authRoute = require('./routes/auth.route');
const { verifyAccessToken } = require('./helpers/jwt_helper');


require('dotenv').config();
require('./helpers/mongodb');



const app = express();
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', verifyAccessToken, async(req,res,next)=>{
    //console.log(req.headers['authorization'])

res.send("hello")
})

app.use('/auth',authRoute);

app.use(async(req,res,next)=>{
//    const error = new Error("Not Found");
//    error.status = 404;
//    next(error)
next(createError.NotFound('This route does not exist'))
})


app.use(async(err,req,res,next)=>{
    res.status(err.status || 500);
    res.send({
      error: {
          status : err.status,
          message: err.message
      }  
    })
})

const PORT = process.env.PORT || 6000;


app.listen(PORT,()=>{
    console.log("Server running on PORT",PORT)
})