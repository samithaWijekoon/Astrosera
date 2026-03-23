const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { generateOtp, sendOtpEmail } = require('../utils/emailUtils');
require('dotenv').config();

// Generate JWT Token
const generateToken = (id, username, email) => {
    // Safety check for Member 05: Ensure JWT_SECRET exists in .env
    if (!process.env.JWT_SECRET) {
        console.error("FATAL ERROR: JWT_SECRET is not defined in .env file");
        return null;
    }
    return jwt.sign({ id, username, email }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/signup
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const otpCode = generateOtp();

        // Create User - role defaults to 'student' in Model
        const user = await User.create({
            username,
            email,
            password,
            // Ensure initials are set for Member 04 Leaderboard
            avatarInitials: username.slice(0, 2).toUpperCase(),
            otpCode,
            isVerified: false,
        });

        if (user) {
            // Attempt to send the OTP email in the background
            sendOtpEmail(email, otpCode);

            // Respond successfully advising them to check email (No JWT dispatched)
            res.status(201).json({ message: 'User registered. Please verify OTP.' });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        // Detailed log for your MacBook terminal to debug "Server Error"
        console.error("Signup Controller Error:", error.message);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Verify OTP for a user
// @route   POST /api/auth/verify-otp
const verifyOtp = async (req, res) => {
    try {
        const { email, otp_code } = req.body;

        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.isVerified) {
            return res.status(200).json({ message: 'User is already verified' });
        }
        if (user.otpCode !== otp_code) {
            return res.status(400).json({ message: 'Invalid OTP code.' });
        }

        user.isVerified = true;
        user.otpCode = null;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully.' });
    } catch (error) {
        console.error("OTP Verification Error:", error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Resend OTP for an unverified user
// @route   POST /api/auth/resend-otp
const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.isVerified) {
            return res.status(400).json({ message: 'User is already verified' });
        }

        const newOtp = generateOtp();
        user.otpCode = newOtp;
        await user.save(); // Note: password is not modified, so pre-save hook won't re-hash it

        sendOtpEmail(email, newOtp);

        res.status(200).json({ message: 'A new verification code has been sent to your email.' });
    } catch (error) {
        console.error("Resend OTP Error:", error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        // Using the matchPassword method defined in User.js model
        if (user && (await user.matchPassword(password))) {
            
            // Critical check: ensure the user has verified their OTP before returning JWT
            if (!user.isVerified) {
                return res.status(403).json({ message: 'Email not verified.' });
            }

            const token = generateToken(user._id, user.username, user.email);
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: token,
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error("Login Controller Error:", error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get logged in user data
const getMe = async (req, res) => {
    res.status(200).json(req.user);
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.username = req.body.username || user.username;
            user.email = req.body.email || user.email;
            if (req.body.avatarInitials) {
                user.avatarInitials = req.body.avatarInitials;
            }

            if (req.body.password) {
                const isValidPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(req.body.password);
                if (!isValidPassword) {
                    return res.status(400).json({ message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.' });
                }
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                role: updatedUser.role,
                avatarInitials: updatedUser.avatarInitials,
                totalScore: updatedUser.totalScore,
                streakCount: updatedUser.streakCount,
                token: generateToken(updatedUser._id, updatedUser.username, updatedUser.email),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Profile Update Error:", error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all users (Used for Admin Analytics)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error("Fetch Users Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};
// @desc    Authenticate or register user with Google
// @route   POST /api/auth/google
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ message: 'No Google token provided' });
        }

        // Verify the token
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        // Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            // Create a new user since they don't exist
            // Generate a random secure password for OAuth users that strictly satisfies the specific allowed special characters (@$!%*?&#)
            const randomPassword = require('crypto').randomBytes(8).toString('hex') + 'Auth1@!';
            
            user = await User.create({
                username: name.replace(/\s+/g, '') + Math.floor(Math.random() * 1000), // Create a unique username
                email,
                password: randomPassword,
                avatarInitials: name.slice(0, 2).toUpperCase(),
                isVerified: true, // Google users are implicitly verified
            });
        } else if (!user.isVerified) {
            // If they signed up through standard mail but didn't verify, mark as verified now
            user.isVerified = true;
            await user.save();
        }

        // Generate JWT token for Astrosera
        const jwtToken = generateToken(user._id, user.username, user.email);

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            avatarInitials: user.avatarInitials,
            token: jwtToken,
        });
        
    } catch (error) {
        console.error("Google Auth Controller Error:", error);
        res.status(401).json({ message: 'Invalid Google token or Server Error' });
    }
};

module.exports = {
    registerUser,
    verifyOtp,
    resendOtp,
    loginUser,
    googleAuth,
    getMe,
    updateProfile,
    getAllUsers,
};