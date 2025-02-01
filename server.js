import express from 'express'
import dotenv from 'dotenv';
import connectDB from './config/db.js';  // Use a relative path here
import authRoutes from './routes/authRoute.js'
import cors from 'cors'
import productRoutes from './routes/productRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import path from 'path'; // Import path for serving static files
import { fileURLToPath } from 'url';
//config env
dotenv.config();

const  app=express()
//connectDb
connectDB();

//middlewares
app.use(cors())
app.use(express.json())

//routes
app.use('/api/v1/auth',authRoutes)
app.use('/api/v1/category', categoryRoutes)
app.use('/api/v1/product',productRoutes)

// Serve static files (for production)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));

//PORT
const PORT = process.env.PORT || 8080;

//API REST
app.get('/',(req,res)=>{
    res.send("<h1>Ecommerce hello!</h1>")
})

//port



app.listen(PORT,()=>{
    console.log(`Server runnig on ${PORT}`)

})

export default app;


// Serve static files from the React app in production
// const __dirname = path.resolve(); // Resolve the directory name

// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, 'client', 'build')));

//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//   });
// } else {
//   app.get('/', (req, res) => {
//     res.send('<h1>Ecommerce hello! Running in Development Mode</h1>');
//   });
// }

// Serve frontend static files
// app.use(express.static(path.join(__dirname, "client", "build")));
// app.get("*", (req, res) =>
//   res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
// );