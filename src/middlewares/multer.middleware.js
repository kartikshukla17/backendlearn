import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //req comes from user contains all the json data and all and if it contains file as well so file is used!; file contains all the files;cb is callback
      cb(null, './public/temp') //this other paraneter is the address where have to store the files! 
    },
    filename: function (req, file, cb) {
      //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) //this is setting the filename format
      
      cb(null, file.originalname) //here original name can be stored since these files are with us for a very short time only then they go to cloudnary or wherever! 
      //so originalname can also be stored so that overwrite need not to be taken of that much! 
    }
  })
  
export const upload = multer({ 
    storage
})