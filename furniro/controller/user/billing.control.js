const Billing = require("../../models/billing.model");
const Order = require("../../models/order.model");
const { payment } = require("../../utils/payment");
const Stock = require("../../models/stock.model");
const NotificationController = require("./notification.control");
const { status } = require("http-status");
const Cart = require("../../models/cart.model");
const User = require("../../models/user.model");
const Sell = require("../../models/sells.model");

exports.paybill = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        const { firstname, lastname, company, country, street_address, city, province, zipcode, phone, email, additional } = req.body;
        const name = firstname + " " + lastname;
        const order = await Cart.find({ userId: userId });
        if (order.length === 0) {
            return res.status(status.NOT_FOUND).json({
                message: "Order not found",
            });
        }
        const products = order.map((item) => {
            if (!item.price || isNaN(item.price)) {
                throw new Error(`Invalid price for product: ${item.name}`);
            }
            return {
                name: item.name,
                quantity: item.quantity || 1,
                amount: Math.round(item.price * 100),
                category: item.category,
            };
        });

        const totalAmount = products.reduce((sum, product) => {
            if (product.amount <= 0 || product.quantity <= 0) {
                throw new Error("Invalid product amount or quantity");
            }
            return sum + product.amount * product.quantity;
        }, 0);

        if (isNaN(totalAmount) || totalAmount <= 0) {
            throw new Error("Total amount calculation failed.");
        }

        const stock = await Stock.find({ ProductId: { $in: order.map(item => item.productId) } });
        for (let item of order) {
            let productStock = stock.find(s => s.ProductId.toString() === item.productId.toString());
            if (!productStock || productStock.stock < item.quantity) {
                return res.status(status.BAD_REQUEST).json({
                    message: `Insufficient stock for product ${item.name}`
                });
            }
            const orders = new Order({
                userId: userId,
                username: user.firstname,
                productname: item.name,
                image: item.image,
                price: parseInt(item.price),
                quantity: parseInt(item.quantity),
                category: item.category,
                total: item.price * item.quantity,
                address: street_address,
                cartId: item._id,
                status: "Delivered"
            });
            await orders.save();
            await Stock.findOneAndUpdate(
                { ProductId: item.productId },
                { $inc: { stock: -item.quantity } },
                { new: true, runValidators: true }
            );
        }
        const productIds = order.map((item) => item._id);
        const billing = new Billing({
            firstname,
            lastname,
            company,
            country,
            street_address,
            city,
            province,
            zipcode,
            phone,
            email,
            additional,
            products,
            total: totalAmount / 100,
            userId: userId,
            productIds: productIds,
        });

        await billing.save();
        await Promise.all(products.map(async (product) => {
            const existingSell = await Sell.findOne({ name: product.name });
            if (!existingSell) {
                await new Sell({
                    name: product.name,
                    quantity: product.quantity,
                    category: product.category,
                }).save();
            } else {
                await Sell.findByIdAndUpdate(
                    existingSell._id,
                    { $inc: { quantity: product.quantity } },
                    { new: true, runValidators: true }
                );
            }
        }));
        const productname = order.map((item) => item.name);
        const productquantity = order.map((item) => item.quantity);
        const paymentResponse = await payment({
            username: name,
            email: email,
            product: productname.join(", "),
            quantity: productquantity.reduce((sum, q) => sum + q, 0),
            amount: totalAmount,
        });
        if (paymentResponse.orderId) {
            billing.orderId = paymentResponse.orderId;
            billing.status = "completed";
            await billing.save();
            return res.status(200).json({
                message: "Payment session created successfully",
                paymentResponse,
            });
        } else {
            billing.status = "canceled";
            await billing.save();

            return res.status(status.OK).json({
                message: "Payment session creation failed",
                paymentResponse,
            });
        }
    } catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message,
        });
    }
};

exports.orderitems = async (req, res) => {
    try {
        const userId = req.user._id;
        const order = await Cart.find({ userId: userId });

        if (order.length === 0) {
            return res.status(status.NOT_FOUND).json({
                message: "Order not found"
            });
        }
        const orderItems = order.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity,
        }));
        const total = order.reduce((sum, item) => sum + item.price * item.quantity, 0);

        return res.status(status.OK).json({
            message: "Order items retrieved successfully",
            data: orderItems,
            total: total
        });
    } catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.orderstatus = async (req, res) => {
    try {
        const userId = req.user._id;
        const orderId = req.params.orderId;
        const order = await Cart.aggregate([{
            $match: {
                $and: [
                    { userId: userId },
                    { _id: orderId }
                ]
            }
        },
        {
            $project: {
                status: 1
            }
        }]);
        return res.status(status.OK).json({
            message: "Order status retrieved successfully",
            data: order
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};
