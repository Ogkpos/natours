
const path=require('path')
const express = require("express");
const { readFileSync } = require("fs");
const { runInNewContext } = require("vm");
const morgan = require("morgan");
const exp = require("constants");
const rateLimit=require('express-rate-limit')
const helmet=require('helmet')
const mongoSanitize=require('express-mongo-sanitize')
const xss=require('xss-clean')
const hpp=require('hpp')
const cookieParser=require('cookie-parser')
const compression=require('compression')
const cors=require('cors')


const AppError=require('./utils/appError')
const globalErrorHandler=require('./controllers/errorController')
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const bookingRouter = require("./routes/bookingRoutes");
const bookingController=require('./controllers/bookingController')
const viewRouter = require("./routes/viewRoutes");


const app = express();

app.set('view engine','pug')
app.set('views',path.join(__dirname,'views'))   

//Global Middlewares

//Implement CORS
app.use(cors())

//console.log(process.env.NODE_ENV);
//How we run diff codes regardig if we're in development or production

//Set security http
app.use(helmet())

//Develpment logging    
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Limit requests from same Api
const limiter=rateLimit({
    max:100,
    windowMs:60*60*1000,
    message:'Too many requests from this IP, please try again in an hour!'
})

app.use('/api',limiter) 

app.post('/webhook-checkout',express.raw({type:'application/json'}),bookingController.webhookCheckout )
 
app.options('*',cors())


//Body parser, reading data from body into req.body
app.use(express.json({limit:'10kb'}));

//Cookie-Parser, parsing/reading data from cookie
app.use(cookieParser())

//parse data coming from an url encoded form
app.use(express.urlencoded({extended:true,limit:'10kb'}))

//Data sanitization against nosql query injection
app.use(mongoSanitize())


//Data sanitization against XSS
app.use(xss())

//prevent parameter pollution
app.use(hpp({
    whitelist:[
    "duration",
    "ratingsAverage",
    "ratingsQuantity",
    "maxGroupSize",
    "difficulty",
    "price"
]
}))

app.use(compression())


//Serving static files from a folder called public
//app.use(express.static(`${__dirname}/starter/public`));
app.use(express.static(path.join(__dirname,'starter/public'))); 

//app.use((req, res, next) => {
//  console.log(`Hello from the Middleware🎉`);
//  next();
//});


//Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //console.log(req.headers);
  //console.log(req.cookies);
  next();
});

          
app.use("/",viewRouter)
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews",reviewRouter) 
app.use("/api/v1/bookings",bookingRouter)
   

app.all('*',(req,res,next)=>{
  //  res.status(404).json({
  //      status:'fail',
  //      message:`Can't find ${req.originalUrl} on this server`
  //  })
 // const err=new Error(`Can't find ${req.originalUrl} on this server`)
 // err.status='fail'
 // err.statusCode=404
 // next(err)
 
 next(new AppError(`Can't find ${req.originalUrl} on this server`,404))
})
/*
app.use((err,req,res,next)=>{
    console.log(err.stack);
    err.statusCode=err.statusCode||500
    err.status=err.status||'error'

    res.status(err.statusCode).json({
        status:err.status,
        message:err.message
    })
})
*/
app.use(globalErrorHandler) 
//Start server
module.exports = app;






















































