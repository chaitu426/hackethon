import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
dotenv.config();
import connectDB from './config/db.js';
import userModel from './models/uesr.model.js';
connectDB();


const app = express();
app.use(cors());
app.use(bodyParser.json());


app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
}  );

app.post("/api/save-user", async (req, res) => {
  try {
    const { clerkId, email, name } = req.body;

    const user = new userModel({
      clerkId,
      email,
      name,
    });
   

    
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});



app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
}
);