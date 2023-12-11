// api/getPrices.js
import { mongooseConnect } from "@/lib/mongoose";
import Prices from "@/models/Prices";

export default async function handle(req, res) {
  try {
    await mongooseConnect();
    const prices = await Prices.findOne();
    res.json(prices);
  } catch (error) {
    console.error("Error fetching prices:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}