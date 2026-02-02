import { useResume } from 'src/lib/resume-context'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

function Input({ label, id, error, className = '', ...props }: InputProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
        {props.required && <span className="ml-1 text-accent">*</span>}
      </label>
      <input
        id={id}
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
        {...props}
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

function Textarea({ label, id, error, className = '', ...props }: TextareaProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
        {props.required && <span className="ml-1 text-accent">*</span>}
      </label>
      <textarea
        id={id}
        className="min-h-[100px] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
        {...props}
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  )
}

export function PersonalInfoForm() {
  const { data, updatePersonal } = useResume()
  const { personal } = data

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Full Name"
          id="fullName"
          type="text"
          required
          placeholder="John Smith"
          value={personal.fullName}
          onChange={(e) => updatePersonal({ fullName: e.target.value })}
        />
        <Input
          label="Job Title"
          id="jobTitle"
          type="text"
          required
          placeholder="Senior Product Designer"
          value={personal.jobTitle}
          onChange={(e) => updatePersonal({ jobTitle: e.target.value })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Email"
          id="email"
          type="email"
          required
          placeholder="john@example.com"
          value={personal.email}
          onChange={(e) => updatePersonal({ email: e.target.value })}
        />
        <Input
          label="Phone"
          id="phone"
          type="tel"
          placeholder="(555) 123-4567"
          value={personal.phone}
          onChange={(e) => updatePersonal({ phone: e.target.value })}
        />
      </div>

      <Input
        label="Location"
        id="location"
        type="text"
        placeholder="San Francisco, CA"
        value={personal.location}
        onChange={(e) => updatePersonal({ location: e.target.value })}
      />

      <Textarea
        label="Professional Summary"
        id="summary"
        placeholder="A brief 2-3 sentence summary highlighting your experience and what you bring to the role..."
        value={personal.summary}
        onChange={(e) => updatePersonal({ summary: e.target.value })}
      />
    </div>
  )
}

export { Input, Textarea }
