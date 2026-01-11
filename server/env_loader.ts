import path from 'path';
import fs from 'fs';

// Helper to resolve .env from root
const envPath = path.resolve(process.cwd(), '.env');

console.log(`[EnvLoader] Attempting to load .env from: ${envPath}`);

if (fs.existsSync(envPath)) {
    try {
        // @ts-ignore
        process.loadEnvFile(envPath);
        console.log("[EnvLoader] Successfully loaded environment variables.");
    } catch (e) {
        console.error("[EnvLoader] Failed to load .env file:", e);
    }
} else {
    console.error("[EnvLoader] .env file NOT FOUND at expected path!");
}
