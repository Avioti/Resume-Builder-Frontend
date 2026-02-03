import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { getDefaultLayout } from 'src/components/layout'

function SignupPage() {
  return (
    <>
      <Helmet>
        <title>Save Your Resume — BeatTheATS</title>
        <meta
          name="description"
          content="Create a free account to save your ATS-optimized resume and access it anytime."
        />
      </Helmet>

      <div className="container py-12 md:py-20">
        <div className="mx-auto max-w-md">
          {/* Back link */}
          <Link
            to="/resume"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to editor
          </Link>

          {/* Header */}
          <header className="mb-8">
            <h1 className="mb-3 font-display text-display-sm text-foreground">Save your progress</h1>
            <p className="text-muted-foreground">
              Create a free account to save your resume and access it from any device.
            </p>
          </header>

          {/* Benefits */}
          <ul className="mb-8 space-y-3" aria-label="Account benefits">
            {[
              'Save unlimited resumes',
              'Access from any device',
              'Track application status',
              'Get notified of new features',
            ].map((benefit) => (
              <li key={benefit} className="flex items-center gap-3 text-sm text-foreground">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/10">
                  <Check className="h-3 w-3 text-accent" />
                </span>
                {benefit}
              </li>
            ))}
          </ul>

          {/* Signup form (mock) */}
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              alert('Signup functionality coming soon!')
            }}
          >
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                autoComplete="new-password"
                required
                minLength={8}
                placeholder="At least 8 characters"
                className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <button
              type="submit"
              className="shadow-warm-sm hover:shadow-warm h-10 w-full rounded-md bg-primary text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90"
            >
              Create free account
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or continue with</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Social auth buttons (mock) */}
          <div className="space-y-3">
            <button
              type="button"
              className="shadow-warm-sm flex h-10 w-full items-center justify-center gap-2 rounded-md border border-border bg-card text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Terms */}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            By signing up, you agree to our{' '}
            <a href="#" className="underline hover:text-foreground">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="underline hover:text-foreground">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </>
  )
}

SignupPage.getLayout = getDefaultLayout

export default SignupPage
