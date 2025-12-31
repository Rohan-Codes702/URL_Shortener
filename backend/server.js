import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import urlRoutes from "./routes/url.js"
dotenv.config();
const app = express();
app.use(cors({
    origin:process.env.Frontend_URL,
    methods:["GET","POST"]
}));
app.use(express.json());

app.use("/",urlRoutes)



mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
