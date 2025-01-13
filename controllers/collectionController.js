import expressAsyncHandler from "express-async-handler";
import Collection from "../models/Collection.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

const getAllCollections = expressAsyncHandler(async (req, res) => {
    try {
        const collections = await Collection.find();
        res.status(200).json(collections);
    } catch (error) {
        res.status(500).json({message: "Server Error"});
    }
});

const getCollectionById = expressAsyncHandler(async (req, res) => {
    try {
        const {id} = req.params;
        const collection = await Collection.findById(id).populate('');
        if(collection){
            res.status(200).json(collection);
        }else{
            res.status(404).json({message: "Collection not found"});
        }
    } catch (error) {
        res.status(500).json({message: "Server Error"});
    }
});

const getProductsByCollectionId = expressAsyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const products = await Product.find({ collectionId: id }).populate('collectionId', 'name');
        if(products.length > 0){
            res.status(200).json(products);
        }else{
            return res.status(404).json({ message: 'No products found for this collection' });
        }
    } catch (error) {
        res.status(500).json({message: "Server Error"});
    }
});


const createCollection = expressAsyncHandler(async (req, res) => {
    try {
        const {name, description, image, userId} = req.body;

        if(!name || !image || !userId){
            return res.status(400).json({message: "Name, Image and UserId are Required"});
        }

        const user = await User.findById(userId);

        if(user.role === 'admin'){
            const collection = await Collection.create({
                name,
                userId,
                description,
                image
            });
    
            await collection.save();
            res.status(200).json({
                _id: collection._id,
                name: collection.name,
                description: collection.description,
                image: collection.image,
            });
        }else{
            return res.status(401).json({message: "Unauthorized, You're not an admin!"});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

const editCollection = expressAsyncHandler(async (req, res) => {
    try {
        const {id} = req.params;
        const {name, description, image, userId} = req.body;

        if(!name || !image || !userId){
            return res.status(400).json({message: "Name, Image and UserId are Required"});
        }

        const user = await User.findById(userId);
        
        if(user.role === 'admin'){
            const updatedCollection = await Collection.findByIdAndUpdate(id, {
                $set: {
                    name,
                    description,
                    image
                }
            }, {new: true});

           if(!updatedCollection){
            return res.status(404).json({ message: "Collection not found" });
           }

            res.status(200).json(updatedCollection);
        }else{
            return res.status(401).json({ message: "Unauthorized, You're not an admin!" });
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

const deleteCollection = expressAsyncHandler(async (req, res) => {
    try {
        const {id} = req.params;
        
        if(req.user.role === 'admin'){
            const deletedCollection = await Collection.findByIdAndDelete(id);

            res.status(200).json(deletedCollection);
        }else{
            return res.status(401).json({ message: "Unauthorized, You're not an admin!" });
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

export {getAllCollections, createCollection, editCollection, deleteCollection, getCollectionById, getProductsByCollectionId};