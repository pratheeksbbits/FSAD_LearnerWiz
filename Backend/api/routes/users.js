const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const mongoose = require('mongoose');

// User registration endpoint
router.post('/register', async (req, res) => {
    console.log('req', req);
    try {
        // Ensure request body is parsed correctly
        if (!req.body || !req.body.username || !req.body.email || !req.body.password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        
        // Extract user details from request body
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user document
        const newUser = new User({
            _id: new mongoose.Types.ObjectId(),
            username,
            email,
            password: hashedPassword
        });

        // Save the user document to the database
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// User Login
router.post("/login", (req, res, next) => {
    // Check if the user exists by email
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: "Authentication failed"
                });
            }
            // Compare the entered password with the stored hash
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err || !result) {
                    return res.status(401).json({
                        message: "Authentication failed"
                    });
                }
                // Create a JWT token
                const token = jwt.sign(
                    {
                        email: user.email,
                        userId: user._id
                    },
                    process.env.JWT_KEY, // You should replace this with your own secret key
                    {
                        expiresIn: "1h"
                    }
                );
                res.status(200).json({
                    message: "Authentication successful",
                    token: token
                });
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;