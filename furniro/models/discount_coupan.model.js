const mongoose = require("mongoose");
const DiscountSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
module.exports = mongoose.model("Discount", DiscountSchema);