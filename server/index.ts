import "./env_loader";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { connectDB } from "./db";
import { setupWebSocket } from "./websocket";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

(async () => {
    await connectDB();
    const server = await registerRoutes(app);
    setupWebSocket(server);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
        const status = err.status || err.statusCode || 500;
        const message = err.message || "Internal Server Error";

        res.status(status).json({ message });
        throw err;
    });

    const PORT = 3000;
    server.listen(PORT, "0.0.0.0", () => {
        console.log(`serving on port ${PORT}`);
    });
})();
