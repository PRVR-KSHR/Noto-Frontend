import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';

// Configure PDF.js worker - Match the exact version installed (5.4.296)
// Using unpkg CDN which automatically serves the correct version
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.4.296/build/pdf.worker.min.mjs`;

class ClientTextExtractionService {
  constructor() {
    this.extractionCache = new Map();
  }

  /**
   * Extract text from a PDF file using PDF.js
   */
  async extractPDFText(fileUrl) {
    try {
      console.log('📖 Extracting text from PDF:', fileUrl);
      
      // Try to load the PDF with CORS handling
      const loadingTask = pdfjsLib.getDocument({
        url: fileUrl,
        useSystemFonts: true,
        disableAutoFetch: true,
        disableStream: true
      });
      
      console.log('📖 Loading PDF document...');
      const pdf = await loadingTask.promise;
      console.log(`📖 PDF loaded successfully. Pages: ${pdf.numPages}`);
      
      let fullText = '';

      // Extract text from each page
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        console.log(`📖 Extracting text from page ${pageNum}...`);
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        console.log(`📖 Page ${pageNum} text items:`, textContent.items.length);
        
        const pageText = textContent.items
          .map(item => item.str)
          .join(' ')
          .trim();
          
        if (pageText) {
          fullText += `\n\n--- Page ${pageNum} ---\n${pageText}`;
          console.log(`📖 Page ${pageNum} extracted ${pageText.length} characters`);
        } else {
          console.log(`📖 Page ${pageNum} contains no text`);
        }
      }

      if (!fullText.trim()) {
        throw new Error('No text content found in PDF - may be image-only or protected');
      }

      console.log(`✅ PDF extraction complete. Total length: ${fullText.trim().length}`);
      return fullText.trim();
    } catch (error) {
      console.error('❌ PDF text extraction failed:', error);
      
      // Provide more specific error messages
      if (error.message?.includes('CORS')) {
        throw new Error(`PDF access blocked by CORS policy: ${error.message}`);
      } else if (error.message?.includes('InvalidPDFException')) {
        throw new Error(`Invalid or corrupted PDF file: ${error.message}`);
      } else if (error.message?.includes('MissingPDFException')) {
        throw new Error(`PDF file not found or inaccessible: ${error.message}`);
      }
      
      throw new Error(`PDF text extraction failed: ${error.message}`);
    }
  }

  /**
   * Extract text from a plain text file
   */
  async extractTextFile(fileUrl) {
    try {
      console.log('📖 Extracting text from TXT file:', fileUrl);
      
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const text = await response.text();
      return text.trim();
    } catch (error) {
      console.error('❌ TXT text extraction failed:', error);
      throw new Error(`Text file extraction failed: ${error.message}`);
    }
  }

  /**
   * Extract text from a PPTX file using JSZip by reading slide XML
   */
  async extractPPTXText(fileUrl) {
    try {
      console.log('📖 Extracting text from PPTX:', fileUrl);
      const res = await fetch(fileUrl);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const buffer = await res.arrayBuffer();
      const zip = await JSZip.loadAsync(buffer);

      // Collect slide files like ppt/slides/slide1.xml, slide2.xml ...
      const slideEntries = Object.keys(zip.files)
        .filter((k) => /^ppt\/slides\/slide\d+\.xml$/.test(k))
        .sort((a, b) => {
          const na = parseInt(a.match(/slide(\d+)\.xml/)[1], 10);
          const nb = parseInt(b.match(/slide(\d+)\.xml/)[1], 10);
          return na - nb;
        });

      if (slideEntries.length === 0) {
        throw new Error('No slides found in PPTX');
      }

      let fullText = '';
      for (let i = 0; i < slideEntries.length; i++) {
        const slidePath = slideEntries[i];
        const slideXmlText = await zip.files[slidePath].async('text');
        const doc = new DOMParser().parseFromString(slideXmlText, 'application/xml');

        // Text runs are in <a:t> nodes (DrawingML)
        const textNodes = Array.from(doc.getElementsByTagName('a:t'));
        const texts = textNodes.map((n) => n.textContent.trim()).filter(Boolean);
        const slideText = texts.join(' ').replace(/\s+/g, ' ').trim();
        if (slideText) {
          fullText += `\n\n--- Slide ${i + 1} ---\n${slideText}`;
        }
      }

      if (!fullText.trim()) {
        throw new Error('No text content extracted from slides');
      }

      return fullText.trim();
    } catch (error) {
      console.error('❌ PPTX text extraction failed:', error);
      throw new Error(`PPTX text extraction failed: ${error.message}`);
    }
  }

  /**
   * Main text extraction method
   */
  async extractText(fileUrl, fileName, fileType) {
    const cacheKey = `${fileUrl}-${fileName}`;
    
    // Check cache first
    if (this.extractionCache.has(cacheKey)) {
      console.log('✅ Using cached text extraction');
      return this.extractionCache.get(cacheKey);
    }

    let extractedText = '';

    try {
      // Determine extraction method based on file type
      if (fileType === 'application/pdf') {
        extractedText = await this.extractPDFText(fileUrl);
      } else if (fileType === 'text/plain') {
        extractedText = await this.extractTextFile(fileUrl);
      } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // DOCX via JSZip: read word/document.xml and collect w:t nodes
        console.log('📖 Extracting text from DOCX:', fileUrl);
        const res = await fetch(fileUrl);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        const buffer = await res.arrayBuffer();
        const zip = await JSZip.loadAsync(buffer);
        const docXmlEntry = zip.files['word/document.xml'];
        if (!docXmlEntry) {
          throw new Error('DOCX main document.xml not found');
        }
        const docXml = await docXmlEntry.async('text');
        const doc = new DOMParser().parseFromString(docXml, 'application/xml');
        // Collect text from w:t nodes
        const textNodes = Array.from(doc.getElementsByTagName('w:t'));
        const texts = textNodes.map((n) => n.textContent).filter(Boolean);
        const rawText = texts.join(' ').replace(/\s+/g, ' ').trim();
        if (!rawText) {
          throw new Error('No text content found in DOCX');
        }
        extractedText = rawText;
      } else if (fileType.includes('presentation') && fileType.includes('openxml')) {
        // PPTX (Office Open XML)
        extractedText = await this.extractPPTXText(fileUrl);
      } else if (fileType === 'application/vnd.ms-powerpoint') {
        // Legacy .ppt (binary) not supported client-side
        extractedText = `This is a legacy PowerPoint (.ppt): ${fileName}

Content may include text, images, charts, and bullet points. Convert it to PDF or PPTX for full text analysis.
The AI can still help with study strategies and topic guidance.`;
      } else if (fileType.includes('word') || fileType.includes('document')) {
        // For Word documents, provide a helpful message for the AI
        extractedText = `This is a Microsoft Word document: ${fileName}

Content Summary:
- Document Type: Word Document (.doc/.docx)
- This document likely contains structured text content including headings, paragraphs, and possibly tables or images.
- The AI can help answer questions about typical Word document content and provide study guidance.

Note: For complete text analysis, the document would need to be converted to PDF or plain text format. However, the AI can still provide helpful study assistance based on the document context and your questions.`;
      } else {
        // For other unsupported formats, provide a generic helpful message
        extractedText = `This is a ${fileType} document: ${fileName}

The AI can still help you with:
- General study strategies for this type of content
- Creating study plans and notes
- Exam preparation techniques
- Subject-specific guidance

Please describe what kind of content is in this document or ask specific questions, and the AI will provide helpful study assistance.`;
      }

      // Validate extracted text
      if (!extractedText || extractedText.length < 10) {
        throw new Error('No meaningful text content found in document');
      }

      // Cache the result
      this.extractionCache.set(cacheKey, extractedText);
      
      console.log('✅ Text extraction successful, length:', extractedText.length);
      return extractedText;

    } catch (error) {
      console.error('❌ Text extraction failed:', error);
      
      // For extraction failures, provide a helpful message for the AI
      const fallbackMessage = `EXTRACTION_FAILED: Document: ${fileName} (${fileType})

Error: ${error.message}

The AI can help you with this document by:
- Providing study strategies and techniques
- Creating study plans and notes
- Answering subject-specific questions
- Offering exam preparation guidance

Please describe the content of your document or ask specific questions, and the AI will provide helpful study assistance tailored to your needs.`;

      // Cache the fallback message to avoid repeated attempts
      this.extractionCache.set(cacheKey, fallbackMessage);
      return fallbackMessage;
    }
  }

  /**
   * Clear the extraction cache
   */
  clearCache() {
    this.extractionCache.clear();
  }

  /**
   * Check if a file type is supported for client-side extraction
   */
  isClientExtractionSupported(fileType) {
    const supportedTypes = [
      'application/pdf',
      'text/plain',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
      'application/vnd.openxmlformats-officedocument.presentationml.presentation' // pptx
    ];
    return supportedTypes.includes(fileType);
  }
}

// Export a singleton instance
export const textExtractionService = new ClientTextExtractionService();