import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import Prices from "@/models/Prices";

export default async function handler(req, res) {
    await mongooseConnect();

    // Obtener los precios actuales del oro
    const prices = await Prices.findOne();

    // Obtener todos los productos
    const products = await Product.find();

    // Recalcular y actualizar los precios de los productos
    for (const product of products) {
        const goldType = product.goldType;
        const weight = product.weight;

        if (goldType && weight && prices[goldType]) {
            const newPrice = parseFloat(weight) * parseFloat(prices[goldType]);
            product.price = newPrice;
            await product.save();
        }
    }

    res.status(200).json({ message: 'Product prices updated successfully' });
}