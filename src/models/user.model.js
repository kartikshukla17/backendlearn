// this User.model.js is a convection just 
import mongoose, { Schema } from "mongoose"; 
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true //if want to make any field searchable in DB then make its index true! 
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true //if want to make any field searchable in DB then make its index true! 
    },
    avatar: {
        type: String,  //url aayega we will use cludnary here!  
        required: true,
        unique: true,
    },
    coverImage : {
        type: String
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required: [true, "Passworrd is required"]
    },
    refreshToken: {
        type: String,
    },
    }, 
    {
        timestamps: true,
    }
)

//userSchema.pre("save", () => {})// don't write this way since in js we need refrence of this! context basically  //whatever code want to execurte write heere same likee app.listen and all

userSchema.pre("save", async function (next) {
    //next access given when work completed ot flags it and tells to pass next! 
    if(!this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password, 10)
    next() //https://youtube.com/clip/Ugkx4iv93ThGPyHd3eRLc73lXrGeqFOYpCia?si=XACpNtKj8JHLW-GI

}) //used async since this type of functions take time to execute! 
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
} //rteurns true or false and await used since cryptography and all used toh takes time! 
//JWT is a bearer token jo bhi usko bear krta hai 
//read JWT ache se!

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id, //is taken from DB 
            email: this.email,
            username: this.username,
            fullName: this.fullName 
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.method.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id, //is taken from DB 
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
} //gets refreshed baar baar 

export const User = mongoose.model("User", userSchema); //this can directly contact with the database!
//this will only call mongodb on my behalf! 

// export const User = mongoose.model.apply("User", userSchema)
//direct encryption is not possible so we need some middleware of mongoose using a Pre middleware
//it runs just before the data is taken or imported! 
// so yeah this was db connecting 

//to upload on cloudnary our strategy is: multer k through upload krvyenge and will keep it in local storage 
//then will take from local storage and put in cloud so that file can be reuploaded and reattempted to upload on cloud thats why local server first 



