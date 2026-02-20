// services/pdfService.js
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

/**
 * Extract text from PDF buffer using Mozilla's PDF.js
 */
export async function extractText(fileBuffer) {
  if (!fileBuffer) throw new Error("No file buffer provided.");

  try {
    // Convert Buffer to Uint8Array for PDF.js
    const data = new Uint8Array(fileBuffer);
    const loadingTask = pdfjsLib.getDocument({ data });
    const pdf = await loadingTask.promise;
    
    let fullText = "";

    // Loop through each page and grab text
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(" ");
      fullText += pageText + "\n";
    }

    const cleanedText = fullText
      .replace(/\s{2,}/g, " ")
      .trim();

    return {
      text: cleanedText,
      length: cleanedText.length,
      pages: pdf.numPages,
    };
  } catch (err) {
    throw new Error("PDF extraction failed: " + err.message);
  }
}