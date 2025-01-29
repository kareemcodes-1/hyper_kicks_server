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


const getAllSalesByMonth = expressAsyncHandler(async (req, res) => {
    try {
        // Fetch all orders
        const orders = await Order.find();
    
        // Calculate sales per month
        const salesPerMonth = orders.reduce((acc, order) => {
          const monthIndex = new Date(order.createdAt).getMonth(); // 0 for January --> 11 for December
          acc[monthIndex] = (acc[monthIndex] || 0) + order.totalAmount;
          return acc;
        }, {});
    
        // Create graph data for all 12 months
        const graphData = Array.from({ length: 12 }, (_, i) => {
          const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
            new Date(0, i)
          ); // Convert month index to name (e.g., Jan, Feb)
          return { name: month, sales: salesPerMonth[i] || 0 }; // Default sales to 0 if no data
        });
    
        // Respond with the graph data
        res.status(200).json(graphData);
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

export {getAllOrders, getAllSalesByMonth, getUserOrders, getAllOrdersByMonth};