import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', required: true 
    },
    description: {
        type: mongoose.Schema.Types.String,
    },
    image: { type: mongoose.Schema.Types.String},
},{
    timestamps: true
},);


const Collection = new mongoose.model('Collection', collectionSchema);

export default Collection;