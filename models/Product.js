import mongoose, {model, Schema, models} from 'mongoose';
import { MoonLoader } from 'react-spinners';

const ProductSchema = new Schema({
    title : {type: String, required: true},
    description: String,
    price: {type: Number,},
    images: [{type: String}],
    category: {type:mongoose.Types.ObjectId,ref:'Category'},
    properties:{type:Object},
},{
    timestamps: true,
});

export const Product = models.Product || model('Product', ProductSchema);
