import { useState } from 'react'
import { Helmet } from 'react-helmet'

export default function Resume() {
  const [name, setName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [skills, setSkills] = useState('')

  return (
    <>
      <Helmet>
        <title>Resume Builder</title>
      </Helmet>
      <div className="p-6">
        <h1 className="mb-4 text-2xl font-bold">Build Your Resume</h1>

        <div className="max-w-2xl space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border p-2"
          />

          <input
            type="text"
            placeholder="Job Title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full rounded border p-2"
          />

          <textarea
            placeholder="Skills (one per line)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="h-32 w-full rounded border p-2"
          />
        </div>

        {/* Preview */}
        <div className="mt-8 rounded border bg-gray-50 p-6">
          <h2 className="mb-2 text-xl font-bold">Preview</h2>
          <p className="font-semibold">{name || 'Your Name'}</p>
          <p className="text-gray-600">{jobTitle || 'Job Title'}</p>
          <pre className="mt-2 whitespace-pre-wrap">{skills || 'Skills'}</pre>
        </div>
      </div>
    </>
  )
}
