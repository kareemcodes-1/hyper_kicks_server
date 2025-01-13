import expressAsyncHandler from "express-async-handler";
import {Order} from "../models/Order.js";

const getAllOrders = expressAsyncHandler(async (req, res) => {
    try {
        const orders = await Order.find().populate('userId', 'name avatar email')
        .populate({
            path: 'products.productId',
            select: 'name price',
        });;
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

const getAllOrdersByMonth = expressAsyncHandler(async (req, res) => {
    try {
        const orders = await Order.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" }, // Group by month
                    totalOrders: { $sum: 1 }, // Count total orders per month
                },
            },
            {
                $sort: { _id: 1 }, // Sort by month (January = 1, February = 2, etc.)
            },
        ]);

        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];

        // Format the response to include month names
        const formattedOrders = orders.map((order) => ({
            month: months[order._id - 1], // Convert month number to name
            totalOrders: order.totalOrders,
        }));

        res.status(200).json(formattedOrders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const getUserOrders = expressAsyncHandler(async (req, res) => {
    try {
        const {userId} = req.params;
        const orders = await Order.find({userId: userId}).populate({
            path: 'products.productId',
            select: 'name price images'
        })

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

export {getAllOrders, getAllOrdersByMonth, getUserOrders};