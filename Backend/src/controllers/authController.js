const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
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

        // Create User - role defaults to 'student' in Model
        const user = await User.create({
            username,
            email,
            password,
            // Ensure initials are set for Member 04 Leaderboard
            avatarInitials: username.slice(0, 2).toUpperCase(),
        });

        if (user) {
            const token = generateToken(user._id, user.username, user.email);
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: token,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        // Detailed log for your MacBook terminal to debug "Server Error"
        console.error("Signup Controller Error:", error.message);
        res.status(500).json({ message: 'Server Error: ' + error.message });
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

module.exports = {
    registerUser,
    loginUser,
    getMe,
    getAllUsers,
};