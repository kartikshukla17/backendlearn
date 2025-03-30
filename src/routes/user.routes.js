import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js"; //use this js sometimes causes error! 
import { upload } from "../middlewares/multer.middleware.js"; //middleware is jatae huae milke jana 


const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar", //frontend mai jjo field bnega uska name bhi same hona chiye
            maxCount: 1
        },
        {
            name: "coverimage",
            maxCount: 1
        }
    ]),
    registerUser
) //here we have used the post method once register is calleD once the user is redirected here from /users in app.js
//after it comes to /user will go to /register! 
//so this was one method now if i want to make login method this is how it is done:
//router.route("/login").post(login)

export default router  //if exported as default then can import as different name also! 