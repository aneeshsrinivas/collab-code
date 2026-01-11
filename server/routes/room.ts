import { Router } from 'express';
import { Room } from '../models/Room';
import { User } from '../models/User';

const router = Router();

// Create Room
router.post('/create', async (req, res) => {
    try {
        const { name, ownerId } = req.body;

        // Generate alphanumeric Room ID (6 chars)
        const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();

        const newRoom = new Room({
            roomId,
            name,
            ownerId,
            files: [{ name: 'main.js', content: '// Welcome to CodeWeave\n', language: 'javascript' }]
        });

        await newRoom.save();

        res.status(201).json({ roomId, name, message: "Room created successfully" });
    } catch (error: any) {
        console.error("Create Room Error:", error);
        res.status(500).json({ message: "Server error creating room" });
    }
});

// Join Room
router.post('/join', async (req, res) => {
    try {
        const { roomId, userId } = req.body;

        const room = await Room.findOne({ roomId });
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        // Check user limit (Max 5)
        // Note: We'll track active users via Socket.IO, but we can verify here too if we persist logic
        // For now, let's just allow it and handle limit in socket.

        res.json({
            roomId: room.roomId,
            name: room.name,
            files: room.files
        });
    } catch (error: any) {
        console.error("Join Room Error:", error);
        res.status(500).json({ message: "Server error joining room" });
    }
});

// Get User Rooms (Optional history)
router.get('/user/:userId', async (req, res) => {
    try {
        const rooms = await Room.find({ ownerId: req.params.userId }).sort({ createdAt: -1 });
        res.json(rooms);
    } catch (error: any) {
        res.status(500).json({ message: "Error fetching rooms" });
    }
});

export default router;
