import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

//in this there is one error we did because of which it is showing k user exist! but its not toh because we didnt used await for few statements jo db se baat kr rhe the 
//always remember db is in another continent! 

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken
        const refreshToken = user.generateRefreshToken

        user.refreshToken = refreshToken
        user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "something went wrong while generating refresh and access topken ")
    }
}

const registerUser = asyncHandler(async(req, res) => {
    //when registering a user take its name,contact, and other basic details! i.e frontend 
    //store those details 
    //ensure user has filled necessary parts also! (validations)
    //check if user already exist (by say username or email either)
    //check for images and avatar and upload on cloudnary!, avatar check on cloudnary also 
    //create user object-create entry in db 
    //remove pswd and refresh token field from response
    //check if response came or not 
    //if created return res 

    //user details done! 
    const {fullName, email, username, password} = req.body //idhar se data aara hae for now we are entering raw data in json format in body in postman! 
    console.log(email, password);

    //user validation 
    // if (fullName === ""){
    //     throw new ApiError(400, "fullname is required!")
    // } to check multiple can do this: 
    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "all fields are required!")
    } //like this can write mulitple validations in production there is a seperate file for this and from them the are called like methods! 

    //check if user already exists
    const existedUser = await User.findOne({
        $or: [{username: username}, {email: email}]
    });
    if (existedUser) {
        throw new ApiError(409, "User with email or username already exist!");
    }

    console.log(req.files); //like this log all the things and see how files go to cloudinary how they come read them and do shit! 
    //can see the result is in array with response in objects! 
    


    //check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path; //multer mai humne diya tha na toh uske vjh se le paye the hum
    //localPath pe since server pe hai cloudinary pe ni gaya
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    //yaha pe if user ne dala hi ni hai coverimage toh alag dikkat na toh just check that too by classic if else and fix that thinf else will show cannot read property from undefined wala error! 
    
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath) //await used since time lgega in uploading
    //checking if gaya ya nahi since nhi gaya hoga toh backend fatega!
    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    //create user object-create entry in db
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    //checking if bana bhi hai ya nhi
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken" //this is the syntax vo sb we write jo nhi chiye! 
    ) //this _id mongodb apne aap creates! so by this can check1
    if (!createdUser){
        throw new ApiError(500, "Something went wrong while registering user!")
    }

    //return res
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully") //this is new abject of api response
    )

})

const loginUser = asyncHandler(async(req, res) => {
    //take username and pswd from user 
    //check if username exist already 
    //if username exist then check if pswd is same as username ka pswd
    //if match then generate access token and refresh token! 
    //send these tokens through cookies! 

    const {email, username, password} = req.body

    if (!username || !email){
        throw new ApiError(400, "username and password is required")
    }

    const user = User.findOne({
        $or: [{username}, {email}] //we will search for one! 
    })

    if (!user){
        throw new ApiError(404, "user not found!")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)  //dont use User ye mongoose ka methods hai! 

    if (!isPasswordValid){
        throw new ApiError(401, "invalid user credentials")
    }
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id) //dikhra hai k time lg skta hai toh await krdo! 

    //now here we will have to check k user ko db ko call krna again feasible hai ya ni hai! if ni hai toh yahi pe ek constant bna k krdo solve easy!
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken") 

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken,options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "user logged in"
        ) //now we are sending again in json since we want user to let stor in locak system or what if applictaion banara ho toh then!  
    )
})

//now for logout user all we need is to del cookiew=s and vo refreshtoken change krna 
const logoutUser = asyncHandler(async(req,res) => {
    //we can use same the concept of middleware 
    //routes ko jake middleware lagaya and app pe cookie lagaya so we will design our middleware ab for logout 
    //same multer types
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined,
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged out"))
    
}) 

export {
    registerUser,
    loginUser,
    logoutUser
} //all these things are imprted in app! 