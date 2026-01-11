import mongoose, { Schema, Document } from 'mongoose';

interface IFile {
    name: string;
    content: string;
    language: string;
}

export interface IRoom extends Document {
    roomId: string;
    name: string;
    ownerId?: string;
    files: IFile[];
    users: string[]; // List of socket IDs or usernames currently in room
    createdAt: Date;
}

const RoomSchema: Schema = new Schema({
    roomId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    ownerId: { type: String },
    files: [{
        name: { type: String, required: true },
        content: { type: String, default: '' },
        language: { type: String, default: 'javascript' }
    }],
    users: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
});

export const Room = mongoose.model<IRoom>('Room', RoomSchema);
