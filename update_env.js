
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '.env');

const NEW_CLIENT_ID = "522048673047-7dd1a6s8e53a1bfgfcam4q41psul0om7.apps.googleusercontent.com";

try {
    if (!fs.existsSync(envPath)) {
        console.log(" .env file not found.");
        process.exit(1);
    }

    let content = fs.readFileSync(envPath, 'utf8');

    // Regex to find VITE_GOOGLE_CLIENT_ID and replace it
    const clientIDRegex = /(VITE_GOOGLE_CLIENT_ID\s*=\s*)(.+)/;

    if (clientIDRegex.test(content)) {
        content = content.replace(clientIDRegex, `$1${NEW_CLIENT_ID}`);
        fs.writeFileSync(envPath, content);
        console.log(" Updated VITE_GOOGLE_CLIENT_ID.");
    } else {
        // If it doesn't exist, append it
        content += `\nVITE_GOOGLE_CLIENT_ID=${NEW_CLIENT_ID}`;
        fs.writeFileSync(envPath, content);
        console.log(" Appended VITE_GOOGLE_CLIENT_ID.");
    }

} catch (e) {
    console.error("Error updating .env:", e);
}
