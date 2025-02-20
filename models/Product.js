import mongoose, {model, Schema, models} from 'mongoose';
import { MoonLoader } from 'react-spinners';

const ProductSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    price: { type: Number },
    images: [{ type: String }],
    category: { type: mongoose.Types.ObjectId, ref: 'Category' },
    properties: { type: Object },
    weight: { type: Number }, // Nuevo campo para almacenar el peso
    goldType: { type: String }, // Nuevo campo para almacenar el tipo de oro
}, {
    timestamps: true,
});

export const Product = models.Product || model('Product', ProductSchema);