/**
 * PDF Parser
 * Extracts text from PDF files using pdf.js
 */

import * as pdfjsLib from 'pdfjs-dist'

// Configure pdf.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

export interface PDFParseResult {
  text: string
  pages: number
  metadata?: {
    title?: string
    author?: string
    subject?: string
    creator?: string
  }
}

/**
 * Parse PDF file and extract text
 */
export async function parsePDF(file: File): Promise<PDFParseResult> {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

  const textParts: string[] = []
  let metadata: PDFParseResult['metadata'] = undefined

  // Extract metadata
  try {
    const info = await pdf.getMetadata()
    if (info.info) {
      metadata = {
        title: (info.info as Record<string, unknown>).Title as string | undefined,
        author: (info.info as Record<string, unknown>).Author as string | undefined,
        subject: (info.info as Record<string, unknown>).Subject as string | undefined,
        creator: (info.info as Record<string, unknown>).Creator as string | undefined,
      }
    }
  } catch {
    // Metadata extraction failed, continue without it
  }

  // Extract text from each page
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const textContent = await page.getTextContent()

    // Group text items by their vertical position to maintain line structure
    const textItems = textContent.items as Array<{
      str: string
      transform: number[]
    }>

    // Sort by Y position (descending) then X position (ascending)
    const sortedItems = [...textItems].sort((a, b) => {
      const yDiff = b.transform[5] - a.transform[5]
      if (Math.abs(yDiff) > 5) return yDiff
      return a.transform[4] - b.transform[4]
    })

    // Group items into lines based on Y position
    const lines: string[][] = []
    let currentLine: string[] = []
    let currentY: number | null = null

    for (const item of sortedItems) {
      const y = Math.round(item.transform[5])

      if (currentY === null || Math.abs(y - currentY) > 5) {
        if (currentLine.length > 0) {
          lines.push(currentLine)
        }
        currentLine = [item.str]
        currentY = y
      } else {
        currentLine.push(item.str)
      }
    }

    if (currentLine.length > 0) {
      lines.push(currentLine)
    }

    // Join lines into text
    const pageText = lines.map((line) => line.join(' ')).join('\n')
    textParts.push(pageText)
  }

  return {
    text: textParts.join('\n\n--- Page Break ---\n\n'),
    pages: pdf.numPages,
    metadata,
  }
}

/**
 * Check if a file is a valid PDF
 */
export function isPDF(file: File): boolean {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
}
