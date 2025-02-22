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

app.post("/clerk/webhook", async (req, res) => {
  try {
    const { id, email_addresses, first_name, last_name } = req.body.data;
    const email = email_addresses[0]?.email_address;

    // Check if user already exists
    const existingUser = await User.findOne({ clerkId: id });
    if (!existingUser) {
      const newUser = new User({
        clerkId: id,
        email,
        name: `${first_name} ${last_name}`,
      });

      await newUser.save();
      console.log("✅ New User Saved to MongoDB:", newUser);
    }

    res.status(200).json({ message: "User processed successfully" });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
}
);