const mongoose = require("mongoose");
const RatingSchema = mongoose.Schema({
    username: {
        type: String,
    },
    email: {
        type: String
    },
    rating: {
        type: Number,
    },
    review: {
        type: String,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    }
});
module.exports = mongoose.model("Rating", RatingSchema);