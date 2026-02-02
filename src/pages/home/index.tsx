import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { Check, FileText, Clock, Shield, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { getLandingLayout } from 'src/components/layout'
import { fadeInUp, staggerContainer, fadeIn } from 'src/lib/motion'

// Social proof stats - would come from API in production
const STATS = [
  { value: '50,000+', label: 'Resumes created' },
  { value: '4.9/5', label: 'User rating' },
  { value: '< 10 min', label: 'Average completion' },
]

// Key benefits with icons
const BENEFITS = [
  {
    icon: Clock,
    title: 'Done in minutes',
    description: 'Our guided flow gets you from blank page to polished resume in under 10 minutes.',
  },
  {
    icon: Shield,
    title: 'ATS-friendly formats',
    description: 'Clean, parseable layouts that pass applicant tracking systems every time.',
  },
  {
    icon: Sparkles,
    title: 'No gimmicks',
    description: 'No AI fluff or keyword stuffing. Just you, presented professionally.',
  },
]

// What makes a resume stand out - educational content for SEO
const RESUME_TIPS = [
  'Clear contact information at the top',
  'Quantified achievements, not just duties',
  'Consistent formatting throughout',
  'Relevant keywords for your industry',
  'One page for most professionals',
]

function HomePage() {
  return (
    <>
      <Helmet>
        <title>Craftfolio — Build Resumes That Land Interviews</title>
        <meta
          name="description"
          content="Create a polished, professional resume in minutes. A calm, guided experience for professionals who value clarity over gimmicks. Free to start, no signup required."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden pb-16 pt-24 md:pb-24 md:pt-32">
        {/* Subtle background texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
          aria-hidden="true"
        />

        <div className="container relative">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Eyebrow */}
            <motion.p variants={fadeInUp} className="mb-4 text-sm font-medium tracking-wide text-accent">
              FREE RESUME BUILDER
            </motion.p>

            {/* Main headline */}
            <motion.h1 variants={fadeInUp} className="text-balance mb-6 font-display text-display-xl text-foreground">
              Your resume,{' '}
              <span className="relative">
                <span className="relative z-10">crafted with care</span>
                <span className="absolute bottom-1 left-0 -z-0 h-3 w-full bg-accent/20" aria-hidden="true" />
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeInUp}
              className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl"
            >
              A calm, guided experience that helps professionals create polished, recruiter-ready resumes — without the
              gimmicks or AI fluff.
            </motion.p>

            {/* Primary CTA */}
            <motion.div variants={fadeInUp} className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/start"
                  className="shadow-warm hover:shadow-warm-lg inline-flex h-14 items-center justify-center gap-2 rounded-md bg-primary px-8 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90"
                >
                  <FileText className="h-5 w-5" />
                  Start Building — It&apos;s Free
                </Link>
              </motion.div>
              <span className="text-sm text-muted-foreground">No signup required to start</span>
            </motion.div>
          </motion.div>

          {/* Social proof stats */}
          <motion.div
            className="mx-auto mt-16 max-w-2xl"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 0.4 }}
          >
            <ul className="grid grid-cols-3 gap-4 border-y border-border py-6">
              {STATS.map((stat) => (
                <li key={stat.label} className="text-center">
                  <p className="font-display text-2xl font-semibold text-foreground md:text-3xl">{stat.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground md:text-sm">{stat.label}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Resume Preview Mockup */}
      <section className="py-16 md:py-24" aria-labelledby="preview-heading">
        <div className="container">
          <motion.div
            className="mx-auto max-w-4xl"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Floating resume preview */}
            <motion.div
              className="shadow-warm-lg relative mx-auto aspect-[1/1.2] max-w-md overflow-hidden rounded-lg border border-border bg-white md:aspect-[1/1.1]"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              {/* Browser chrome mockup */}
              <div className="flex items-center gap-1.5 border-b border-gray-100 bg-gray-50 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
              </div>

              {/* Resume content mockup */}
              <div className="p-6 md:p-8">
                {/* Header */}
                <div className="mb-6 border-b border-gray-100 pb-4">
                  <div className="mb-2 h-6 w-40 rounded bg-foreground/10" />
                  <div className="h-3 w-28 rounded bg-accent/30" />
                  <div className="mt-3 flex gap-4">
                    <div className="h-2 w-20 rounded bg-gray-100" />
                    <div className="h-2 w-24 rounded bg-gray-100" />
                  </div>
                </div>

                {/* Summary section */}
                <div className="mb-6">
                  <div className="mb-2 h-3 w-16 rounded bg-gray-200" />
                  <div className="space-y-1.5">
                    <div className="h-2 w-full rounded bg-gray-100" />
                    <div className="h-2 w-11/12 rounded bg-gray-100" />
                    <div className="h-2 w-4/5 rounded bg-gray-100" />
                  </div>
                </div>

                {/* Experience section */}
                <div className="mb-6">
                  <div className="mb-3 h-3 w-20 rounded bg-gray-200" />
                  <div className="space-y-4">
                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <div className="h-3 w-32 rounded bg-foreground/10" />
                        <div className="h-2 w-16 rounded bg-gray-100" />
                      </div>
                      <div className="mb-2 h-2 w-24 rounded bg-accent/20" />
                      <div className="space-y-1">
                        <div className="h-2 w-full rounded bg-gray-100" />
                        <div className="h-2 w-5/6 rounded bg-gray-100" />
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <div className="h-3 w-28 rounded bg-foreground/10" />
                        <div className="h-2 w-16 rounded bg-gray-100" />
                      </div>
                      <div className="mb-2 h-2 w-20 rounded bg-accent/20" />
                      <div className="space-y-1">
                        <div className="h-2 w-full rounded bg-gray-100" />
                        <div className="h-2 w-3/4 rounded bg-gray-100" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills section */}
                <div>
                  <div className="mb-2 h-3 w-12 rounded bg-gray-200" />
                  <div className="flex flex-wrap gap-2">
                    <div className="h-5 w-16 rounded-full bg-secondary" />
                    <div className="h-5 w-20 rounded-full bg-secondary" />
                    <div className="h-5 w-14 rounded-full bg-secondary" />
                    <div className="h-5 w-18 rounded-full bg-secondary" />
                  </div>
                </div>
              </div>
            </motion.div>

            <h2 id="preview-heading" className="sr-only">
              Resume preview example
            </h2>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/50 py-16 md:py-24" aria-labelledby="benefits-heading">
        <div className="container">
          <motion.header
            className="mx-auto mb-12 max-w-2xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 id="benefits-heading" className="text-balance mb-4 font-display text-display-md text-foreground">
              Built for professionals who value their time
            </h2>
            <p className="text-muted-foreground">
              No bloat. No confusing options. Just a clear path from blank page to finished resume.
            </p>
          </motion.header>

          <motion.ul
            className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 0.1 },
              },
            }}
          >
            {BENEFITS.map((benefit) => {
              const Icon = benefit.icon
              return (
                <motion.li
                  key={benefit.title}
                  className="shadow-warm-sm rounded-lg border border-border bg-card p-6"
                  variants={fadeInUp}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                    <Icon className="h-5 w-5 text-accent" />
                  </span>
                  <h3 className="mb-2 font-display text-lg font-medium text-foreground">{benefit.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{benefit.description}</p>
                </motion.li>
              )
            })}
          </motion.ul>
        </div>
      </section>

      {/* Educational Content Section (SEO) */}
      <section className="py-16 md:py-24" aria-labelledby="tips-heading">
        <div className="container">
          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Content */}
            <div>
              <h2 id="tips-heading" className="text-balance mb-6 font-display text-display-sm text-foreground">
                What makes a resume stand out to recruiters?
              </h2>
              <p className="mb-8 text-muted-foreground">
                We&apos;ve analyzed thousands of successful resumes to understand what actually works. Here&apos;s what
                top recruiters look for:
              </p>

              <ul className="space-y-4">
                {RESUME_TIPS.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10">
                      <Check className="h-3 w-3 text-accent" />
                    </span>
                    <span className="text-foreground">{tip}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link
                  to="/start"
                  className="inline-flex items-center gap-2 font-medium text-accent transition-colors hover:text-accent/80"
                >
                  Build your resume with these principles
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            {/* Testimonial card */}
            <div className="flex items-center">
              <blockquote className="shadow-warm rounded-lg border border-border bg-card p-8">
                <p className="mb-6 text-lg leading-relaxed text-foreground">
                  &ldquo;I was skeptical of another resume builder, but Craftfolio surprised me. No upsells, no
                  AI-generated nonsense — just a clean, professional result in under 10 minutes.&rdquo;
                </p>
                <footer className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary font-display text-lg font-semibold text-foreground">
                    SK
                  </div>
                  <div>
                    <cite className="font-medium not-italic text-foreground">Sarah K.</cite>
                    <p className="text-sm text-muted-foreground">Product Designer</p>
                  </div>
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="border-t border-border py-16 md:py-24" aria-labelledby="cta-heading">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="cta-heading" className="text-balance mb-4 font-display text-display-md text-foreground">
              Ready to create your resume?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join thousands of professionals who&apos;ve landed interviews with Craftfolio.
            </p>
            <Link
              to="/start"
              className="shadow-warm hover:shadow-warm-lg inline-flex h-14 items-center justify-center gap-2 rounded-md bg-primary px-8 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90"
            >
              Start Building — It&apos;s Free
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">No credit card required • Export to PDF anytime</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-8">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
                <FileText className="h-3 w-3 text-primary-foreground" />
              </div>
              <span className="font-display text-sm font-medium">Craftfolio</span>
            </div>
            <nav aria-label="Footer navigation">
              <ul className="flex items-center gap-6 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="transition-colors hover:text-foreground">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-foreground">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-foreground">
                    Contact
                  </a>
                </li>
              </ul>
            </nav>
            <p className="text-sm text-muted-foreground">© 2026 Craftfolio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}

HomePage.getLayout = getLandingLayout

export default HomePage
