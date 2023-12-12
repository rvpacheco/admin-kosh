import { mongooseConnect } from "@/lib/mongoose";
import Prices from "@/models/Prices";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  try {
    await mongooseConnect();
    

    switch (req.method) {
      case "POST":
        const { nacional, italiano, piercing, especial } = req.body;
        const existingPrices = await Prices.findOne();
        if (existingPrices) {
          await Prices.updateOne({}, { nacional, italiano, piercing, especial });
          res.json({ success: true, message: "Precios actualizados correctamente" });
        } else {
          const pricesDoc = await Prices.create({ nacional, italiano, piercing, especial });
          res.json({ success: true, message: "Precios guardados correctamente", prices: pricesDoc });
        }
        break;
      default:
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        break;
    }
  } catch (error) {
    console.error("API error:", error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
  }
}