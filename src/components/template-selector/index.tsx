/**
 * Template Selector Component
 *
 * A visual grid for selecting resume templates with ATS risk indicators.
 */
import { useState } from 'react'
import { Check, AlertTriangle, Shield, Info, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTemplate } from 'src/lib/template-context'
import { ResumeTemplate, getATSRiskLabel, getATSRiskColor, ATSRiskLevel } from 'src/lib/resume-templates'

interface TemplateSelectorProps {
  /** Compact mode for sidebar */
  compact?: boolean
  /** Callback when template changes */
  onChange?: (template: ResumeTemplate) => void
}

export function TemplateSelector({ compact = false, onChange }: TemplateSelectorProps) {
  const { template: currentTemplate, setTemplateId, templates } = useTemplate()
  const [showDetails, setShowDetails] = useState<string | null>(null)

  const handleSelect = (template: ResumeTemplate) => {
    setTemplateId(template.id)
    onChange?.(template)
  }

  const getRiskIcon = (risk: ATSRiskLevel) => {
    switch (risk) {
      case 'safe':
        return <Shield className="h-3.5 w-3.5" />
      case 'caution':
        return <AlertTriangle className="h-3.5 w-3.5" />
      case 'risky':
        return <AlertTriangle className="h-3.5 w-3.5" />
      default:
        return null
    }
  }

  // Group templates by risk level
  const safeTemplates = templates.filter((t) => t.atsRisk === 'safe')
  const cautionTemplates = templates.filter((t) => t.atsRisk === 'caution')

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">Template</h3>
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${getATSRiskColor(
              currentTemplate.atsRisk,
            )}`}
          >
            {getRiskIcon(currentTemplate.atsRisk)}
            {getATSRiskLabel(currentTemplate.atsRisk)}
          </span>
        </div>

        <select
          value={currentTemplate.id}
          onChange={(e) => {
            const tmpl = templates.find((t) => t.id === e.target.value)
            if (tmpl) handleSelect(tmpl)
          }}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <optgroup label="ATS Safe">
            {safeTemplates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </optgroup>
          <optgroup label="Use with Caution">
            {cautionTemplates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </optgroup>
        </select>

        <p className="text-xs text-muted-foreground">{currentTemplate.description}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ATS Safe Templates */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <Shield className="h-4 w-4 text-green-600" />
          <h3 className="font-medium text-foreground">ATS Safe Templates</h3>
          <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600">Recommended</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {safeTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={currentTemplate.id === template.id}
              onSelect={() => handleSelect(template)}
              onShowDetails={() => setShowDetails(template.id)}
            />
          ))}
        </div>
      </section>

      {/* Caution Templates */}
      {cautionTemplates.length > 0 && (
        <section>
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <h3 className="font-medium text-foreground">Use with Caution</h3>
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600">
              May affect ATS parsing
            </span>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            These templates look great but may not parse correctly in all applicant tracking systems. Best for direct
            applications or creative roles.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cautionTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={currentTemplate.id === template.id}
                onSelect={() => handleSelect(template)}
                onShowDetails={() => setShowDetails(template.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Details Modal */}
      <AnimatePresence>
        {showDetails && templates.find((t) => t.id === showDetails) && (
          <TemplateDetailsModal
            template={templates.find((t) => t.id === showDetails)!}
            onClose={() => setShowDetails(null)}
            onSelect={() => {
              const tmpl = templates.find((t) => t.id === showDetails)
              if (tmpl) {
                handleSelect(tmpl)
                setShowDetails(null)
              }
            }}
            isSelected={currentTemplate.id === showDetails}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ===== TEMPLATE CARD COMPONENT =====

interface TemplateCardProps {
  template: ResumeTemplate
  isSelected: boolean
  onSelect: () => void
  onShowDetails: () => void
}

function TemplateCard({ template, isSelected, onSelect, onShowDetails }: TemplateCardProps) {
  const { style } = template

  // Generate mini preview based on style
  const getHeaderPreview = () => {
    switch (style.headerStyle) {
      case 'centered':
        return (
          <div className="mb-2 text-center">
            <div className="mx-auto mb-1 h-2 w-16 rounded" style={{ backgroundColor: `hsl(${style.accentColor})` }} />
            <div className="mx-auto h-1.5 w-12 rounded bg-gray-200" />
          </div>
        )
      case 'minimal':
        return (
          <div className="mb-2">
            <div className="mb-1 h-2 w-14 rounded bg-gray-300" />
            <div className="h-1 w-20 rounded bg-gray-200" />
          </div>
        )
      default: // left-aligned
        return (
          <div className="mb-2">
            <div className="mb-1 h-2.5 w-20 rounded" style={{ backgroundColor: `hsl(${style.accentColor})` }} />
            <div className="h-1.5 w-16 rounded bg-gray-200" />
          </div>
        )
    }
  }

  const getSectionPreview = () => {
    switch (style.sectionStyle) {
      case 'underlined':
        return (
          <div className="mb-1.5">
            <div className="h-1.5 w-12 rounded bg-gray-300" />
            <div className="mt-0.5 h-px w-full bg-gray-200" />
          </div>
        )
      case 'background':
        return (
          <div className="mb-1.5 rounded px-1 py-0.5" style={{ backgroundColor: `hsl(${style.accentColor} / 0.1)` }}>
            <div className="h-1.5 w-12 rounded" style={{ backgroundColor: `hsl(${style.accentColor})` }} />
          </div>
        )
      case 'border-left':
        return (
          <div className="mb-1.5 border-l-2 pl-1.5" style={{ borderColor: `hsl(${style.accentColor})` }}>
            <div className="h-1.5 w-12 rounded bg-gray-300" />
          </div>
        )
      default: // simple
        return (
          <div className="mb-1.5">
            <div className="h-1.5 w-12 rounded" style={{ backgroundColor: `hsl(${style.accentColor})` }} />
          </div>
        )
    }
  }

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      className={`group relative overflow-hidden rounded-lg border-2 p-1 text-left transition-all ${
        isSelected
          ? 'border-primary bg-primary/5 ring-2 ring-primary ring-offset-2'
          : 'border-border bg-card hover:border-primary/50'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute right-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-3 w-3" />
        </div>
      )}

      {/* Mini preview */}
      <div className="aspect-[8.5/11] rounded bg-white p-3 shadow-sm">
        {getHeaderPreview()}
        {getSectionPreview()}
        <div className="space-y-1">
          <div className="h-1 w-full rounded bg-gray-100" />
          <div className="h-1 w-4/5 rounded bg-gray-100" />
          <div className="h-1 w-3/4 rounded bg-gray-100" />
        </div>
        <div className="mt-2">{getSectionPreview()}</div>
        <div className="space-y-1">
          <div className="h-1 w-full rounded bg-gray-100" />
          <div className="h-1 w-5/6 rounded bg-gray-100" />
        </div>
      </div>

      {/* Template info */}
      <div className="p-3">
        <div className="mb-1 flex items-center justify-between">
          <h4 className="font-medium text-foreground">{template.name}</h4>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onShowDetails()
            }}
            className="rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100"
            aria-label="View template details"
          >
            <Info className="h-4 w-4" />
          </button>
        </div>
        <p className="mb-2 line-clamp-2 text-xs text-muted-foreground">{template.description}</p>
        <div
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${getATSRiskColor(
            template.atsRisk,
          )}`}
        >
          {template.atsRisk === 'safe' ? <Shield className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
          {getATSRiskLabel(template.atsRisk)}
        </div>
      </div>
    </motion.button>
  )
}

// ===== TEMPLATE DETAILS MODAL =====

interface TemplateDetailsModalProps {
  template: ResumeTemplate
  onClose: () => void
  onSelect: () => void
  isSelected: boolean
}

function TemplateDetailsModal({ template, onClose, onSelect, isSelected }: TemplateDetailsModalProps) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-md -translate-y-1/2 rounded-xl border border-border bg-background p-6 shadow-2xl md:inset-x-auto"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 hover:bg-muted"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>

        {/* Header */}
        <div className="mb-4 pr-8">
          <h3 className="font-display text-xl font-semibold">{template.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{template.description}</p>
        </div>

        {/* ATS Risk Badge */}
        <div
          className={`mb-4 inline-flex items-center gap-2 rounded-lg border px-3 py-2 ${getATSRiskColor(
            template.atsRisk,
          )}`}
        >
          {template.atsRisk === 'safe' ? <Shield className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
          <div>
            <p className="text-sm font-medium">{getATSRiskLabel(template.atsRisk)}</p>
          </div>
        </div>

        {/* ATS Notes */}
        <div className="mb-6">
          <h4 className="mb-2 text-sm font-medium text-foreground">ATS Compatibility Notes</h4>
          <ul className="space-y-2">
            {template.atsNotes.map((note, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                {note}
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            Cancel
          </button>
          <button
            onClick={onSelect}
            disabled={isSelected}
            className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {isSelected ? 'Selected' : 'Use This Template'}
          </button>
        </div>
      </motion.div>
    </>
  )
}
