import mongoose, {model, Schema, models} from 'mongoose';
import { MoonLoader } from 'react-spinners';

const ProductSchema = new Schema({
    title : {type: String, required: true},
    description: String,
    price: {type: Number, required: true},
    Images: [{type: String}],
    category: {type:mongoose.Types.ObjectId,ref:'Category'}
});

export const Product = models.Product || model('Product', ProductSchema);
