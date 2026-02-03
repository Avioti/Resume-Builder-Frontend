/**
 * Section Manager Component
 * Toggle visibility and reorder resume sections
 */
import { useState } from 'react'
import { Eye, EyeOff, GripVertical, Settings2, X } from 'lucide-react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { useExtendedResume } from 'src/lib/extended-resume-context'
import { SectionConfig, SectionId, SECTION_LABELS } from 'src/lib/resume-sections'

// Section icons
const SECTION_ICONS: Record<SectionId, string> = {
  personal: '👤',
  summary: '📝',
  experience: '💼',
  education: '🎓',
  skills: '⚡',
  projects: '🚀',
  certifications: '🏆',
  expertise: '🎯',
  links: '🔗',
}

export function SectionManager() {
  const { data, toggleSection, reorderSection } = useExtendedResume()
  const [isOpen, setIsOpen] = useState(false)

  const enabledCount = data.sectionConfig.filter((s) => s.enabled).length

  return (
    <>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
      >
        <Settings2 className="h-4 w-4" />
        Manage Sections
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{enabledCount} active</span>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 right-0 top-0 z-50 w-full max-w-sm border-l border-border bg-card shadow-2xl"
            >
              <div className="flex h-full flex-col">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border p-4">
                  <div>
                    <h2 className="font-display text-lg font-semibold">Manage Sections</h2>
                    <p className="text-sm text-muted-foreground">Toggle and reorder resume sections</p>
                  </div>
                  <button type="button" onClick={() => setIsOpen(false)} className="rounded p-1.5 hover:bg-muted">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                  <Reorder.Group
                    axis="y"
                    values={data.sectionConfig}
                    onReorder={(newOrder) => {
                      newOrder.forEach((config, index) => {
                        if (data.sectionConfig[index].id !== config.id) {
                          reorderSection(config.id, index)
                        }
                      })
                    }}
                    className="space-y-2"
                  >
                    {data.sectionConfig.map((section) => (
                      <SectionItem key={section.id} section={section} onToggle={() => toggleSection(section.id)} />
                    ))}
                  </Reorder.Group>
                </div>

                {/* Footer */}
                <div className="border-t border-border p-4">
                  <p className="text-xs text-muted-foreground">
                    <strong>Tip:</strong> Only enabled sections appear on your resume. Drag to reorder.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function SectionItem({ section, onToggle }: { section: SectionConfig; onToggle: () => void }) {
  const isCore = ['personal', 'experience', 'education', 'skills'].includes(section.id)

  return (
    <Reorder.Item
      value={section}
      className={`group flex items-center gap-3 rounded-lg border p-3 transition-colors ${
        section.enabled ? 'border-border bg-card' : 'border-dashed border-border/50 bg-muted/30'
      }`}
    >
      {/* Drag handle */}
      <div className="cursor-grab text-muted-foreground/50 active:cursor-grabbing">
        <GripVertical className="h-5 w-5" />
      </div>

      {/* Icon and label */}
      <div className="flex flex-1 items-center gap-3">
        <span className="text-xl">{SECTION_ICONS[section.id]}</span>
        <div>
          <span className={`font-medium ${section.enabled ? 'text-foreground' : 'text-muted-foreground'}`}>
            {SECTION_LABELS[section.id]}
          </span>
          {isCore && (
            <span className="ml-2 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">CORE</span>
          )}
          {!section.enabled && <span className="ml-2 text-xs text-muted-foreground">(hidden)</span>}
        </div>
      </div>

      {/* Toggle button */}
      <button
        type="button"
        onClick={onToggle}
        className={`rounded p-2 transition-colors ${
          section.enabled
            ? 'bg-accent/10 text-accent hover:bg-accent/20'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
        }`}
        title={section.enabled ? 'Hide section' : 'Show section'}
      >
        {section.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
      </button>
    </Reorder.Item>
  )
}

// Compact version for inline use
export function SectionToggleList() {
  const { data, toggleSection } = useExtendedResume()

  return (
    <div className="flex flex-wrap gap-2">
      {data.sectionConfig.map((section) => (
        <button
          key={section.id}
          type="button"
          onClick={() => toggleSection(section.id)}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            section.enabled ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
          }`}
        >
          <span>{SECTION_ICONS[section.id]}</span>
          {SECTION_LABELS[section.id]}
          {section.enabled ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
        </button>
      ))}
    </div>
  )
}
