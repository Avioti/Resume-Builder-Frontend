import { useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { ArrowRight, Clock, Sparkles, Shield, Upload } from 'lucide-react'
import { motion } from 'framer-motion'
import { getBuilderLayout } from 'src/components/layout'
import { fadeInUp, staggerContainer } from 'src/lib/motion'
import { ImportModal } from 'src/components/import-modal'

function StartPage() {
  const [showImportModal, setShowImportModal] = useState(false)

  return (
    <>
      <Helmet>
        <title>Start Building — BeatTheATS</title>
        <meta
          name="description"
          content="Build an ATS-optimized resume that gets past applicant tracking systems. No sign-up required."
        />
      </Helmet>

      <div className="container py-12 md:py-20">
        <motion.div className="mx-auto max-w-2xl" initial="hidden" animate="visible" variants={staggerContainer}>
          {/* Header */}
          <motion.header variants={fadeInUp} className="mb-12 text-center">
            <h1 className="mb-4 font-display text-display-md text-foreground">Build your ATS-ready resume</h1>
            <p className="text-lg text-muted-foreground">
              Answer a few questions and create a resume that passes applicant tracking systems.
            </p>
          </motion.header>

          {/* Value props */}
          <motion.section variants={fadeInUp} aria-label="What to expect" className="mb-12">
            <ul className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: Clock, label: '5 minutes', sub: 'to complete' },
                { icon: Shield, label: 'ATS-safe', sub: 'formatting' },
                { icon: Sparkles, label: 'No signup', sub: 'to start' },
              ].map((item, i) => (
                <motion.li
                  key={item.label}
                  className="shadow-warm-sm flex flex-col items-center rounded-lg bg-card p-6 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <item.icon className="mb-3 h-6 w-6 text-accent" />
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-xs text-muted-foreground">{item.sub}</span>
                </motion.li>
              ))}
            </ul>
          </motion.section>

          {/* Start options */}
          <motion.section variants={fadeInUp} className="space-y-4">
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Link
                to="/resume"
                className="shadow-warm-sm hover:shadow-warm group flex items-center justify-between rounded-lg border border-border bg-card p-6 transition-all hover:border-accent/50"
              >
                <div>
                  <h2 className="mb-1 font-display text-lg font-medium text-foreground">Start from scratch</h2>
                  <p className="text-sm text-muted-foreground">Build your resume step by step with our guided editor</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent" />
              </Link>
            </motion.div>

            {/* Import existing resume */}
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <button
                onClick={() => setShowImportModal(true)}
                className="shadow-warm-sm hover:shadow-warm group flex w-full items-center justify-between rounded-lg border border-border bg-card p-6 text-left transition-all hover:border-primary/50"
              >
                <div>
                  <h2 className="mb-1 font-display text-lg font-medium text-foreground">Import existing resume</h2>
                  <p className="text-sm text-muted-foreground">Upload a PDF or DOCX to auto-fill the builder</p>
                </div>
                <Upload className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
              </button>
            </motion.div>
          </motion.section>
        </motion.div>
      </div>

      {/* Import Modal */}
      <ImportModal isOpen={showImportModal} onClose={() => setShowImportModal(false)} />
    </>
  )
}

StartPage.getLayout = getBuilderLayout

export default StartPage
