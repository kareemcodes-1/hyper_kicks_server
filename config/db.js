import mongoose from "mongoose";
import {configDotenv} from "dotenv";

configDotenv();

export async function connectToDB(){
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        const host = conn.connection.host;
        console.log(`Connected on HOST: ${host}`);
    } catch (error) {
        console.log(error);
    }
}