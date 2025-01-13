import expressAsyncHandler from "express-async-handler";;
import {Customer} from "../models/Customer.js";
import Stripe from "stripe";
import { Order } from "../models/Order.js";

const createStripeSession = expressAsyncHandler(async (req, res) => {
    try {
        const { products, userInfo } = req.body;
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        const lineItems = products.map(({ product, quantity }) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: product.name,
                    images: [product.images[0]],
                },
                unit_amount: product.price * 100,
            },
            quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: "payment",
            success_url: "http://localhost:5173/checkout/success",
            cancel_url: "http://localhost:5173/checkout/cancel",
            metadata: {
                userId: userInfo._id,
                products: JSON.stringify(
                    products.map(({ product, quantity }) => ({
                        productId: product._id,
                        quantity,
                    }))
                ),
            },
        });

        const userId = userInfo._id;
        let customer = await Customer.findById(userId);

        if (!customer) {
            customer = await Customer.create({
                userId: userInfo._id,
                name: userInfo.name,
                email: userInfo.email,
            });
        }

        res.status(200).json({ id: session.id, customer });
        return; // Prevent further code execution
    } catch (error) {
        res.status(500).json({ message: error.message });
        return; // Prevent further code execution
    }
});


const stripeWebhook = expressAsyncHandler( async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    if (endpointSecret) {
        try {
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } catch (err) {
            console.error("Error verifying webhook signature:", err.message);
            res.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }
    } else {
        console.error("Webhook secret is missing or invalid.");
        res.status(400).send("Webhook secret missing or invalid.");
        return;
    }

    switch (event.type) {
        case "checkout.session.completed":
            const session = event.data.object;
            try {
                const userId = session.metadata.userId;
                const products = JSON.parse(session.metadata.products);
                const order = await Order.create({
                    userId,
                    products: products.map(({productId, quantity}) => ({
                        productId,
                        quantity
                    })),
                    paymentInfo: {
                        id: session.payment_intent,
                        gateway: 'Stripe',
                        status: 'completed',
                    },
                    shippingAddress: {
                        street: session.customer_details?.address?.line1 || "",
                        city: session.customer_details?.address?.city || "",
                        state: session.customer_details?.address?.state || "",
                        postalCode: session.customer_details?.address?.postal_code || "",
                        country: session.customer_details?.address?.country || "",
                    },
                    totalAmount: session.amount_total / 100,
                });
                console.log("Order created");
            } catch (error) {
                console.log(error);
            }
            break;
        default:
            break;
    }
    res.status(200).send("Webhook received.");
});

export {createStripeSession, stripeWebhook};