import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

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
    const existedUser = User.findOne({
        $or: [{username}, {email}]
    })
    if (existedUser) {
        throw new ApiError(409, "User with email or username already exist!")
    }

    //check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path; //multer mai humne diya tha na toh uske vjh se le paye the hum
    //localPath pe since server pe hai cloudinary pe ni gaya
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

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

export {registerUser} //all these things are imprted in app! 