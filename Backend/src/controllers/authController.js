const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Generate JWT Token
const generateToken = (id, username, email) => {
    return jwt.sign({ id, username, email }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Recommended to add an expiry for security
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

        const user = await User.create({
            username,
            email,
            password,
            avatarInitials: username.slice(0, 2).toUpperCase(),
        });

        if (user) {
            res.status(201).json({
                _id: user._id, // Fixed: Using actual MongoDB _id
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.username, user.email),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id, // Fixed: Achievement page specifically needs _id
                username: user.username,
                email: user.email,
                role: user.role, // Member 05 needs this for Admin Dashboard
                token: generateToken(user._id, user.username, user.email),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get logged in user data
// @route   GET /api/auth/me
const getMe = async (req, res) => {
    res.status(200).json(req.user);
};

// @desc    Get all users (Admin/Debug only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
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