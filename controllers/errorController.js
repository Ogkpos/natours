const AppError = require("./../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
  //(["'])(?:\\.|[^\\])*?\1
  //const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const value = Object.values(err.keyValue)[0];
  
  const message = `Duplicate field value:${value}, please use another value`;
  return new AppError(message, 400);
};

const handleValidationErroDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  
  const message = `Invalid Input Data.${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);

const handleJWTExpired = () =>
  new AppError("Your token has expired. Please log in again!", 401);

const sendErrorDev = (err, req, res) => {
  //API
  if (req.originalUrl.startsWith("/api")) { 
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    //Rendered website
    res.status(err.statusCode).render("error", {
      title: "Something went wrong",
      msg: err.message,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  //API
  if (req.originalUrl.startsWith("/api")) {
    //Operational Error:trusted errors: Send msssg to client

    if (err.isOperational) {
       res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
      //Programming Error or other unknown error:dont leak error details
    } else {
      //log error
      console.error("ERROR❌", err);

      //send a generic message
       res.status(500).json({
        status: "Error",
        message: "Something went very wrong",
      });
    }
  } else {
    //Rendered Website
    if (err.isOperational) {
      res.status(err.statusCode).render("error", {
        title: "Something went wrong",
        msg: err.message,
      });
      //Programming Error or other unknown error:dont leak error details
    } else {
      //log error
      console.error("ERROR❌", err);

      //send a generic message
      res.status(err.statusCode).render("error", {
        title: "Something went wrong",
        msg: "Please try again later",
      });
    }
  }
};

module.exports = (err, req, res, next) => {
  //console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message=err.message
    if (err.name === "CastError") error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === "ValidationError") error = handleValidationErroDB(error);
    if (err.name === "JsonWebTokenError") error = handleJWTError();
    if (err.name === "TokenExpiredError") error = handleJWTExpired();

    sendErrorProd(error, req, res);
  }
  //next()
};
 