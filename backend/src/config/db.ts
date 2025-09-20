import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async()=>{
    try{
        const conn = process.env.MONGODB_URI;
        if(!conn){
            throw new Error("MONGODB_URI is not defined in environment variables");
        }
        await mongoose.connect(conn); 
        console.log("MongoDB connected");
    }catch(err){
        console.error("Connection to MongDB failed",err);
        process.exit(1);
    }
};

export default connectDB;