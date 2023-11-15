import { mongooseConnect } from "@/lib/mongoose";
import mongoose from 'mongoose';
import Prices from "@/models/Prices";
import { authOptions, isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;

  try {
    // Establece la conexión a la base de datos
    await mongooseConnect();

    // Verifica si la solicitud es de un administrador
    await isAdminRequest(req, res);

    if (method === "POST") {
      const { nacional, italiano, piercing, especial } = req.body;
      

      try {
        // Verifica si ya existe un documento de precios y actualízalo, o crea uno nuevo
        const existingPrices = await Prices.findOne();

        if (existingPrices) {
          await Prices.updateOne({}, { nacional, italiano, piercing, especial });
          res.json({ success: true, message: "Precios actualizados correctamente" });
        } else {
          const pricesDoc = await Prices.create({ nacional, italiano, piercing, especial });
          res.json({ success: true, message: "Precios guardados correctamente", prices: pricesDoc });
        }
      } catch (error) {
        console.error("Error al manejar la solicitud:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
      } finally {
        // Cierra la conexión a la base de datos
        await mongoose.disconnect();
      }
      return;
    }

    res.status(405).end();

  } catch (error) {
    console.error("Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
  }
}
