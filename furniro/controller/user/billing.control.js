const Billing = require("../../models/billing.model");
const { payment, refund } = require("../../utils/payment");
const Stock = require("../../models/stock.model");
const { status } = require("http-status");
const Cart = require("../../models/cart.model");
const Order = require("../../models/order.model")
const User = require("../../models/user.model");
const Sell = require("../../models/sells.model");
const nodemailer = require("nodemailer");
const Wallet = require("../../models/wallet.model")
const Razorpay = require("razorpay");
const mongoose = require("mongoose");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

const sendRefundEmail = async (userEmail, username, amount, reason, bankName, accountNumber) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL,
            to: userEmail,
            subject: "✅ Withdrawal Processed Successfully",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; background: #f9f9f9; padding: 20px; border-radius: 8px;">
                    <h2 style="text-align: center; color: green;">Withdrawal Processed</h2>
                    <p>Hello ${username},</p>
                    <p>Your withdrawal request has been successfully processed. The details of the transaction are as follows:</p>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                        <thead>
                            <tr style="background: #f2f2f2;">
                                <th style="border: 1px solid #ddd; padding: 8px;">Amount</th>
                                <th style="border: 1px solid #ddd; padding: 8px;">Bank Name</th>
                                <th style="border: 1px solid #ddd; padding: 8px;">Account Number</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="border: 1px solid #ddd; padding: 8px;">$${amount}</td>
                                <td style="border: 1px solid #ddd; padding: 8px;">${bankName}</td>
                                <td style="border: 1px solid #ddd; padding: 8px;">**** **** **** ${accountNumber.slice(-4)}</td>
                            </tr>
                        </tbody>
                    </table>
                    <p><strong>Withdrawal Reason:</strong> ${reason}</p>
                    <p>The amount will be credited to your bank account within 2-5 business days.</p>
                    <p>If you did not request this transaction, please contact our support team immediately.</p>
                    <p>Thank you for using our services!</p>
                    <p><strong>Furniro Team</strong></p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log("Refund email sent successfully!");
    } catch (error) {
        console.error("Error sending refund email:", error);
    }
};

const sendCancelEmail = async (userEmail, username, canceledProducts, reason) => {
    try {
        const productTable = canceledProducts.map(product => `
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${product.name}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${product.quantity}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">₹${(product.amount / 100).toFixed(2)}</td>
            </tr>
        `).join("");

        const mailOptions = {
            from: process.env.EMAIL,
            to: userEmail,
            subject: "❌ Order Cancellation Confirmation",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; background: #f9f9f9; padding: 20px; border-radius: 8px;">
                    <h2 style="text-align: center; color: red;">Order Canceled</h2>
                    <p>Hello ${username},</p>
                    <p>Your cancellation request has been successfully processed for the following products:</p>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                        <thead>
                            <tr style="background: #f2f2f2;">
                                <th style="border: 1px solid #ddd; padding: 8px;">Product Name</th>
                                <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
                                <th style="border: 1px solid #ddd; padding: 8px;">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${productTable}
                        </tbody>
                    </table>
                    <p><strong>Cancellation Reason:</strong> ${reason}</p> 
                 <p>The refund will reflect in your wallet within 5-7 business days.</p>
                    <p>If you have any questions, feel free to contact our support team.</p>
                    <p>Thank you for choosing Furniro!</p>
                    <p><strong>Furniro Team</strong></p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log("Cancellation email sent successfully!");
    } catch (error) {
        console.error("Error sending cancellation email:", error);
    }
};

exports.paybill = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { firstname, lastname, company, country, street_address, city, province, zipcode, phone, email, additional } = req.body;
        
        // Validate required fields
        if (!firstname || !lastname || !country || !street_address || !city || !province || !zipcode || !phone || !email ) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

    

        // Fetch all items in the user's cart
        const cart = await Cart.find({ userId: userId });

        if (cart.length === 0) {
            return res.status(404).json({ message: "Cart is empty" });
        }

        try {
            // Check stock availability and prepare products list
            const products = [];
            let totalAmount = 0;

            for (const item of cart) {
                const stock = await Stock.findOne({ ProductId: item.productId });
                if (!stock || stock.stock < item.quantity) {
                    throw new Error(`Insufficient stock for product: ${item.name}`);
                }

                const productAmount = Math.round(item.price * 100);
                if (productAmount <= 0 || item.quantity <= 0) {
                    throw new Error(`Invalid product amount or quantity for: ${item.name}`);
                }

                products.push({
                    name: item.name,
                    quantity: item.quantity,
                    amount: productAmount,
                    category: item.category,
                    productId: item.productId,
                    image: item.image
                });

                totalAmount += productAmount * item.quantity;
            }

            if (totalAmount <= 0) {
                throw new Error("Total amount calculation failed");
            }

            // Check wallet balance if wallet payment
            if (paymentMethod === "wallet" && user.wallet < totalAmount / 100) {
                throw new Error("Insufficient wallet balance");
            }

            // Create billing record
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
                productIds: cart.map(item => item._id),
                status: "pending",
                paymentMethod: "card/upi"
            });

            await billing.save();
            // Handle Razorpay payment
            const razorpay = new Razorpay({
                key_id: process.env.RAZORPAY_KEY_ID,
                key_secret: process.env.RAZORPAY_KEY_SECRET,
            });

            const paymentResponse = await razorpay.orders.create({
                amount: totalAmount,
                currency: "INR",
                receipt: `order_${Date.now()}`,
                notes: {
                    userId: userId.toString(),
                    billingId: billing._id.toString()
                }
            });

            if (!paymentResponse || !paymentResponse.id) {
                throw new Error("Failed to create Razorpay order");
            }

            billing.razorpayOrderId = paymentResponse.id;
            await billing.save({ session });

            await session.commitTransaction();
            session.endSession();

            return res.status(200).json({
                message: "Payment session created successfully",
                orderId: paymentResponse.id,
                amount: totalAmount / 100,
                currency: "INR"
            });

        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    } catch (err) {
        console.error("Payment error:", err);
        return res.status(500).json({ message: err.message });
    }
};

exports.paymentSuccess = async (req, res) => {
    try {
        const orderId = req.params.orderId;

        // Validate required fields
        if (!orderId) {
            return res.status(400).json({ message: "Missing orderId required " });
        }

        // Find billing record
        const billing = await Billing.findOne({ razorpayOrderId: orderId })
            .populate("userId")
            .populate("products.productId");

        if (!billing) {
            return res.status(404).json({ message: "Order not found" });
        }
        try {
            // Update billing status
            billing.status = "completed";
            await billing.save();

            // Create single order with multiple products
            const order = new Order({
                username: `${billing.firstname} ${billing.lastname}`,
                products: billing.products.map(product => ({
                    productname: product.name,
                    image: product.productId?.image?.[0] || product.image?.[0] || "default-image.jpg",
                    price: product.amount / 100,
                    quantity: product.quantity,
                    category: product.category || product.productId?.category,
                    subtotal: (product.amount / 100) * product.quantity,
                    cartId: product.productId?._id || product._id
                })),
                total: billing.total,
                address: `${billing.street_address}, ${billing.city}, ${billing.province}, ${billing.zipcode}, ${billing.country}`,
                status: "Processing",
                orderType: billing.paymentMethod === "wallet" ? "wallet" : "card/upi",
                userId: billing.userId,
                billingId: billing._id,
                razorpayOrderId: orderId,
                razorpayPaymentId: payment.id,
                razorpaySignature: razorpay_signature
            });

            // Validate order before saving
            const validationError = order.validateSync();
            if (validationError) {
                throw new Error(`Order validation failed: ${validationError.message}`);
            }

            await order.save({ session });

            // Update stock
            await Promise.all(billing.products.map(async (product) => {
                const stock = await Stock.findOne({ ProductId: product.productId });
                if (!stock || stock.stock < product.quantity) {
                    throw new Error(`Insufficient stock for product: ${product.name}`);
                }
                await Stock.findOneAndUpdate(
                    { ProductId: product.productId },
                    { $inc: { stock: -product.quantity } },
                    { session, new: true, runValidators: true }
                );
            }));

            // Clear cart
            await Cart.deleteMany({ userId: billing.userId }, { session });

            // Send confirmation email
            await sendSuccessEmail(billing.email, billing.products, billing.total);

            await session.commitTransaction();
            session.endSession();

            return res.status(200).json({ 
                message: "Payment completed successfully",
                orderId: order._id
            });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    } catch (err) {
        console.error("Payment success error:", err);
        return res.status(500).json({ message: err.message });
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

        const order = await Order.findOne({
            _id: orderId,
            userId: userId
        }).select('status orderType orderdate products total');

        if (!order) {
            return res.status(status.NOT_FOUND).json({
                message: "Order not found"
            });
        }

        return res.status(status.OK).json({
            message: "Order status retrieved successfully",
            data: {
                status: order.status,
                orderType: order.orderType,
                orderDate: order.orderdate,
                total: order.total,
                products: order.products.map(product => ({
                    name: product.productname,
                    quantity: product.quantity,
                    price: product.price,
                    subtotal: product.subtotal
                }))
            }
        });
    } catch (err) {
        console.error("Order status error:", err);
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.refundRequest = async (req, res) => {
    try {
        const { amount, reason, bankName, accountNumber } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(status.NOT_FOUND).json({ message: "User not found" });
        }
        if (user.wallet < amount) {
            return res.status(status.BAD_REQUEST).json({ message: "Insufficient balance" });
        }
        user.wallet -= amount;
        await user.save();

        const walletCreate = new Wallet({
            userId: user._id,
            type: 'debit',
            description: 'Amount Refunded',
            amount
        });
        await walletCreate.save();
        await sendRefundEmail(user.email, user.firstname, amount, reason, bankName, accountNumber);
        return res.status(status.OK).json({ message: "Refund request processed" });
    } catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
};

exports.cancelRequest = async (req, res) => {
    try {
        const orderId = req.params.Id;
        const { productsToCancel, reason } = req.body;
        const user = await User.findOne({ _id: req.user._id });
        
        if (!user) {
            return res.status(status.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
        }

        const billing = await Billing.findOne({ razorpayOrderId: orderId });
        if (!billing) {
            return res.status(status.BAD_REQUEST).json({ success: false, message: "Order not found" });
        }

        // Validate that the order belongs to the user
        if (billing.userId.toString() !== user._id.toString()) {
            return res.status(status.UNAUTHORIZED).json({ success: false, message: "Not authorized to cancel this order" });
        }

        const canceledProducts = billing.products.filter(product =>
            productsToCancel.includes(product.name)
        );

        if (canceledProducts.length === 0) {
            return res.status(status.NOT_FOUND).json({ 
                success: false, 
                message: "No matching products found in the order" 
            });
        }

        // Calculate total refund amount
        const totalRefundAmount = canceledProducts.reduce((sum, product) => 
            sum + (product.amount * product.quantity), 0
        );

        // Start transaction
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Update billing products
            billing.products = billing.products.filter(product =>
                !productsToCancel.includes(product.name)
            );

            // If all products are canceled, update billing status
            if (billing.products.length === 0) {
                billing.status = "canceled";
            }

            // Process refund if it's a Razorpay payment
            if (billing.paymentMethod === "card/upi" && billing.razorpayPaymentId) {
                const refundResponse = await refund({ 
                    paymentId: billing.razorpayPaymentId, 
                    reason, 
                    billing 
                });

                if (refundResponse.status !== 200) {
                    throw new Error("Refund processing failed");
                }
            }

            // Update stock and sales
            await Promise.all(canceledProducts.map(async (product) => {
                // Restore stock
                await Stock.findOneAndUpdate(
                    { ProductId: product.productId },
                    { $inc: { stock: product.quantity } },
                    { session, new: true, runValidators: true }
                );

                // Update sales
                const existingSell = await Sell.findOne({ name: product.name });
                if (existingSell) {
                    await Sell.findByIdAndUpdate(
                        existingSell._id,
                        { $inc: { quantity: -product.quantity } },
                        { session, new: true, runValidators: true }
                    );
                }
            }));

            // Add refund amount to wallet
            user.wallet += totalRefundAmount / 100;
            await user.save({ session });

            // Create wallet transaction record
            const walletTransaction = new Wallet({
                userId: user._id,
                type: 'credit',
                description: 'Order Cancellation Refund',
                amount: totalRefundAmount / 100
            });
            await walletTransaction.save({ session });

            // Save billing changes
            await billing.save({ session });

            // Send cancellation email
            await sendCancelEmail(user.email, user.firstname, canceledProducts, reason);

            await session.commitTransaction();
            session.endSession();

            return res.status(status.OK).json({ 
                success: true, 
                message: "Order cancellation successful",
                refundAmount: totalRefundAmount / 100
            });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    } catch (err) {
        console.error("Cancel request error:", err);
        return res.status(status.INTERNAL_SERVER_ERROR).json({ 
            success: false,
            message: err.message 
        });
    }
};

exports.walletPayment = async (req, res) => {
    try {
        const { amount } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(status.NOT_FOUND).json({ message: "User not found" });
        }
        if (user.wallet < amount) {
            return res.status(status.BAD_REQUEST).json({ message: "Insufficient wallet balance" });
        }
        user.wallet -= amount;
        await user.save();
        const walletCreate = new Wallet({
            userId: user._id,
            type: 'debit',
            description: 'Product Purchased',
            amount
        });
        await walletCreate.save();
        return res.status(status.OK).json({ message: "Payment successful" });
    } catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
};

