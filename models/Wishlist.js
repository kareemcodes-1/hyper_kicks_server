import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
    productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', required: true 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', required: true 
    }, 
},{
    timestamps: true
},);


const Wishlist = new mongoose.model('Wishlist', wishlistSchema);

export default Wishlist;
