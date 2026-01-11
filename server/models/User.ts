import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email?: string;
    phone?: string;
    password?: string;
    googleId?: string;
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    password: { type: String }, // Optional if using Google Auth
    googleId: { type: String, unique: true, sparse: true },
    createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model<IUser>('User', UserSchema);
