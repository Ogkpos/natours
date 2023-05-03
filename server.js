/* eslint-disable no-undef */
const mongoose = require("mongoose");

const dotenv = require("dotenv"); // you are missing this line


process.on('uncaughtException',err=>{  
  console.log(err.name,err.message);
  console.log('Uncaught Exception🔥...Shuttting Down');

    process.exit(1)
  
})

dotenv.config({ path: "./config.env" });
const app = require("./app");
;
const DB = process.env.DATABASE.replace( 
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful"))
  //.catch(err=>console.log(err )) 

//console.log(process.env);

const port = process.env.PORT || 3000;
const server=app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

//Handling Unhandled Rejection
process.on('unhandledRejection',err=>{
  console.log(err.name,err.message);
  console.log('Unhandled Rejection🔥💥...Shuttting Down');
  server.close(()=>{
    process.exit(1)
  })
})
