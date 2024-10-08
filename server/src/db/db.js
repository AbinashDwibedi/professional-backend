import mongoose from "mongoose";

const mongoConnect = async ()=>{
    try {
        const mongoInstance = await mongoose.connect(process.env.MONGO_URI);
        console.log("mongo db connection successful: ", mongoInstance.connection.host);

    } catch (error) {
        console.log("MongoDB connection failed : ",error);
        process.exit(1);
    }   

}

export {mongoConnect}