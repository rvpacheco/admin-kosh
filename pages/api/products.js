import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { authOptions, isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  try {
    await mongooseConnect();
    

    const { method } = req;
    switch (method) {
      case 'GET':
        const products = req.query?.id
          ? await Product.findOne({ _id: req.query.id })
          : await Product.find();
        res.json(products);
        break;
      case 'POST':
        const newProduct = await Product.create(req.body);
        res.status(201).json(newProduct);
        break;
      case 'PUT':
        const updateRes = await Product.updateOne({ _id: req.body._id }, req.body);
        if (updateRes.matchedCount === 0) {
          return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product updated' });
        break;
      case 'DELETE':
        if (!req.query?.id) {
          return res.status(400).json({ message: 'Missing product ID' });
        }
        const deleteRes = await Product.deleteOne({ _id: req.query.id });
        if (deleteRes.deletedCount === 0) {
          return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted' });
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
