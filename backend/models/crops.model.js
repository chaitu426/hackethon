import mongoose from "mongoose";

const cropSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", // Link to User who owns this crop 
    required: true 
  },
  nameOfCrop: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    
  },
  category: { 
    type: String, 
    required: true 
  },

  // Crop Growth Stages
  sowingDate: { 
    type: Date, 
    required: true 
  },
  growthStage: { 
    type: String, 
    enum: ["Sown", "Germination", "Vegetative", "Flowering", "Harvest"], 
    default: "Sown" 
  },
  expectedHarvestDate: { 
    type: Date 
  },

  // Fertilizers and Pesticides Used
  fertilizersUsed: [{ 
    type: String 
  }],
  pesticidesUsed: [{ 
    type: String 
  }],

  // Financial Tracking
  expenses: { 
    type: Number, 
    default: 0 
  }, 
  revenue: { 
    type: Number, 
    default: 0 
  },

  // Weather & Soil Monitoring (Optional for Future)
  soilMoisture: { 
    type: Number, 
    default: 0 
  },
  temperature: { 
    type: Number, 
    default: 0 
  },
    humidity: { 
        type: Number, 
        default: 0 
    },
    rainfall:{
        type: Number,
        default: 0
    },

  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Crop = mongoose.model("Crop", cropSchema);
export default Crop;
