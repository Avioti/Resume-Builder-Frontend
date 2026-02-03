/**
 * Resume Import Component
 * Drag-and-drop file upload for PDF/DOCX resume import
 */
import { useState, useCallback, useRef } from 'react'
import { Upload, FileText, AlertCircle, CheckCircle2, Loader2, X, FileWarning } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { parseResumeFile, convertToResumeData, ParsedResume } from 'src/lib/resume-parser'

interface ResumeImportProps {
  onImport: (data: ReturnType<typeof convertToResumeData>, parsed: ParsedResume) => void
  onCancel?: () => void
}

type ImportState = 'idle' | 'dragging' | 'parsing' | 'preview' | 'error'

export function ResumeImport({ onImport, onCancel }: ResumeImportProps) {
  const [state, setState] = useState<ImportState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null)
  // Track drag enter/leave events to handle nested elements
  const [, setDragCounter] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(async (file: File) => {
    setState('parsing')
    setError(null)

    const result = await parseResumeFile(file)

    if (result.success && result.data) {
      setParsedResume(result.data)
      setState('preview')
    } else {
      setError(result.error || 'Failed to parse resume')
      setState('error')
    }
  }, [])

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter((prev) => prev + 1)
    setState('dragging')
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter((prev) => {
      const newCount = prev - 1
      if (newCount === 0) {
        setState('idle')
      }
      return newCount
    })
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragCounter(0)

      const files = Array.from(e.dataTransfer.files)
      const file = files[0]

      if (file) {
        handleFile(file)
      } else {
        setState('idle')
      }
    },
    [handleFile],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleFile(file)
      }
    },
    [handleFile],
  )

  const handleConfirmImport = useCallback(() => {
    if (parsedResume) {
      const convertedData = convertToResumeData(parsedResume)
      onImport(convertedData, parsedResume)
    }
  }, [parsedResume, onImport])

  const handleReset = useCallback(() => {
    setState('idle')
    setError(null)
    setParsedResume(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  return (
    <div className="mx-auto w-full max-w-2xl">
      <AnimatePresence mode="wait">
        {/* Idle / Dragging State */}
        {(state === 'idle' || state === 'dragging') && (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`relative rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
              state === 'dragging'
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card hover:border-primary/50 hover:bg-muted/50'
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileSelect}
              className="absolute inset-0 cursor-pointer opacity-0"
            />

            <div className="flex flex-col items-center gap-4">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-full transition-colors ${
                  state === 'dragging' ? 'bg-primary/20' : 'bg-muted'
                }`}
              >
                <Upload className={`h-8 w-8 ${state === 'dragging' ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>

              <div>
                <h3 className="mb-1 font-display text-lg font-semibold">Import existing resume</h3>
                <p className="text-sm text-muted-foreground">
                  Drag and drop your PDF or DOCX file here, or click to browse
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  PDF
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  DOCX
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Parsing State */}
        {state === 'parsing' && (
          <motion.div
            key="parsing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-xl border border-border bg-card p-12 text-center"
          >
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <div>
                <h3 className="mb-1 font-display text-lg font-semibold">Parsing your resume...</h3>
                <p className="text-sm text-muted-foreground">Extracting sections and detecting content structure</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {state === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-xl border border-destructive/30 bg-destructive/5 p-8"
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h3 className="mb-1 font-display text-lg font-semibold text-destructive">Import Failed</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
              <button
                onClick={handleReset}
                className="mt-2 inline-flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary/80"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}

        {/* Preview State */}
        {state === 'preview' && parsedResume && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="overflow-hidden rounded-xl border border-border bg-card"
          >
            {/* Header */}
            <div className="border-b border-border bg-muted/30 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                    <CheckCircle2 className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold">Resume Parsed Successfully</h3>
                    <p className="text-sm text-muted-foreground">
                      Confidence: {parsedResume.parseInfo.confidence}% • {parsedResume.parseInfo.fileName}
                    </p>
                  </div>
                </div>
                <button onClick={handleReset} className="rounded p-1.5 hover:bg-muted">
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Warnings */}
            {parsedResume.parseInfo.warnings.length > 0 && (
              <div className="border-b border-border bg-amber-500/5 px-6 py-3">
                <div className="flex items-start gap-2">
                  <FileWarning className="mt-0.5 h-4 w-4 text-amber-600" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-700">Parsing Notes</p>
                    <ul className="mt-1 space-y-0.5 text-amber-600">
                      {parsedResume.parseInfo.warnings.map((warning, i) => (
                        <li key={i}>• {warning}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Content Preview */}
            <div className="max-h-96 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Personal Info */}
                <section>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Personal Information
                  </h4>
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="font-semibold">{parsedResume.fullName || 'Name not detected'}</p>
                    {parsedResume.jobTitle && <p className="text-sm text-muted-foreground">{parsedResume.jobTitle}</p>}
                    <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                      {parsedResume.contact.email && <span>{parsedResume.contact.email}</span>}
                      {parsedResume.contact.phone && <span>{parsedResume.contact.phone}</span>}
                      {parsedResume.contact.location && <span>{parsedResume.contact.location}</span>}
                    </div>
                  </div>
                </section>

                {/* Experience */}
                {parsedResume.experiences.length > 0 && (
                  <section>
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Experience ({parsedResume.experiences.length})
                    </h4>
                    <div className="space-y-2">
                      {parsedResume.experiences.slice(0, 3).map((exp, i) => (
                        <div key={i} className="rounded-lg bg-muted/50 p-3">
                          <p className="font-medium">{exp.position}</p>
                          <p className="text-sm text-muted-foreground">{exp.company}</p>
                        </div>
                      ))}
                      {parsedResume.experiences.length > 3 && (
                        <p className="text-sm text-muted-foreground">
                          +{parsedResume.experiences.length - 3} more entries
                        </p>
                      )}
                    </div>
                  </section>
                )}

                {/* Education */}
                {parsedResume.education.length > 0 && (
                  <section>
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Education ({parsedResume.education.length})
                    </h4>
                    <div className="space-y-2">
                      {parsedResume.education.map((edu, i) => (
                        <div key={i} className="rounded-lg bg-muted/50 p-3">
                          <p className="font-medium">{edu.degree}</p>
                          <p className="text-sm text-muted-foreground">{edu.institution}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Skills */}
                {parsedResume.skills.length > 0 && (
                  <section>
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Skills ({parsedResume.skills.length})
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {parsedResume.skills.slice(0, 15).map((skill, i) => (
                        <span key={i} className="rounded-full bg-secondary px-2.5 py-1 text-xs">
                          {skill}
                        </span>
                      ))}
                      {parsedResume.skills.length > 15 && (
                        <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                          +{parsedResume.skills.length - 15} more
                        </span>
                      )}
                    </div>
                  </section>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-border bg-muted/30 px-6 py-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Review the extracted data above before importing.</p>
                <div className="flex gap-3">
                  {onCancel && (
                    <button
                      onClick={onCancel}
                      className="inline-flex h-10 items-center rounded-md px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={handleConfirmImport}
                    className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Import Resume
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
