import mongoose from 'mongoose';

export async function connectDB() {
    try {
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
            console.warn("MONGO_URI is not defined in environment variables. Database features will not work.");
            return;
        }

        await mongoose.connect(mongoURI);
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        // Don't exit process, allow partial functionality if needed
    }
}
