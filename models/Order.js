import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          },
          quantity: Number,
        },
      ],
      paymentInfo: {
        id: { type: String },
        gateway: {type: String},
        status: { type: String },
      },
      shippingAddress: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
      },
      totalAmount: Number,
      createdAt: {
        type: Date,
        default: Date.now,
      },
});

export const Order = new mongoose.model('Order', orderSchema);

