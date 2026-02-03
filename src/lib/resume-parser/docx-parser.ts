/**
 * DOCX Parser
 * Extracts text from DOCX files using mammoth.js
 */

import mammoth from 'mammoth'

export interface DOCXParseResult {
  text: string
  html: string
  messages: string[]
}

/**
 * Parse DOCX file and extract text
 */
export async function parseDOCX(file: File): Promise<DOCXParseResult> {
  const arrayBuffer = await file.arrayBuffer()

  // Extract as HTML first (preserves structure better)
  const htmlResult = await mammoth.convertToHtml({ arrayBuffer })

  // Also extract as plain text
  const textResult = await mammoth.extractRawText({ arrayBuffer })

  // Clean up the text
  const cleanText = cleanExtractedText(textResult.value)

  return {
    text: cleanText,
    html: htmlResult.value,
    messages: [...htmlResult.messages, ...textResult.messages].map((m) => m.message),
  }
}

/**
 * Clean up extracted text
 */
function cleanExtractedText(text: string): string {
  return (
    text
      // Normalize line endings
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      // Remove excessive whitespace but preserve paragraph structure
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      // Trim each line
      .split('\n')
      .map((line) => line.trim())
      .join('\n')
      // Final trim
      .trim()
  )
}

/**
 * Parse HTML content to extract structured sections
 * (DOCX converted to HTML often has better structure)
 */
export function parseHTMLStructure(html: string): {
  headings: Array<{ level: number; text: string }>
  paragraphs: string[]
  lists: string[][]
} {
  // Create a temporary DOM element to parse HTML
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  // Extract headings
  const headings: Array<{ level: number; text: string }> = []
  doc.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((el) => {
    const level = parseInt(el.tagName.substring(1))
    const text = el.textContent?.trim() || ''
    if (text) {
      headings.push({ level, text })
    }
  })

  // Extract paragraphs
  const paragraphs: string[] = []
  doc.querySelectorAll('p').forEach((el) => {
    const text = el.textContent?.trim() || ''
    if (text) {
      paragraphs.push(text)
    }
  })

  // Extract lists
  const lists: string[][] = []
  doc.querySelectorAll('ul, ol').forEach((listEl) => {
    const items: string[] = []
    listEl.querySelectorAll('li').forEach((li) => {
      const text = li.textContent?.trim() || ''
      if (text) {
        items.push(text)
      }
    })
    if (items.length > 0) {
      lists.push(items)
    }
  })

  return { headings, paragraphs, lists }
}

/**
 * Check if a file is a valid DOCX
 */
export function isDOCX(file: File): boolean {
  return (
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.name.toLowerCase().endsWith('.docx')
  )
}

/**
 * Check if a file is a legacy DOC format (not supported)
 */
export function isLegacyDOC(file: File): boolean {
  return file.type === 'application/msword' || file.name.toLowerCase().endsWith('.doc')
}
