import mongoose from "mongoose"
const MONGODB_SERVER = process.env.MONGODB_SERVER;

export async function connectDB() {
    try {
        if(MONGODB_SERVER == undefined) {
            throw new Error("Enter total retries connect to MongoDB")
        }
        console.log("MongoDB connect...")
        console.log(MONGODB_SERVER)
        await mongoose.connect(MONGODB_SERVER)
    } catch (error) {
        throw new Error("MongoDB is not connected.")
        throw error
    }
}