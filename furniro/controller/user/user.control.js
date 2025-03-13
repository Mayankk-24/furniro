const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user.model");
const nodemailer = require("nodemailer");
const NotificationController = require("./notification.control");
const { status } = require("http-status");
const validator = require("validator");
const randomstring = require("randomstring");

exports.register = async (req, res) => {
    try {
        const { firstname, lastname, mobile, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(status.CONFLICT).json({
                message: "Email already in use"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ firstname, lastname, mobile, email, image: null, password: hashedPassword });
        await user.save();
        return res.status(status.OK).json({
            message: "User created successfully"
        });
    }
    catch (err) {
        console.log(err);
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!validator.isEmail(email)) {
            return res.status(status.BAD_REQUEST).json({
                message: "Invalid email format"
            });
        }
        const user = await User.findOne({ email });
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!user) {
            return res.status(status.UNAUTHORIZED).json({
                message: "Invalid email"
            });
        } else if (user.status === "block") {
            return res.status(status.UNAUTHORIZED).json({
                message: "User is blocked"
            });
        } else if (!isValidPassword) {
            return res.status(status.UNAUTHORIZED).json({
                message: "Invalid password"
            });
        } else {
            const userId = user._id
            const token = jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: "1h" });
            NotificationController.sendNotification({
                userId: user._id,
                message: "You have logged in successfully"
            });
            const option = {
                httpOnly: true,
                maxAge: 360000,
                secure: process.env.NODE_ENV,
                sameSite: "strict"
            };
            res.cookie("TOKEN", token, option);
            return res.status(status.OK).json({
                message: "User logged in successfully",
                token: token,
                role: user.role
            });
        }
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.ForgetPass = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        if (!validator.isEmail(email)) {
            return res.status(status.BAD_REQUEST).json({
                message: "Invalid email format"
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(status.UNAUTHORIZED).json({
                message: "Invalid email"
            });
        } else {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();
            return res.status(status.OK).json({
                message: "Password changed successfully"
            });
        }
    }
    catch (err) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.resetPass = async (req, res) => {
    try {
        const email = req.body.email;
        if (!validator.isEmail(email)) {
            return res.status(status.BAD_REQUEST).json({ message: "Invalid email format" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(status.UNAUTHORIZED).json({
                message: "Invalid email"
            });
        } else {
            const otp = randomstring.generate({
                length: 6,
                charset: 'numeric'
            });
            await User.findOneAndUpdate({ email }, { otp: otp }, { new: true, runvalidators: true });
            let transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                },
            });

            let mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: "🔒 Reset Your Password - Quick & Easy!",
                html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333; }
        .email-container { max-width: 600px; margin: 20px auto; background: #ffffff; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
        .header { background-color: #007BFF; color: white; text-align: center; padding: 20px; }
        .header h1 { margin: 0; font-size: 22px; }
        .content { padding: 20px; text-align: center; }
        .content p { font-size: 16px; margin: 10px 0; }
        .reset-link { display: inline-block; background: #007BFF; color: white; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-size: 16px; margin-top: 20px; }
        .footer { background-color: #f1f1f1; text-align: center; padding: 10px; font-size: 14px; color: #555; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Reset Your Password</h1>
        </div>
        <div class="content">
            <p>Hello,</p>
            <p>We received a request to reset your password. Don't worry, we've got you covered!</p>
            <p>Your OTP Code:</p>
            <div class="otp">${otp}</div>
            <p>If you didn't request a password reset, please ignore this email or contact us if you have any concerns.</p>
        </div>
        <div class="footer">
            <p>&copy; 2025 Furniro. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`,
            };
            await transporter.sendMail(mailOptions);
            return res.status(status.OK).json({
                message: "Email sent successfully",
                otp: otp
            });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.newpass = async (req, res) => {
    try {
        const { email, newpassword, confirmpassword, otp } = req.body;
        const users = await User.findOne({ email });
        if (!users) {
            return res.status(status.NOT_FOUND).json({
                message: "User not found"
            });
        } else {
            if (users.otp != otp) {
                return res.status(status.UNAUTHORIZED).json({
                    message: "Invalid OTP"
                });
            } else {
                if (await bcrypt.compare(newpassword, users.password)) {
                    console.log(newpassword, users.password);
                    return res.status(status.BAD_REQUEST).json({
                        message: "Password already exists"
                    });
                }
                if (newpassword !== confirmpassword) {
                    return res.status(status.UNAUTHORIZED).json({
                        message: "Passwords do not match"
                    });
                } else {
                    const hashedPassword = await bcrypt.hash(newpassword, 10);
                    users.password = hashedPassword;
                    await users.save();
                    return res.status(status.OK).json({
                        message: "Password changed successfully"
                    });
                }
            }
        }
    }
    catch (err) {
        console.log(err);
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            message: err.message
        });
    }
};

exports.logout = async (req, res) => {
    try {
        res.clearCookie("TOKEN", {
            httpOnly: true,
            secure: true,
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