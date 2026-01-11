import type { Express } from "express";
import { createServer, type Server } from "http";
import authRoutes from './routes/auth';
import roomRoutes from './routes/room';

export async function registerRoutes(app: Express): Promise<Server> {
    // put application routes here
    // prefix all routes with /api
    app.use('/api/auth', authRoutes);
    app.use('/api/room', roomRoutes);

    // use storage to perform CRUD operations

    // AI Chat Endpoint
    app.post("/api/ai/chat", async (req, res) => {
        try {
            const { message, apiKey } = req.body;
            const serverKey = process.env.OPENAI_API_KEY;
            const keyToUse = apiKey || serverKey;

            if (!keyToUse) {
                return res.status(401).json({ message: "OpenAI API Key is required. Please set it in Settings." });
            }

            console.log("Sending request to OpenAI...");
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${keyToUse}`,
                },
                body: JSON.stringify({
                    model: "gpt-4o",
                    messages: [{ role: "user", content: message }],
                }),
            });

            if (!response.ok) {
                const error = await response.text();
                console.error("OpenAI Error:", error);
                return res.status(response.status).json({ message: `OpenAI Error: ${error}` });
            }

            const data = await response.json();
            const reply = data.choices[0].message.content;
            res.json({ reply });
        } catch (error: any) {
            console.error("Server AI Error:", error);
            res.status(500).json({ message: error.message });
        }
    });

    const httpServer = createServer(app);

    return httpServer;
}
