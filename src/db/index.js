import mongoose, { mongo } from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
    try {
       const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       console.log(`\n MongoDB connected!! ${connectionInstance.connection.host}`);
       
    } catch (error) {
        console.log("MongoDB connection error", error);
        process.exit(1) //there are diffrent exit codes as well!
        
    }
}

export default connectDB