const mongoose = require("mongoose");

const BillingSchema = mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    company: { type: String },
    country: { type: String },
    street_address: { type: String },
    city: { type: String },
    province: { type: String },
    zipcode: { type: String },
    phone: { type: String },
    email: { type: String },
    additional: { type: String },
    products: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            amount: { type: Number, required: true },
            category: { type: String },
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }
        },
    ],
    total: { type: Number, required: true },
    status: {
        type: String,
        enum: ["pending", "canceled", "completed", "refunded", "failed"],
        default: "pending",
    },
    orderId: { type: String },
    razorpayOrderId: { type: String },
    productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cart" }],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    discountApplied: { type: Boolean, default: false },
    paymentMethod: {
        type: String,
        enum: ["wallet", "card/upi"],
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Billing", BillingSchema);
