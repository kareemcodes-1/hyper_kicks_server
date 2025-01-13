import expressAsyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import User from "../models/User.js";

const getAllProducts = expressAsyncHandler(async (req, res) => {
    try {
        const products = await Product.find().populate('collectionId', 'name');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

const createProduct = expressAsyncHandler(async (req, res) => {
    try {
        // console.log(req.body);
        const { name, description, price, images, collectionId, userId, sizes, inStock } = req.body;

        if (!name || !price || !images || !collectionId || !userId) {
            return res.status(400).json({ message: "Name, Price and Images, userId are required" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        if (user.role !== 'admin') {
            return res.status(401).json({ message: "Unauthorized, You're not an admin!" });
        }

        const product = await Product.create({
            collectionId,
            userId,
            name,
            description,
            price,
            images,
            inStock,
            sizes,
        });

        const newProduct = await product.save();
        return res.status(201).json({
            _id: newProduct._id,
            userId: newProduct.userId,
            name: newProduct.name,
            description: newProduct.description,
            price: newProduct.price,
            images: newProduct.images,
            sizes: newProduct.sizes,
            inStock: newProduct.inStock
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});


const getProductById = expressAsyncHandler(async (req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findById(id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

const editProduct = expressAsyncHandler(async (req, res) => {
    try {
        const {id} = req.params;
        const {name, description, images, collectionId, price, inStock, userId} = req.body;

        if(!name || !images || !price || !collectionId || !userId){
            return res.status(400).json({message: "Name and Images, Price, collectionId are Required"});
        }

        const user = await User.findById(userId);

        if (user.role === 'admin') {
            const updatedProduct = await Product.findByIdAndUpdate(
                id,
                {
                    $set: {
                        collectionId,
                        name,
                        description,
                        images,
                        price,
                        inStock
                    },
                },
                { new: true }
            );
        
            return res.status(200).json(updatedProduct);
        } else {
            return res.status(401).json({ message: "Unauthorized, You're not an admin!" });
        }
        
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

const deleteProduct = expressAsyncHandler(async (req, res) => {
    try {
        const {id} = req.params;
        
        // if(req.user.role === 'admin'){
            const deletedProduct = await Product.findByIdAndDelete(id);

            res.status(200).json(deletedProduct);
        // }else{
        //     return res.status(401).json({message: "Unauthorized, You're not an admin!"});
        // }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

export {createProduct, getAllProducts, getProductById, editProduct, deleteProduct};