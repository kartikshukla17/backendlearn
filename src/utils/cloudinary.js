import {v2 as cloudinary} from "cloudinary" //have given a name instead of writing v2 
import fs from "fs" //by default node mai hota ye lib 

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRETKEY,
});

const uploadOnCloudinary = async (localFilePath) => {
    try{
        if (!localFilePath) return null
        //upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        //file has been uploaded successfully 
        console.log("file uploaded on cloudinary", response.url);
        return response;
        
    } catch (error) {
        fs.unlinkSync(localFilePath)//local saved temp file as upload operation got failed
    }
}  
export {uploadOnCloudinary}