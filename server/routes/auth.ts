import mongoose from 'mongoose';
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_123';

// Register
router.post('/register', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ message: "Database not connected. Please set MONGO_URI." });
        }

        const { identifier, password, username, type } = req.body; // type: 'email' or 'phone'

        // Basic validation
        if (!identifier || !password || !username) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user exists
        const query = type === 'phone' ? { phone: identifier } : { email: identifier };
        const existingUser = await User.findOne(query);
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = new User({
            username,
            password: hashedPassword,
            [type === 'phone' ? 'phone' : 'email']: identifier
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error: any) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "Server error during registration" });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { identifier, password } = req.body;

        // Find user by email or phone
        const user = await User.findOne({
            $or: [{ email: identifier }, { phone: identifier }]
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check password
        if (!user.password) {
            return res.status(400).json({ message: "Please login with Google" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate token
        const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });

        res.json({ token, username: user.username, userId: user._id });
    } catch (error: any) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error during login" });
    }
});

// Google Login (Mock/Placeholder Logic for now)
// Google Login
router.post('/google', async (req, res) => {
    console.log("DEBUG: POST /api/auth/google called");
    try {
        if (mongoose.connection.readyState !== 1) {
            console.error("DEBUG: Database not connected");
            return res.status(503).json({ message: "Database not connected. Please check server logs." });
        }

        const { token, googleId, email, name } = req.body;
        console.log("DEBUG: Google Login Payload:", { googleId, email, name, tokenLen: token ? token.length : 0 });

        if (!googleId || !email) {
            return res.status(400).json({ message: "Missing googleId or email in payload" });
        }

        let user = await User.findOne({ googleId });

        if (!user) {
            console.log("DEBUG: User not found by googleId. Checking email...");
            // Create new user if not exists
            user = await User.findOne({ email });
            if (user) {
                console.log("DEBUG: Found user by email. Linking Google ID.");
                // User exists with email, link google account
                user.googleId = googleId;
                await user.save();
            } else {
                console.log("DEBUG: Creating new Google user");
                user = new User({
                    username: name || email.split('@')[0],
                    email,
                    googleId
                });
                await user.save();
            }
        }

        console.log("DEBUG: User authenticated. Generating Token...");
        const jwtToken = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token: jwtToken, username: user.username, userId: user._id });

    } catch (error: any) {
        console.error("Google Auth Error:", error);
        res.status(500).json({ message: "Server error during Google auth: " + error.message });
    }
});

export default router;
