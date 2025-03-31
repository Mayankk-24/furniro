const discount = require("../../models/discount_coupan.model");
const Billing = require("../../models/billing.model");
const User = require("../../models/user.model");
const { status } = require("http-status");

exports.alldiscount = async (req, res) => {
    try {
        const coupan = await discount.find();
        if (!coupan || coupan.length === 0) {
            return res.status(status.NOT_FOUND).json({
                message: "No coupan found"
            });
        }
        return res.status(status.OK).json({
            message: "All coupan retrieved successfully",
            data: coupan
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.applydiscount = async (req, res) => {
    try {
        const userId = req.user._id;
        const id = req.params.id;
        const billing_id = req.params.billing;
        const coupan = await discount.findById(id);
        if (!coupan) {
            return res.status(status.NOT_FOUND).json({
                message: "No coupan found",
            });
        }
        const billing = await Billing.findOne({ _id: billing_id });
        if (!billing) {
            return res.status(status.NOT_FOUND).json({
                message: "No billing found"
            });
        }
        if (billing.discountApplied === true) {
            return res.status(status.BAD_REQUEST).json({
                message: "Discount already applied"
            });
        }
        const user = await User.findById({ _id: userId });
        if (!user) {
            return res.status(status.NOT_FOUND).json({
                message: "User not found"
            });
        }
        if (user.coupan === true) {
            return res.status(status.BAD_REQUEST).json({
                message: "You have already applied a coupan"
            });
        }
        user.coupan = true;
        await user.save();
        const updatedData = await Billing.findByIdAndUpdate(billing._id, { $inc: { total: -coupan.amount }, $set: { discountApplied: true } }, { new: true, runValidators: true });
        if (!updatedData) {
            return res.status(status.BAD_REQUEST).json({
                message: "Failed to update billing"
            });
        }
        return res.status(status.OK).json({
            message: "Coupan applied successfully",
            data: updatedData
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

