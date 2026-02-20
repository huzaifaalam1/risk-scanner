const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");

/**
 * Extract plain text from a PDF buffer using PDF.js
 * @param {Buffer} fileBuffer
 * @returns {Promise<string>}
 */
async function extractText(fileBuffer) {
  if (!fileBuffer) {
    throw new Error("No file buffer provided.");
  }

  try {
    // Convert Node Buffer to Uint8Array for PDF.js
    const data = new Uint8Array(fileBuffer);

    const loadingTask = pdfjsLib.getDocument({ data });
    const pdf = await loadingTask.promise;

    let fullText = "";

    // Loop through each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      const pageText = textContent.items
        .map(item => item.str)
        .join(" ");

      fullText += pageText + "\n";
    }

    // Clean excessive whitespace
    const cleanedText = fullText
      .replace(/\s{2,}/g, " ")
      .replace(/\n{2,}/g, "\n")
      .trim();

    return cleanedText;

  } catch (error) {
    throw new Error("PDF extraction failed: " + error.message);
  }
}

module.exports = { extractText };