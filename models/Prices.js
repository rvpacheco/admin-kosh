// models/Prices.js
import mongoose from "mongoose";

const pricesSchema = new mongoose.Schema({
  nacional: {
    type: Number,
    required: true,
  },
  italiano: {
    type: Number,
    required: true,
  },
  piercing: {
    type: Number,
    required: true,
  },
  especial: {
    type: Number,
    required: true,
  },
});

// Check if the model exists first
const Prices = mongoose.models.Prices || mongoose.model("Prices", pricesSchema);

export default Prices;