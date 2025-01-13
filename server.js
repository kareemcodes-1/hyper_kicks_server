import express from "express";
import {configDotenv} from "dotenv";
import { connectToDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import collectionRoutes from "./routes/collectionRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import stripeRoutes from "./routes/stripeRoutes.js";
import bodyParser from "body-parser";
import { stripeWebhook } from "./controllers/stripeController.js";

configDotenv();

// const client = process.env.VITE_CLIENT;
const admin = process.env.VITE_ADMIN;

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors({
    origin: [admin]
}));

app.post('/api/stripe/webhook', bodyParser.raw({ type: 'application/json' }), stripeWebhook);

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/products', productRoutes);
app.use('/api/wishlists', wishlistRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stripe', stripeRoutes);



connectToDB();

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Hosted on Port: ${port}`);
});
