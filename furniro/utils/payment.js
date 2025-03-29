const Razorpay = require("razorpay");
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.payment = async ({ username, email, product, quantity, amount }) => {
    try {
        const parsedAmount = parseInt(amount, 10);
        const parsedQuantity = parseInt(quantity, 10);

        if (isNaN(parsedAmount) || isNaN(parsedQuantity) || parsedAmount <= 0 || parsedQuantity <= 0) {
            return {
                status: 400,
                message: "Amount and quantity must be valid numbers greater than zero",
            };
        }

        const totalAmount = parsedAmount * parsedQuantity;

        const options = {
            amount: totalAmount,
            currency: "INR",
            receipt: `${email}-${Date.now()}`,
            payment_capture: 1,
            notes: {
                product_name: product,
                username,
                email,
            },
        };

        const order = await razorpay.orders.create(options);
        if (!order) {
            return { status: 400, message: "Order creation failed" };
        }

        return {
            orderId: order.id,
            amount: order.amount,
            receipt: order.receipt,
            currency: order.currency,
            notes: order.notes,
        };
    } catch (err) {
        console.error("Payment error:", err);
        return {
            status: 500,
            message: err.message || "Payment creation failed",
        };
    }
};


exports.refund = async ({ paymentId, reason, billing }) => { // Added billing as a parameter
    try {
        const refund = await razorpay.payments.refund(paymentId, {  // orderId should be a valid payment_id
            amount: billing.total * 100, // Use billing.total from parameter
            speed: "normal",
            notes: {
                reason
            }
        });
        return {
            status: 200,
            message: "Refund successful",
            refund
        };
    } catch (error) {
        console.log(error); // Fix: Log the correct error variable
        return {
            status: error.status || 500,
            message: error.message || "Refund creation failed",
        };
    }
};

