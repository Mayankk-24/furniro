const Admin = require("../../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getFileUrl } = require("../../utils/cloudinaryConfig");
const { status } = require("http-status");

exports.register = async (req, res) => {
    try {
        const { name, mobile, email, address, zipcode, city, state, country, password } = req.body;
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(status.CONFLICT).json({
                message: "Email already exists",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new Admin({ name, mobile, email, address, zipcode, city, state, country, image: null, password: hashedPassword, role: "admin" });
        await admin.save();
        return res.status(status.OK).json({
            message: "Admin created successfully",
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(status.BAD_REQUEST).json({
                message: "Email and password are required",
            });
        }
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(status.CONFLICT).json({
                message: "Invalid email"
            });
        }
        if (admin.role !== "admin") {
            return res.status(status.UNAUTHORIZED).json({
                message: "You are not an admin",
            });
        }
        const isValidPassword = await bcrypt.compare(password, admin.password);
        if (!isValidPassword) {
            return res.status(status.UNAUTHORIZED).json({
                message: "Invalid password"
            });
        } else {
            const token = jwt.sign({ userId: admin._id }, process.env.SECRET_KEY, { expiresIn: "1h" });
            const option = {
                httpOnly: true,
                maxAge: 3600000,
                secure: process.env.NODE_ENV === "production" ? true : false,
                sameSite: "strict",
                path: "/admin"
            };
            res.cookie("TOKEN", token, option);
            return res.status(status.OK).json({
                message: "Admin logged in successfully",
                token: token,
                role: admin.role
            });
        }
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.singleuser = async (req, res) => {
    try {
        const id = req.user._id;
        const user = await Admin.findById(id);
        if (!user) {
            return res.status(status.NOT_FOUND).json({
                message: "User not found"
            });
        }
        user.image = getFileUrl(user.image);
        return res.status(status.OK).json({
            message: "User fetched successfully",
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
        const user = await Admin.findById(id);
        if (!user) {
            return res.status(status.NOT_FOUND).json({
                message: "User not found"
            });
        } else {
            if (req.file) {
                updateddata.image = req.file?.filename || null;
            }
            console.log(updateddata.image);
            const updatedUser = await Admin.findByIdAndUpdate(user._id, updateddata, { new: true, runValidators: true });
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

exports.changePass = async (req, res) => {
    try {
        const id = req.user._id;
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(status.NOT_FOUND).json({
                message: "User not found"
            });
        }
        const { oldPassword, newPassword, confirmPassword } = req.body;
        if (newPassword !== confirmPassword) {
            return res.status(status.BAD_REQUEST).json({
                message: "New Both Passwords are not match with each-other"
            });
        }
        const isValidPassword = await bcrypt.compare(oldPassword, admin.password);
        if (!isValidPassword) {
            return res.status(status.UNAUTHORIZED).json({
                message: "Invalid old password"
            });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        admin.password = hashedPassword;
        await admin.save();
        return res.status(status.OK).json({
            message: "Password changed successfully",
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.logout = async (req, res) => {
    try {
        res.clearCookie("TOKEN", {
            httpOnly: true,
            secure: process.env.NODE_ENV,
            sameSite: "strict"
        });

        return res.status(status.OK).json({
            message: "Logged out successfully"
        });
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};
