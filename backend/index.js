import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
dotenv.config();
import connectDB from './config/db.js';
import userModel from './models/uesr.model.js';
import cropModel from './models/crops.model.js';
connectDB();


const app = express();
app.use(cors());
app.use(bodyParser.json());


app.use(express.json());

const API_KEY = "9dfb1bb8-a804-4d5a-9e8a-1ca1661ea02e";
const SCORING_URL = "https://private.eu-de.ml.cloud.ibm.com/ml/v4/deployments/crs/predictions?version=2021-05-01";

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

app.post('/api/add-crop', async (req, res) => {
  try {
    const { userId,
      nameOfCrop,
      description,
      category,
      sowingDate,
      expectedHarvestDate,
      revenue,
      expenses,
      fertilizersUsed,
      pesticidesUsed
       } = req.body;

    const user = new cropModel({
      userId,
      nameOfCrop,
      description,
      category,
      sowingDate,
      expectedHarvestDate,
      revenue,
      expenses,
      fertilizersUsed,
      pesticidesUsed
      
    });

    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
}
);

app.get('/api/get-crops', async (req, res) => {
  try {
    const { userId } = req.query; // Get userId from query params

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const crops = await cropModel.find({ userId }); // Fetch crops for that user
    res.status(200).json(crops);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

app.get('/api/delete-crop', async (req, res) => {
  try {
    const { cropId } = req.query; // Get cropId from query params

    if (!cropId) {
      return res.status(400).json({ message: "Crop ID is required" });
    }

    await cropModel.findByIdAndDelete(cropId); // Delete crop
    res.status(200).json({ message: "Crop deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});


// Get IBM Token
app.get("/get-token", async (req, res) => {
  try {
    const response = await fetch("https://iam.cloud.ibm.com/identity/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${API_KEY}`,
    });

    const data = await response.json();
    if (response.ok) {
      res.json({ token: data.access_token });
      
    } else {
      res.status(response.status).json({ error: data });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching token" });
  }
});

// Post scoring request
app.post("/predict", async (req, res) => {
  try {
    const { token, payload } = req.body;
    const response = await fetch(SCORING_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error making API request" });
  }
});


app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
}
);