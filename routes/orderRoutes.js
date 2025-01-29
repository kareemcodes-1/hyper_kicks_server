import express from "express";
import { getAllOrders, getAllOrdersByMonth, getAllSalesByMonth, getUserOrders } from "../controllers/orderController.js";
import { adminMiddleware } from "../middleware/protectRoute.js";

const router = express.Router();

router.get('/', getAllOrders);
router.get('/user/:userId', getUserOrders);
router.get('/sales/month', adminMiddleware, getAllSalesByMonth);
router.get('/month', adminMiddleware, getAllOrdersByMonth);

export default router;