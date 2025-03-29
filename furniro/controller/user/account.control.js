const User = require("../../models/user.model");
const Billing = require("../../models/billing.model");
const { getFileUrl } = require("../../utils/cloudinaryConfig");
const { status } = require("http-status");
const bcrypt = require("bcryptjs");
const { payment } = require("../../utils/payment");
const Wallet = require("../../models/wallet.model")

exports.profile = async (req, res) => {
    try {
        const id = req.user._id;
        const user = await User.findById(id);
        if (!user) {
            return res.status(status.NOT_FOUND).json({
                message: "User not found"
            });
        }
        user.image = getFileUrl(user.image);
        return res.status(status.OK).json({
            message: "User found",
            data: user
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.update = async (req, res) => {
    try {
        const id = req.user._id;
        const updateddata = { ...req.body };
        const user = await User.findById(id);
        if (!user) {
            return res.status(status.NOT_FOUND).json({
                message: "User not found"
            });
        } else {
            if (req.file) {
                updateddata.image = req.file?.filename || null;
            }
            const updatedUser = await User.findByIdAndUpdate(user._id, updateddata, { new: true, runValidators: true });
            return res.status(status.OK).json({
                message: "User updated successfully",

            });
        }
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.changepassword = async (req, res) => {
    try {
        const id = req.user._id;
        const user = await User.findById(id);
        if (!user) {
            return res.status(status.NOT_FOUND).json({
                message: "User not found"
            });
        }
        const { oldPassword, newPassword, confirmPassword } = req.body;
        if (newPassword !== confirmPassword) {
            return res.status(status.BAD_REQUEST).json({
                message: "Passwords do not match"
            });
        }
        const isValidPassword = await bcrypt.compare(oldPassword, user.password);
        if (!isValidPassword) {
            return res.status(status.BAD_REQUEST).json({
                message: "Invalid old password"
            });
        };
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        return res.status(status.OK).json({
            message: "Password updated successfully"
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.addWallet = async (req, res) => {
    try {
        const id = req.user._id;
        const user = await User.findById(id);
        if (!user) {
            return res.status(status.NOT_FOUND).json({ message: "User not found" });
        }

        const { wallet } = req.body;
        if (!wallet || isNaN(wallet) || wallet <= 0) {
            return res.status(status.BAD_REQUEST).json({ message: "Invalid wallet amount" });
        }

        const paymentResponse = await payment({
            username: user.firstname,
            email: user.email,
            product: "wallet",
            quantity: 1,
            amount: wallet,
        });

        if (!paymentResponse.orderId) {
            return res.status(status.BAD_REQUEST).json({ message: "Wallet could not be added" });
        }
        user.orderId = paymentResponse.orderId;
        user.wallet += wallet;
        await user.save();

        const walletCreate = new Wallet({
            userId: user._id,
            type: 'credit',
            description: 'Amount Added',
            amount: wallet
        });
        await walletCreate.save();

        return res.status(status.OK).json({
            message: "Wallet amount added successfully",
            paymentResponse,
        });
    } catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
};

exports.getUserPurchases = async (req, res) => {
    try {
        const userPurchases = await Billing.find({ userId: req.user._id })
            .select("products total status street_address createdAt")
            .lean();
        if (!userPurchases) {
            return res.status(status.NOT_FOUND).json({
                message: "No purchases found"
            });
        }else if (userPurchases.status !== "completed"){
            return res.status(status.NOT_FOUND).json({
                message: "No completed purchases found"
            });
        }
        return res.status(status.OK).json({
            message: "Purchases found",
            data: userPurchases
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
}

exports.getWalletTransactions = async (req, res) => {
    try {
        const transactions = await Wallet.find({ userId: req.user._id }).sort({ createdAt: -1 });
        if (!transactions) {
            return res.status(status.NOT_FOUND).json({ message: "No transactions found" });
        }
        return res.status(status.OK).json({ transactions });
    } catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
};

