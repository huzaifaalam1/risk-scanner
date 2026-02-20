// services/testServices.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractText } from './pdfService.js'; // Keep the .cjs extension here
import { detectRisks } from './ruleEngine.js';

// Helper to handle __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTest() {
    // Path to your dummy PDF in the project root
    const pdfPath = path.join(__dirname, 'sample.pdf'); 

    if (!fs.existsSync(pdfPath)) {
        console.error("❌ Error: 'test_contract.pdf' not found at: " + pdfPath);
        return;
    }

    console.log("🚀 Starting Contract Scan...");

    try {
        const fileBuffer = fs.readFileSync(pdfPath);
        const { text, length } = await extractText(fileBuffer);
        
        console.log(`✅ Text Extracted: ${length} characters.`);
        console.log("--------------------------------------------------");

        const identifiedRisks = detectRisks(text);

        if (identifiedRisks.length === 0) {
            console.log("🤔 No obvious risks found by Regex. (Check if your test PDF has the keywords!)");
        } else {
            console.log(`⚠️ Found ${identifiedRisks.length} potential risks:`);
            console.log(JSON.stringify(identifiedRisks, null, 2));
        }

    } catch (error) {
        console.error("❌ Test Failed:", error.message);
    }
}

runTest();