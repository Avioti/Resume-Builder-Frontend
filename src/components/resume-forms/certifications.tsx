/**
 * Certifications Form Component
 * Manages certification entries with ATS-safe formatting
 */
import { useState } from 'react'
import { Plus, Trash2, ExternalLink, Award } from 'lucide-react'
import { useExtendedResume, Certification } from 'src/lib/extended-resume-context'
import { isValidUrl } from 'src/lib/resume-sections'

export function CertificationsForm() {
  const { data, addCertification, removeCertification } = useExtendedResume()
  const { certifications } = data

  const [isAdding, setIsAdding] = useState(false)
  const [newCert, setNewCert] = useState<Omit<Certification, 'id'>>({
    name: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    credentialUrl: '',
    noExpiry: false,
  })

  const handleAddCertification = () => {
    if (newCert.name.trim() && newCert.issuer.trim()) {
      addCertification(newCert)
      setNewCert({
        name: '',
        issuer: '',
        issueDate: '',
        expiryDate: '',
        credentialId: '',
        credentialUrl: '',
        noExpiry: false,
      })
      setIsAdding(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Info banner */}
      <div className="rounded-lg border border-accent/20 bg-accent/5 p-4">
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">ATS Tip:</strong> Include certifications that are relevant to your target
          role. Credential IDs help recruiters verify your qualifications.
        </p>
      </div>

      {/* Existing certifications */}
      {certifications.length > 0 && (
        <div className="space-y-3">
          {certifications.map((cert) => (
            <CertificationCard key={cert.id} certification={cert} onRemove={removeCertification} />
          ))}
        </div>
      )}

      {/* Add new certification form */}
      {isAdding ? (
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <h3 className="mb-4 font-medium">Add Certification</h3>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Certification Name *</label>
                <input
                  type="text"
                  value={newCert.name}
                  onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g., AWS Solutions Architect"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Issuing Organization *</label>
                <input
                  type="text"
                  value={newCert.issuer}
                  onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g., Amazon Web Services"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Issue Date</label>
                <input
                  type="month"
                  value={newCert.issueDate || ''}
                  onChange={(e) => setNewCert({ ...newCert, issueDate: e.target.value })}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Expiry Date</label>
                <input
                  type="month"
                  value={newCert.expiryDate || ''}
                  onChange={(e) => setNewCert({ ...newCert, expiryDate: e.target.value })}
                  disabled={newCert.noExpiry}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                />
                <label className="mt-2 flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={newCert.noExpiry}
                    onChange={(e) => setNewCert({ ...newCert, noExpiry: e.target.checked, expiryDate: '' })}
                    className="h-4 w-4 rounded border-input"
                  />
                  Does not expire
                </label>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Credential ID</label>
                <input
                  type="text"
                  value={newCert.credentialId || ''}
                  onChange={(e) => setNewCert({ ...newCert, credentialId: e.target.value })}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g., ABC123XYZ"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Credential URL</label>
                <input
                  type="url"
                  value={newCert.credentialUrl || ''}
                  onChange={(e) => setNewCert({ ...newCert, credentialUrl: e.target.value })}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="https://..."
                />
                {newCert.credentialUrl && !isValidUrl(newCert.credentialUrl) && (
                  <p className="mt-1 text-xs text-destructive">Please enter a valid URL</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="h-9 rounded-md px-4 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCertification}
                disabled={!newCert.name.trim() || !newCert.issuer.trim()}
                className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                Add Certification
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border py-4 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <Plus className="h-4 w-4" />
          Add Certification
        </button>
      )}
    </div>
  )
}

// Individual certification card
function CertificationCard({
  certification,
  onRemove,
}: {
  certification: Certification
  onRemove: (id: string) => void
}) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr + '-01')
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const getExpiryStatus = () => {
    if (certification.noExpiry) return 'No Expiry'
    if (!certification.expiryDate) return ''
    const expiry = new Date(certification.expiryDate + '-01')
    const now = new Date()
    if (expiry < now) return 'Expired'
    return `Expires ${formatDate(certification.expiryDate)}`
  }

  const expiryStatus = getExpiryStatus()
  const isExpired = expiryStatus === 'Expired'

  return (
    <div className="group rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <Award className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h4 className="font-medium">{certification.name}</h4>
            <p className="text-sm text-muted-foreground">{certification.issuer}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {certification.issueDate && <span>Issued {formatDate(certification.issueDate)}</span>}
              {expiryStatus && <span className={isExpired ? 'text-destructive' : ''}>• {expiryStatus}</span>}
            </div>
            {certification.credentialId && (
              <p className="mt-1 text-xs text-muted-foreground">ID: {certification.credentialId}</p>
            )}
            {certification.credentialUrl && (
              <a
                href={certification.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                Verify Credential
              </a>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onRemove(certification.id)}
          className="rounded p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
