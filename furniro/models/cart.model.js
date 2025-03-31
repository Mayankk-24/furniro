const mongoose = require("mongoose");
const CartSchema = mongoose.Schema(
  {
    customername: {
      type: String,
    },
    image: {
      type: String,
    },
    name: {
      type: String,
    },
    price: {
      type: Number,
    },
    size: {
      type: String,
    },
    color: {
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    subtotal: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Delivered"],
      default: "Pending",
    },
    discountApplied: {
        type: Boolean,
        default: false
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required:true
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Cart", CartSchema);
