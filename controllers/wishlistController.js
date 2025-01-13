import expressAsyncHandler from "express-async-handler";
import Wishlist from "../models/Wishlist.js";

const createWishlist = expressAsyncHandler(async (req, res) => {
    try {
        const { productId, userId } = req.body;

        if (!productId || !userId) {
            return res.status(400).json({ message: "productId and userId are required" });
        }

        const wishlist = await Wishlist.create({
            productId,
            userId,
        });

        const newWishlist = await wishlist.save();
        res.status(201).json(newWishlist);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

const getAllWishlists = expressAsyncHandler(async (req, res) => {
    try {
        const wishlists = await Wishlist.find({userId: req.user._id})
        .populate({
            path: 'productId',
            select: 'name description price images sizes collectionId _id',
            populate: {
                path: 'collectionId',
                select: 'name'
            }
        });
        res.status(200).json(wishlists);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

export {createWishlist, getAllWishlists}