import mongoose from "mongoose";
const MONGODB_URI = `mongodb://localhost:27017/kids-ecommerce`;

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch(err){
        console.log(err);
        process.exit(1);
    }   
}

export default connectDB;