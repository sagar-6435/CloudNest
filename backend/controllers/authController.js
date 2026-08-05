const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { createUserFolder } = require('../services/googleDriveService');
const Otp = require('../models/Otp');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// Generate JWT Stack
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, mobileNumber } = req.body;

        if (!name || !email || !password || !mobileNumber) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password happens automatically in User Model (pre-save middleware)

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            mobileNumber,
        });

        if (user) {
            // Generate a dedicated Google Drive folder for the user
            let driveFolderId = '';
            try {
                driveFolderId = await createUserFolder(user.name);
                user.driveFolderId = driveFolderId;
                await user.save();
            } catch (err) {
                console.error("Warning: Failed to create G-Drive folder", err);
            }

            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                mobileNumber: user.mobileNumber,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please add block credentials' });
        }

        // Check for user email
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile/data
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile/data
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.mobileNumber = req.body.mobileNumber || user.mobileNumber;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                mobileNumber: updatedUser.mobileNumber,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Request OTP for email verification
// @route   POST /api/auth/request-otp
// @access  Public
const requestOtp = async (req, res) => {
    try {
        const { email, context } = req.body;
        if (!email || !context) return res.status(400).json({ message: 'Email and context required' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP

        // Clear existing OTP for this email and context
        await Otp.deleteMany({ email, context });
        await Otp.create({ email, otp, context });

        // Send Email
        try {
            await sendEmail({
                email,
                subject: 'CloudNest Verification Code',
                message: `Your CloudNest OTP code is ${otp}. It will expire in 5 minutes.`
            });
            res.json({ message: 'OTP sent successfully' });
        } catch (mailError) {
            console.error(mailError);
            res.status(500).json({ message: 'Error sending email. Check SMTP credentials.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Forgot Password (Send OTP)
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        req.body.context = 'forgot_password';
        await requestOtp(req, res); // Reuse OTP generator
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reset Password via OTP
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) return res.status(400).json({ message: 'Missing fields' });

        const validOtp = await Otp.findOne({ email, otp, context: 'forgot_password' });
        if (!validOtp) return res.status(400).json({ message: 'Invalid or expired OTP' });

        const user = await User.findOne({ email });
        user.password = newPassword; // Pre-save hooks will hash this automatically
        await user.save();
        await Otp.deleteMany({ email, context: 'forgot_password' });

        res.json({ message: 'Password has been reset successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    requestOtp,
    forgotPassword,
    resetPassword
};
