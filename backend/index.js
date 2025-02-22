import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import userModel from './models/uesr.model.js';
connectDB();


const app = express();


app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
}  );

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
}
);