import mongoose from 'mongoose';

export const connectDB = async ()=>{
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Connected to DB`, db.connection.host);
    } catch (error) {
        console.error(`Error connecting DB`, error.message);
    }
}