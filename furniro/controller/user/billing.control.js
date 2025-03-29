const Billing = require("../../models/billing.model");
const { payment, refund } = require("../../utils/payment");
const Stock = require("../../models/stock.model");
const { status } = require("http-status");
const Cart = require("../../models/cart.model");
const User = require("../../models/user.model");
const Sell = require("../../models/sells.model");
const nodemailer = require("nodemailer");
const Wallet = require("../../models/wallet.model")

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

// exports.paybill = async (req, res) => {
//     try {
//         const userId = req.user._id;
//         const user = await User.findById(userId);
//         const { firstname, lastname, company, country, street_address, city, province, zipcode, phone, email, additional } = req.body;
//         const name = firstname + " " + lastname;
//         const order = await Cart.find({ userId: userId });

//         if (order.length === 0) {
//             return res.status(404).json({ message: "Order not found" });
//         }

//         const products = order.map((item) => {
//             if (!item.price || isNaN(item.price)) {
//                 throw new Error(`Invalid price for product: ${item.name}`);
//             }
//             return {
//                 name: item.name,
//                 quantity: item.quantity || 1,
//                 amount: Math.round(item.price * 100),
//                 category: item.category,
//             };
//         });

//         const totalAmount = products.reduce((sum, product) => {
//             if (product.amount <= 0 || product.quantity <= 0) {
//                 throw new Error("Invalid product amount or quantity");
//             }
//             return sum + product.amount * product.quantity;
//         }, 0);

//         if (isNaN(totalAmount) || totalAmount <= 0) {
//             throw new Error("Total amount calculation failed.");
//         }
//         const productIds = order.map((item) => item._id);
//         const billing = new Billing({
//             firstname,
//             lastname,
//             company,
//             country,
//             street_address,
//             city,
//             province,
//             zipcode,
//             phone,
//             email,
//             additional,
//             products,
//             total: totalAmount / 100,
//             userId: userId,
//             productIds: productIds
//         });

//         await billing.save();

//         const paymentResponse = await payment({
//             username: name,
//             email: email,
//             product: products.map(p => p.name).join(", "),
//             quantity: products.reduce((sum, p) => sum + p.quantity, 0),
//             amount: totalAmount,
//         });
//         if (paymentResponse.orderId) {
//             billing.orderId = paymentResponse.orderId;
//             await billing.save();
//             user.orderId = paymentResponse.orderId;
//             await user.save();
//             return res.status(200).json({
//                 message: "Payment session created successfully",
//                 paymentResponse,
//             });
//         } else {
//             return res.status(500).json({
//                 message: "Payment session creation failed",
//                 paymentResponse,
//             });
//         }
//     } catch (err) {
//         return res.status(500).json({ message: err.message });
//     }
// };

exports.paybill = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        const { firstname, lastname, company, country, street_address, city, province, zipcode, phone, email, additional } = req.body;
        const name = `${firstname} ${lastname}`;

        // Fetch all items in the user's cart
        const order = await Cart.find({ userId: userId });

        if (order.length === 0) {
            return res.status(404).json({ message: "Cart is empty" });
        }

        // Prepare products list
        const products = order.map((item) => {
            if (!item.price || isNaN(item.price)) {
                throw new Error(`Invalid price for product: ${item.name}`);
            }
            return {
                name: item.name,
                quantity: item.quantity || 1,
                amount: Math.round(item.price * 100),
                category: item.category,
                productId: item._id // Store product ID for reference
            };
        });

        // Calculate total price
        const totalAmount = products.reduce((sum, product) => {
            if (product.amount <= 0 || product.quantity <= 0) {
                throw new Error("Invalid product amount or quantity");
            }
            return sum + product.amount * product.quantity;
        }, 0);

        if (totalAmount <= 0) {
            throw new Error("Total amount calculation failed.");
        }

        const productIds = order.map((item) => item._id);

        // Create a single billing record for the entire order
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
            status: "pending"
        });

        await billing.save();

        // Call payment gateway to generate an order ID
        const paymentResponse = await payment({
            username: name,
            email: email,
            product: products.map(p => p.name).join(", "),
            quantity: products.reduce((sum, p) => sum + p.quantity, 0),
            amount: totalAmount,
        });

        if (paymentResponse.orderId) {
            billing.orderId = paymentResponse.orderId;
            await billing.save();
            user.orderId = paymentResponse.orderId;
            await user.save();
            order.orderType = "card/upi";
            await order.save();

            return res.status(200).json({
                message: "Payment session created successfully",
                paymentResponse,
            });
        } else {
            return res.status(500).json({
                message: "Payment session creation failed",
                paymentResponse,
            });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.paymentSuccess = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const payment = await Billing.findOne({ orderId: orderId });
        if (!payment) {
            return res.status(404).json({ message: "Order not found" });
        }
        payment.status = "completed";
        await payment.save();
        return res.status(200).json({ message: "Payment completed successfully" });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).message({
            message: err.message
        })
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

exports.cancleRequest = async (req, res) => {
    try {
        const orderId = req.params.Id;
        const { productsToCancel, reason } = req.body;
        const user = await User.findOne({ _id: req.user._id });
        if (!user) {
            return res.status(status.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
        }
        const billing = await Billing.findOne({ orderId });
        if (!billing) {
            return res.status(status.BAD_REQUEST).json({ success: false, message: "Order not found" });
        }
        const canceledProducts = billing.products.filter(product =>
            productsToCancel.includes(product.name)
        );
        if (canceledProducts.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "No matching products found in the order" });
        }
        billing.products = billing.products.filter(product =>
            !productsToCancel.includes(product.name)
        );
        const paymentId = billing.paymentId;
        const refundResponse = await refund({ paymentId, reason, billing }); // Pass billing as well

        const totalAmount = await canceledProducts.products.map((item) => {
            return item.amount * item.quantity
        })

        if (refundResponse.status !== 200) {
            return res.status(status.BAD_REQUEST).json({ success: false, message: "Product cancellation failed" });
        }
        if (billing.products.length === 0) {
            billing.status = "canceled";
        }
        await Promise.all(canceledProducts.map(async (product) => {
            await Stock.findOneAndUpdate(
                { ProductId: product.productId },
                { $inc: { stock: product.quantity } },
                { new: true, runValidators: true }
            )
            const existingSell = await Sell.findOne({ name: product.name });
            await Sell.findByIdAndUpdate(
                existingSell._id,
                { $inc: { quantity: -product.quantity } },
                { new: true, runValidators: true }
            );
        }));
        user.wallet += totalAmount;
        await user.save();
        await billing.save();
        await sendCancelEmail(user.email, user.firstname, canceledProducts, reason);
        return res.status(status.OK).json({ success: true, message: "Order cancellation successful" });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({ message: err.message });
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

