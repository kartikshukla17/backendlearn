import { Router } from "express";
import { loginUser, logoutUser, registerUser,refreshAccessToken } from "../controllers/user.controller.js"; //use this js sometimes causes error! 
import { upload } from "../middlewares/multer.middleware.js"; //middleware is jatae huae milke jana 
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar", //frontend mai jjo field bnega uska name bhi same hona chiye
            maxCount: 1
        },
        {
            name: "coverImage", //my this name was wrong in frontend coming data and on this multer!! 
            //keep the name of all the variables same at any cost! across frontend and backend have a naming consistency! ft jyega ni toh! 
            maxCount: 1
        }
    ]),
    registerUser
) //here we have used the post method once register is calleD once the user is redirected here from /users in app.js
//after it comes to /user will go to /register! 
//so this was one method now if i want to make login method this is how it is done:
//router.route("/login").post(login)

router.route("/login").post(loginUser)

//secured routed
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)

export default router  //if exported as default then can import as different name also! 