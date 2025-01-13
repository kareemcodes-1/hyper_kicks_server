import mongoose, { Types } from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    collectionId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Collection', required: true 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', required: true 
    },
    description: {
        type: mongoose.Schema.Types.String,
    },
    price: {
        type: mongoose.Schema.Types.Number,
        required: true,
    },
    sizes: [{type: String}],
    inStock:{
        type: mongoose.Schema.Types.Boolean,
        required: true,
        default: true,
    },
    images: [{ type: mongoose.Schema.Types.String }],    
},{
    timestamps: true
},);


const Product = new mongoose.model('Product', productSchema);

export default Product;

