import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"})) //this limit is specified in documentation generally! 
                                    // pehle express was not able to accept values but now parser is automatically set now!
app.use(express.urlencoded({extended: true, limit: "16kb"})) //to accept the encoded urls as well                                 

app.use(express.static("public")) //to use any files or folder or images jo aaye hain! here they are storedin public and are stored in my programs
//cookie parser is used to access the user's browser and send data to the user! and on those cookies i will perform crud operations cause some cookies can be read by server only!


export { app }


//once a url is hit a request and response (proffesuonally toh it is err,req,res,next!) is handled but i want to do various checkings also on that request can see the diagram in notes! 
//to do that checking we use middleware! which does that checking things! 
//a common practice is since say in db a lot of time we interact and use try catch a lot of times so what we can do is we can make it as a utilitya dn then use it to do the interactuion baar baaar hence making the utility file st a sungle spcae!
 