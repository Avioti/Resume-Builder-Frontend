/**
 * Resume Import Modal
 * A modal wrapper for the resume import component with navigation integration
 */
import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ResumeImport } from 'src/components/resume-import'
import { useExtendedResume } from 'src/lib/extended-resume-context'
import { ParsedResume } from 'src/lib/resume-parser'

interface ImportModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ImportModal({ isOpen, onClose }: ImportModalProps) {
  const navigate = useNavigate()
  const { importData } = useExtendedResume()
  const [importSuccess, setImportSuccess] = useState(false)

  const handleImport = useCallback(
    (data: ReturnType<typeof import('src/lib/resume-parser').convertToResumeData>, _parsed: ParsedResume) => {
      // Import the parsed data into context
      importData(data)
      setImportSuccess(true)

      // Navigate to the resume builder after a brief delay
      setTimeout(() => {
        onClose()
        navigate('/resume')
      }, 1500)
    },
    [importData, navigate, onClose],
  )

  const handleClose = useCallback(() => {
    setImportSuccess(false)
    onClose()
  }, [onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-2xl rounded-xl border border-border bg-background p-6 shadow-2xl">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 rounded-full p-1.5 hover:bg-muted"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>

              {/* Content */}
              {importSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 text-center"
                >
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
                    <motion.svg
                      className="h-8 w-8 text-accent"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <motion.path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </motion.svg>
                  </div>
                  <h3 className="mb-2 font-display text-xl font-semibold">Import Successful!</h3>
                  <p className="text-muted-foreground">Redirecting to the resume builder...</p>
                </motion.div>
              ) : (
                <>
                  <header className="mb-6 pr-8">
                    <h2 className="font-display text-xl font-semibold">Import Your Resume</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Upload your existing resume to auto-fill the builder
                    </p>
                  </header>

                  <ResumeImport onImport={handleImport} onCancel={handleClose} />
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
