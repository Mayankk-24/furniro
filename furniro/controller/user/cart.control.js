const Cart = require("../../models/cart.model");
const Card = require("../../models/card.model");
const Size = require("../../models/size.model");
const Color = require("../../models/color.model");
const Product = require("../../models/product.model");
const { status } = require("http-status");
const User = require("../../models/user.model");

exports.addcart = async (req, res) => {
    try {
        const productId = req.params.Id;
        const userId = req.user._id;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(status.NOT_FOUND).json({ message: "Product not found" });
        }
        const existingCartItem = await Cart.findOne({ userId, productId });
        const quantity = parseInt(req.body.quantity) || 1;

        if (existingCartItem) {
            await Cart.updateOne(
                { _id: existingCartItem._id },
                { $inc: { quantity: quantity, subtotal: product.price * quantity } },
                { runValidators: true }
            );

            return res.status(status.OK).json({ message: "Product quantity updated in cart" });
        } else {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(status.NOT_FOUND).json({ message: "User not found" });
            }

            const newCartItem = new Cart({
                customername: user.firstname,
                image: product.image[0],
                name: product.title,
                price: parseInt(product.price),
                size: req.body.size || null,
                color: req.body.color || null,
                category: product.category,
                quantity: quantity,
                productId: product._id,
                subtotal: product.price * quantity,
                userId: userId
            });

            await newCartItem.save();
            return res.status(status.OK).json({ message: "Product added to cart successfully" });
        }
    } catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
};

exports.directCart = async (req, res) => {
    try {
        const cardId = req.params.Id;
        const userId = req.user._id;
        const card = await Card.findById({ _id: cardId });
        const product = await Product.findOne({ cardId: card._id });
        if (!product) {
            return res.status(status.NOT_FOUND).json({ message: "Product not found" });
        }
        const productId = product._id;
        const existingCartItem = await Cart.findOne({ userId, productId });
        const quantity = parseInt(req.body.quantity) || 1;

        if (existingCartItem) {
            await Cart.updateOne(
                { _id: existingCartItem._id },
                { $inc: { quantity: quantity, subtotal: product.price * quantity } },
                { runValidators: true }
            );

            return res.status(status.OK).json({ message: "Product quantity updated in cart" });
        } else {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(status.NOT_FOUND).json({ message: "User not found" });
            }
            const size = await Size.findOne({ ProductId: product._id });
            const color = await Color.findOne({ ProductId: product._id });
            const newCartItem = new Cart({
                customername: user.firstname,
                image: product.image[0],
                name: product.title,
                price: parseInt(product.price),
                size: size.size[0],
                color: color.code[0],
                category: product.category,
                quantity: quantity,
                productId: product._id,
                subtotal: product.price * quantity,
                userId: userId
            });

            await newCartItem.save();
            return res.status(status.OK).json({ message: "Product added to cart successfully" });
        }
    } catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
};

exports.updatecart = async (req, res) => {
    try {
        const ProductId = req.params.Id;
        const userId = req.user._id;
        const cartproduct = await Cart.findOne({
            $and: [
                { userId: userId },
                { productId: ProductId }
            ]
        });
        if (!cartproduct) {
            return res.status(status.NOT_FOUND).json({
                message: "Cart product not found"
            });
        } else {
            const quantity = req.query.quantity;
            if (isNaN(quantity) || quantity <= 0) {
                return res.status(status.BAD_REQUEST).json({
                    message: "Invalid quantity"
                });
            }
            cartproduct.quantity = quantity;
            const price = cartproduct.price;
            cartproduct.subtotal = quantity * price;
            await cartproduct.save();
            // const cart = await Cart.findByIdAndUpdate(cartproduct._id, { $set: { quantity: quantity } }, { new: true, runValidators: true });
            return res.status(status.OK).json({
                message: "Cart product updated successfully"
            });
        }
    } catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.deletecart = async (req, res) => {
    try {
        const ProductId = req.params.Id;
        const userId = req.user._id;
        const cartproduct = await Cart.findOne({
            $and: [
                { userId: userId },
                { productId: ProductId }
            ]
        });
        if (!cartproduct) {
            return res.status(status.NOT_FOUND).json({
                message: "Cart product not found"
            });
        }
        await Cart.deleteOne({ _id: cartproduct._id });
        return res.status(status.OK).json({
            message: "Cart product and related order deleted successfully"
        });
    } catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.singleUserCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.find({ userId: userId });
        if (cart.length == 0) {
            return res.status(status.NOT_FOUND).json({
                message: "Cart is empty"
            })
        }
        return res.status(status.OK).json({
            message: "Cart products found",
            data: cart
        })
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.totalamount = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.find({ userId: userId });
        if (cart.length === 0) {
            return res.status(status.NOT_FOUND).json({
                message: "Cart not found"
            });
        }
        let total = 0;
        cart.forEach((item) => {
            total += item.subtotal;
        });
        return res.status(status.OK).json({
            message: "Total amount found",
            data: total
        });
    } catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};
