const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Billing = require('../models/billing.model');
const Sell = require('../models/sells.model');
const Stock = require('../models/stock.model');
const User = require('../models/user.model');

const sendSuccessEmail = async (userEmail, products, totalAmount) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        let productRows = products.map(product => `
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${product.name}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${product.quantity}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">₹${product.amount / 100}</td>
            </tr>
        `).join('');

        const mailOptions = {
            from: process.env.EMAIL,
            to: userEmail,
            subject: "🛍️ Purchase Confirmation - Your Order Details",
            html: `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333; margin: 0; padding: 0; }
        .email-container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
        .header { background-color: #4CAF50; color: white; text-align: center; padding: 20px; font-size: 20px; font-weight: bold; }
        .content { padding: 20px; text-align: left; }
        .table-container { margin-top: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .footer { background-color: #f1f1f1; text-align: center; padding: 10px; font-size: 14px; color: #555; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">Thank You for Your Purchase!</div>
        <div class="content">
            <p>Dear Customer,</p>
            <p>We are pleased to confirm your purchase. Below are your order details:</p>
            <div class="table-container">
                <table>
                    <tr>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
                    ${productRows}
                </table>
            </div>
            <p><strong>Total Amount Paid: ₹${totalAmount}</strong></p>
            <p>Thank you for shopping with us!</p>
        </div>
        <div class="footer">
            <p>&copy; 2025 Furniro. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`
        };

        await transporter.sendMail(mailOptions);
        console.log("Success email sent successfully!");
    } catch (error) {
        console.error("Error sending success email:", error);
    }
};

// router.post('/razorpay-webhook', async (req, res) => {
//     const secret = 'Furniro';
//     const shasum = crypto.createHmac('sha256', secret)
//         .update(JSON.stringify(req.body))
//         .digest('hex');

//     if (shasum !== req.headers['x-razorpay-signature']) {
//         return res.status(400).json({ success: false, message: 'Invalid signature' });
//     }

//     const event = req.body.event;
//     const payment = req.body.payload.payment.entity;

//     try {
//         if (event === 'payment.captured') {
//             console.log('Payment successful:', payment);
//             const billing = await Billing.findOne({ orderId: payment.order_id });

//             if (!billing) {
//                 return res.status(404).json({ success: false, message: "Billing record not found" });
//             }
//             billing.paymentId = payment.Id;
//             billing.status = "completed";
//             await billing.save();

//             await Promise.all(billing.products.map(async (product) => {
//                 await Stock.findOneAndUpdate(
//                     { ProductId: product.productId },
//                     { $inc: { stock: -product.quantity } },
//                     { new: true, runValidators: true }
//                 );

//                 const existingSell = await Sell.findOne({ name: product.name });
//                 if (!existingSell) {
//                     await new Sell({
//                         name: product.name,
//                         quantity: product.quantity,
//                         category: product.category,
//                     }).save();
//                 } else {
//                     await Sell.findByIdAndUpdate(
//                         existingSell._id,
//                         { $inc: { quantity: product.quantity } },
//                         { new: true, runValidators: true }
//                     );
//                 }
//             }));

//             // Send confirmation email
//             await sendSuccessEmail(billing.email, billing.products, billing.total);

//             return res.json({ success: true, message: "Payment captured, billing updated, email sent" });
//         } else if (event === 'payment.failed') {
//             console.log('Payment failed:', payment);

//             const billing = await Billing.findOne({ orderId: payment.order_id });
//             if (billing) {
//                 billing.status = "failed";
//                 await billing.save();
//             }

//             return res.json({ success: true, message: "Payment failed, status updated" });
//         } else {
//             console.log('Unhandled event:', event);
//         }

//         res.json({ success: true });
//     } catch (error) {
//         console.error('Error processing webhook:', error);
//         res.status(500).json({ success: false, message: 'Webhook processing failed' });
//     }
// });

// router.post('/razorpay-webhook', async (req, res) => {
//     const secret = 'Furniro';
//     try {
//         const shasum = crypto.createHmac('sha256', secret)
//             .update(JSON.stringify(req.body))
//             .digest('hex');
//         if (shasum !== req.headers['x-razorpay-signature']) {
//             return res.status(400).json({ success: false, message: 'Invalid signature' });
//         }

//         const event = req.body.event;
//         const payment = req.body.payload.payment.entity;

//         if (event === 'payment.captured') {
//             console.log('Payment successful:', payment);

//             const billing = await Billing.findOne({ orderId: payment.order_id });

//             if (!billing) {
//                 return res.status(404).json({ success: false, message: "Billing record not found" });
//             }

//             // Update billing details after payment
//             billing.paymentId = payment.id;
//             billing.status = "completed";
//             await billing.save();

//             // Reduce stock and update sold products
//             await Promise.all(billing.products.map(async (product) => {
//                 await Stock.findOneAndUpdate(
//                     { ProductId: product.productId },
//                     { $inc: { stock: -product.quantity } },
//                     { new: true, runValidators: true }
//                 );

//                 const existingSell = await Sell.findOne({ name: product.name });
//                 if (!existingSell) {
//                     await new Sell({
//                         name: product.name,
//                         quantity: product.quantity,
//                         category: product.category,
//                     }).save();
//                 } else {
//                     await Sell.findByIdAndUpdate(
//                         existingSell._id,
//                         { $inc: { quantity: product.quantity } },
//                         { new: true, runValidators: true }
//                     );
//                 }
//             }));

//             // Send confirmation email
//             await sendSuccessEmail(billing.email, billing.products, billing.total);

//             return res.json({ success: true, message: "Payment captured, billing updated, email sent" });

//         } else if (event === 'payment.failed') {
//             console.log('Payment failed:', payment);

//             const billing = await Billing.findOne({ orderId: payment.order_id });
//             if (billing) {
//                 billing.status = "failed";
//                 await billing.save();
//             }

//             return res.json({ success: true, message: "Payment failed, status updated" });
//         }

//         res.json({ success: true });
//     } catch (error) {
//         console.error('Error processing webhook:', error);
//         res.status(500).json({ success: false, message: 'Webhook processing failed' });
//     }
// });

router.post("/add-wallet", async (req, res) => {
    try {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'Furniro';
        const shasum = crypto.createHmac("sha256", secret)
            .update(JSON.stringify(req.body))
            .digest("hex");

        if (shasum !== req.headers["x-razorpay-signature"]) {
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }
        const body = JSON.stringify(req.body);
        console.log(body)
        const event = req.body.event;
        const payment = req.body.payload.payment.entity;
        console.log(payment)

        if (!payment) {
            return res.status(400).json({ success: false, message: "Invalid payment data" });
        }

        const userEmail = payment.notes?.email;
        if (!userEmail) {
            return res.status(400).json({ success: false, message: "User email not found in payment notes" });
        }

        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (event === "payment.captured") {
            const walletAmount = payment.amount / 100;
            user.wallet += walletAmount;
            await user.save();

            return res.json({
                success: true,
                message: `Wallet updated successfully. Added ₹${walletAmount}`,
            });
        } else if (event === "payment.failed") {
            console.log("Payment failed:", payment);
            return res.json({ success: false, message: "Payment failed, no wallet update" });
        } else {
            console.log("Unhandled event:", event);
        }

        res.json({ success: true });
    } catch (error) {
        console.error("Webhook error:", error);
        res.status(500).json({ success: false, message: "Webhook processing failed" });
    }
});

module.exports = router;
