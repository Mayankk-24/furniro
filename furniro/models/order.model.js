const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
    username: {
        type: String
    },
    products: [{
        productname: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            min: [1, "Quantity must be at least 1"],
            required: true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        },
        subtotal: {
            type: Number,
            required: true
        },
        cartId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    }],
    total: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Processing", "Delivered"],
        default: "Pending"
    },
    orderType: {
        type: String,
        enum: ["card/upi", "wallet"],
        default: "wallet"
    },
    orderdate: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    billingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Billing"
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model("Order", OrderSchema);
