import express from "express";
import { createCollection, getAllCollections, editCollection, deleteCollection, getCollectionById, getProductsByCollectionId } from "../controllers/collectionController.js";
import { adminMiddleware, protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get('/', getAllCollections);
router.get('/collection/:id', getCollectionById, getProductsByCollectionId);
router.get('/products/collection/:id', getProductsByCollectionId);
router.post('/create', adminMiddleware, createCollection);
router.put('/edit/:id', adminMiddleware, editCollection);
router.delete('/delete/:id', adminMiddleware, deleteCollection);

export default router;