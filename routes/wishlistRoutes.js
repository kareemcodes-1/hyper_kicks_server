import express from "express";
import { createWishlist, getAllWishlists } from "../controllers/wishlistController.js";
import { protectRoute } from "../middleware/protectRoute.js";
// import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get('/', protectRoute, getAllWishlists);
router.post('/create', createWishlist);
// router.get('/product/:id',getProductById);
// router.put('/edit/:id', protectRoute, editProduct);
// router.delete('/delete/:id', protectRoute, deleteProduct);


export default router;