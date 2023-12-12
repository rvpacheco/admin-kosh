import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { authOptions, isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  try {
    await mongooseConnect();
    

    const { method } = req;
    switch (method) {
      case 'GET':
        const categories = await Category.find().populate('parent');
        res.json(categories);
        break;
      case 'POST':
        const { name, parentCategory, properties } = req.body;
        const newCategory = await Category.create({ name, parent: parentCategory || undefined, properties });
        res.status(201).json(newCategory);
        break;
      case 'PUT':
        const { _id, ...updateData } = req.body;
        const updatedCategory = await Category.updateOne({ _id }, updateData);
        res.status(200).json(updatedCategory);
        break;
      case 'DELETE':
        const { _id: deleteId } = req.query;
        await Category.deleteOne({ _id: deleteId });
        res.status(200).json({ message: 'Category deleted successfully' });
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
