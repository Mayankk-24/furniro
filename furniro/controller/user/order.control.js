const Order = require("../../models/order.model");
const Stock = require("../../models/stock.model");
const Cart = require("../../models/cart.model");
const User = require("../../models/user.model");
const NotificationController = require("./notification.control");
const { status } = require("http-status");

exports.singleorder = async (req, res) => {
    try {
        const userId = req.user._id;
        const order = await Cart.find({ userId: userId });
        if (order.length == 0) {
            return res.status(status.NOT_FOUND).json({
                message: "Order not found"
            });
        } else {
            return res.status(status.OK).json({
                message: "Order found",
                order: order
            });
        }
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.createorder = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(status.NOT_FOUND).json({ message: "User not found" });
        }

        const cart = await Cart.find({ userId: userId });
        if (cart.length === 0) {
            return res.status(status.NOT_FOUND).json({ message: "Cart is empty" });
        }

        const stock = await Stock.find({ ProductId: { $in: cart.map(item => item.productId) } });
        const existingOrders = await Order.find({ userId: userId });

        let orders = [];
        let alreadyOrdered = [];

        for (let item of cart) {
            if (existingOrders.some(order => order.productname === item.name)) {
                alreadyOrdered.push(item.name); 
                continue; 
            }

            let productStock = stock.find(s => s.ProductId.toString() === item.productId.toString());
            if (!productStock || productStock.stock < item.quantity) {
                return res.status(status.BAD_REQUEST).json({
                    message: `Insufficient stock for product ${item.name}`
                });
            }

            const order = new Order({
                userId: userId,
                username: user.firstname,
                productname: item.name,
                image: item.image,
                price: parseInt(item.price),
                quantity: parseInt(item.quantity),
                category: item.category,
                total: item.price * item.quantity,
                cartId: item._id
            });

            await order.save();
            orders.push(order);
            await Stock.findOneAndUpdate(
                { ProductId: item.productId },
                { $inc: { stock: -item.quantity } },
                { new: true, runValidators: true }
            );
        }

        let message = "Orders created successfully";
        if (alreadyOrdered.length > 0) {
            message += `. The following products were already ordered and were not added again: ${alreadyOrdered.join(", ")}.`;
        }

        if (orders.length === 0) {
            return res.status(status.BAD_REQUEST).json({ 
                message: `No new orders created. These products are already in your orders: ${alreadyOrdered.join(", ")}` 
            });
        }
        NotificationController.sendNotification({
            userId: userId,
            title: "Order Created",
            message: "Your order has been created successfully"
        });

        return res.status(status.OK).json({
            message: message,
            orders: orders
        });

    } catch (err) {
        console.log(err);
        return res.status(status.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
};

exports.updateorder = async (req, res) => {
    try {
        const id = req.params.Id;
        const userId = req.user._id;
        const order = await Cart.findOne({
            $and: [
                { userId: userId },
                { _id: id }
            ]
        });
        if (!order) {
            return res.status(status.NOT_FOUND).json({
                message: "Cart not found"
            });
        } else {
            const updatedOrder = await Order.findByIdAndUpdate(order._id, { $set: { quantity: req.body.quantity } }, { new: true, runValidators: true });
            return res.status(status.OK).json({
                message: "Cart updated successfully",
                order: updatedOrder
            });
        }
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.deleteorder = async (req, res) => {
    try {
        const id = req.params.Id;
        const userId = req.user._id;
        const order = await Cart.findOne({
            $and: [
                { userId: userId },
                { _id: id }
            ]
        });
        if (!order) {
            return res.status(status.NOT_FOUND).json({
                message: "Cart not found"
            });
        }
        const stock = await Stock.findOne({ ProductId: order.productId });
        await Stock.findByIdAndUpdate(stock._id, { $inc: { stock: order.quantity } });
        await Cart.findOneAndDelete({ _id: id });
        return res.status(status.OK).json({
            message: "Cart deleted"
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({

            message: err.message
        });
    }
};