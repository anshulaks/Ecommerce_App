import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;



// import mongoose from 'mongoose'
// const connectDB=async () => {
//     try {
//         const conn= await mongoose.connect(process.env.MONGO_URL);
//         console.log(`MongoDB Connected: ${conn.connection.host}`)
//         } catch (error) {
//             console.error(error)
//             }
//             }
    
// export default connectDB