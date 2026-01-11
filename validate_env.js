
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
    const envPath = path.resolve(__dirname, '.env');
    if (!fs.existsSync(envPath)) {
        console.log(" .env file NOT FOUND in root directory!");
        process.exit(1);
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    let googleKey = "";
    let mongoURI = "";

    lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('VITE_GOOGLE_CLIENT_ID=')) {
            googleKey = trimmed.split('=')[1].trim();
        }
        if (trimmed.startsWith('MONGO_URI=')) {
            mongoURI = trimmed.substring(10).trim(); // Get everything after MONGO_URI=
        }
    });

    console.log("--- CONFIGURATION CHECK ---");

    // 1. Check Google Client ID
    if (!googleKey) {
        console.log("VITE_GOOGLE_CLIENT_ID is MISSING.");
    } else if (googleKey.startsWith("GOCSPX")) {
        console.log(" Google Key Error: You pasted the CLIENT SECRET (starts with GOCSPX).");
        console.log("Use the CLIENT ID instead (ends with .apps.googleusercontent.com).");
    } else if (!googleKey.endsWith(".apps.googleusercontent.com") && googleKey !== "your_google_client_id_here") {
        console.log(" Google Key Warning: Key doesn't look like a standard Client ID.");
        console.log(" It should end with '.apps.googleusercontent.com'");
    } else if (googleKey === "your_google_client_id_here") {
        console.log(" Google Key Error: You haven't replaced the placeholder text.");
    } else {
        console.log(" Google Client ID format looks likely correct.");
    }

    // 2. Check MongoDB URI
    if (!mongoURI) {
        console.log(" MONGO_URI is MISSING.");
    } else {
        if (mongoURI.includes("<password>") || mongoURI.includes("<username>") || mongoURI.includes("<your-password>")) {
            console.log(" MongoDB Error: You still have placeholders like '<password>' in the URI.");
            console.log("    Replace '<password>' with your actual database user password.");
        } else if (mongoURI.includes("...")) {
            console.log(" MongoDB Error: URI contains '...' dots.");
        } else if (!mongoURI.startsWith("mongodb")) {
            console.log(" MongoDB Error: URI should start with 'mongodb+srv://' or 'mongodb://'.");
        } else {
            console.log(" MongoDB URI format looks valid (check your password execution if connection fails).");
        }
    }
    console.log("---------------------------");

} catch (err) {
    console.error("Error reading .env:", err);
}
