//require('dotenv').config({path: '/.env'})  //this is used to load the env variables as soon as the first file gets executed! 
//writing this require here affects the consistencyu of the code though it will still work but still! 
//so we  do it like this: 

import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: './env'
})

//in our scripts in package.json we can load all our cofiguration of dotenv by experimental fetaure using! 

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`server is running on port: ${process.env.PORT}`);
    })
})//to define what to do once gets connected to DB
.catch((err) => {
    console.log("mongo db connecction faiuled!", err);
})
//request.params and request.body are  the two express requests which will be studied the most! 







// import express from "express"
// const app = express()

// ( async () => {
//     try {
//        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//        app.on("error", (error) => {
//         console.log("ERROR: ", error);
//         throw error
//        })

//        app.listen (process.env.PORT, () => {
//         console.log(`app is litening on port ${process.env.PORT}`);
        
//        })
//     } catch (error){
//         console.error("ERROR: ", error);
//     }
// }) () 
//generally this is not followed since not a good practice! 