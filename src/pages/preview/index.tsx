import { useState, useRef, useCallback } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, Printer, Check, Copy, Edit3, ZoomIn, ZoomOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getBuilderLayout } from 'src/components/layout'
import { useResume } from 'src/lib/resume-context'
import { ResumeDocument } from 'src/components/resume-preview/resume-document'

// Zoom levels
const ZOOM_LEVELS = [0.5, 0.75, 1, 1.25, 1.5] as const

function PreviewPage() {
  const navigate = useNavigate()
  const { isPersonalComplete, isExperienceComplete, isEducationComplete, isSkillsComplete } = useResume()
  const [zoomIndex, setZoomIndex] = useState(1) // Default to 0.75
  const [copied, setCopied] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  const currentZoom = ZOOM_LEVELS[zoomIndex]
  const canZoomIn = zoomIndex < ZOOM_LEVELS.length - 1
  const canZoomOut = zoomIndex > 0

  // Check if resume has minimum content
  const hasMinimumContent = isPersonalComplete || isExperienceComplete || isEducationComplete || isSkillsComplete
  const isComplete = isPersonalComplete && isExperienceComplete && isEducationComplete && isSkillsComplete

  // Zoom controls
  const zoomIn = () => {
    if (canZoomIn) setZoomIndex((i) => i + 1)
  }

  const zoomOut = () => {
    if (canZoomOut) setZoomIndex((i) => i - 1)
  }

  // Print handler
  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  // Download PDF (using print to PDF for now - real implementation would use a library)
  const handleDownload = useCallback(() => {
    // For a real implementation, you'd use a library like html2pdf, jsPDF, or react-pdf
    // For now, we trigger print which allows "Save as PDF"
    window.print()
  }, [])

  // Copy shareable link (mock - would generate real link in production)
  const handleCopyLink = useCallback(() => {
    // In production, this would copy an actual shareable URL
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  return (
    <>
      <Helmet>
        <title>Preview Your Resume — Craftfolio</title>
        <meta name="description" content="Preview and download your professional resume." />
      </Helmet>

      {/* Print-only styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-muted/30">
        {/* Sticky top toolbar */}
        <div className="no-print sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
          <div className="container">
            <nav className="flex h-14 items-center justify-between gap-4">
              {/* Left: Back button */}
              <Link
                to="/resume"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to editor</span>
              </Link>

              {/* Center: Zoom controls */}
              <div className="flex items-center gap-1 rounded-md border border-border bg-background p-1">
                <button
                  type="button"
                  onClick={zoomOut}
                  disabled={!canZoomOut}
                  className="inline-flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="w-12 text-center text-xs font-medium text-foreground">
                  {Math.round(currentZoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={zoomIn}
                  disabled={!canZoomIn}
                  className="inline-flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground transition-all hover:bg-muted"
                  aria-label={copied ? 'Link copied' : 'Copy link'}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-accent" />
                      <span className="hidden sm:inline">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span className="hidden sm:inline">Copy link</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground transition-all hover:bg-muted"
                >
                  <Printer className="h-4 w-4" />
                  <span className="hidden sm:inline">Print</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!hasMinimumContent}
                  className="shadow-warm-sm inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Download PDF</span>
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* Main preview area */}
        <main className="container py-8">
          {/* Completion status banner */}
          <AnimatePresence>
            {!isComplete && hasMinimumContent && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="no-print mb-6 flex items-center justify-between gap-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3"
              >
                <p className="text-sm text-amber-800">
                  <strong>Almost there!</strong> Complete all sections for a polished resume.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/resume')}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-700 hover:text-amber-900"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Continue editing
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Resume document wrapper */}
          <motion.div
            className="mx-auto"
            style={{ maxWidth: `calc(210mm * ${currentZoom} + 4rem)` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Paper shadow container */}
            <motion.div
              ref={previewRef}
              className="print-area shadow-warm-lg mx-auto overflow-hidden rounded-lg border border-border bg-white"
              style={{ width: `calc(210mm * ${currentZoom})` }}
              layout
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <ResumeDocument scale={currentZoom} />
            </motion.div>

            {/* Page indicator */}
            <p className="no-print mt-4 text-center text-sm text-muted-foreground">Page 1 of 1</p>
          </motion.div>

          {/* Empty state prompt */}
          {!hasMinimumContent && (
            <motion.div
              className="no-print mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="mb-4 text-muted-foreground">Your resume is empty. Start by adding your information.</p>
              <Link
                to="/resume"
                className="shadow-warm-sm inline-flex h-10 items-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90"
              >
                <Edit3 className="h-4 w-4" />
                Start building
              </Link>
            </motion.div>
          )}
        </main>
      </div>
    </>
  )
}

PreviewPage.getLayout = getBuilderLayout

export default PreviewPage
