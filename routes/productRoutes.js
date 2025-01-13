import express from "express";
import { createProduct, deleteProduct, editProduct, getAllProducts, getProductById } from "../controllers/productController.js";
import { adminMiddleware, protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get('/', getAllProducts);
router.post('/create', adminMiddleware, createProduct);
router.get('/product/:id',getProductById);
router.put('/edit/:id', adminMiddleware, editProduct);
router.delete('/delete/:id', adminMiddleware, deleteProduct);


export default router;