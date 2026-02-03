import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { Target, Zap, Shield, ScanLine, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { getLandingLayout } from 'src/components/layout'
import { fadeInUp, staggerContainer, fadeIn } from 'src/lib/motion'
import { TemplateShowcase } from 'src/components/template-showcase'

// Social proof stats - would come from API in production
const STATS = [
  { value: '50,000+', label: 'Resumes passed ATS' },
  { value: '92%', label: 'Interview rate' },
  { value: '< 10 min', label: 'To build' },
]

// Key benefits with icons
const BENEFITS = [
  {
    icon: ScanLine,
    title: 'ATS-optimized formatting',
    description: 'Clean, machine-readable layouts that pass applicant tracking systems every time.',
  },
  {
    icon: Zap,
    title: 'Ready in minutes',
    description: 'Our guided flow gets you from blank page to ATS-ready resume in under 10 minutes.',
  },
  {
    icon: Shield,
    title: 'Recruiter-approved',
    description: 'No fancy graphics that break ATS parsing. Just clean, professional formatting.',
  },
]

// ATS compatibility checklist - educational content for SEO
const ATS_CHECKLIST = [
  'Simple, single-column layout',
  'Standard section headings (Experience, Education, Skills)',
  'No tables, text boxes, or graphics',
  'ATS-safe fonts (Inter, Arial, Calibri)',
  'Clean bullet points with quantified achievements',
]

function HomePage() {
  return (
    <>
      <Helmet>
        <title>BeatTheATS — ATS-Optimized Resume Builder</title>
        <meta
          name="description"
          content="Build ATS-optimized resumes that get past applicant tracking systems and land interviews. Recruiter-readable formatting guaranteed. Free to start."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden pb-16 pt-24 md:pb-24 md:pt-32">
        {/* Subtle grid background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1v38h38V1H1z' fill='%23000' fill-opacity='1'/%3E%3C/svg%3E")`,
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
            <motion.p variants={fadeInUp} className="mb-4 text-sm font-semibold uppercase tracking-wide text-accent">
              ATS-OPTIMIZED RESUME BUILDER
            </motion.p>

            {/* Main headline */}
            <motion.h1 variants={fadeInUp} className="text-balance mb-6 font-display text-display-xl text-foreground">
              Get past the{' '}
              <span className="relative">
                <span className="relative z-10 text-primary">ATS</span>
                <span className="absolute bottom-1 left-0 -z-0 h-3 w-full bg-primary/20" aria-hidden="true" />
              </span>{' '}
              and land interviews
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeInUp}
              className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl"
            >
              75% of resumes never reach a human. Build yours with ATS-optimized formatting that passes applicant
              tracking systems and gets you in front of recruiters.
            </motion.p>

            {/* Primary CTA */}
            <motion.div variants={fadeInUp} className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/start"
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-md bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
                >
                  <Target className="h-5 w-5" />
                  Build Your ATS-Ready Resume
                </Link>
              </motion.div>
              <span className="text-sm text-muted-foreground">Free • No signup required</span>
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
            <ul className="grid grid-cols-3 gap-4 rounded-lg border border-border bg-card/50 py-6">
              {STATS.map((stat) => (
                <li key={stat.label} className="text-center">
                  <p className="font-display text-2xl font-bold text-foreground md:text-3xl">{stat.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground md:text-sm">{stat.label}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Template Showcase Section */}
      <section className="py-16 md:py-24" aria-labelledby="templates-heading">
        <div className="container">
          <h2 id="templates-heading" className="sr-only">
            Resume template examples
          </h2>
          <TemplateShowcase />
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
              Why most resumes fail ATS screening
            </h2>
            <p className="text-muted-foreground">
              Applicant tracking systems reject resumes with complex formatting, graphics, and non-standard layouts.
              BeatTheATS ensures you get through.
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
                  className="rounded-lg border border-border bg-card p-6 shadow-sm"
                  variants={fadeInUp}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </span>
                  <h3 className="mb-2 font-display text-lg font-semibold text-foreground">{benefit.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{benefit.description}</p>
                </motion.li>
              )
            })}
          </motion.ul>
        </div>
      </section>

      {/* ATS Checklist Section (SEO) */}
      <section className="py-16 md:py-24" aria-labelledby="tips-heading">
        <div className="container">
          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Content */}
            <div>
              <h2 id="tips-heading" className="text-balance mb-6 font-display text-display-sm text-foreground">
                ATS compatibility checklist
              </h2>
              <p className="mb-8 text-muted-foreground">
                Every resume built with BeatTheATS follows these ATS-safe guidelines that ensure your application gets
                past the robots and in front of real recruiters.
              </p>

              <ul className="space-y-4">
                {ATS_CHECKLIST.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                    </span>
                    <span className="text-foreground">{tip}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link
                  to="/start"
                  className="inline-flex items-center gap-2 font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  Build your ATS-optimized resume
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            {/* Testimonial card */}
            <div className="flex items-center">
              <blockquote className="rounded-lg border border-border bg-card p-8 shadow-sm">
                <p className="mb-6 text-lg leading-relaxed text-foreground">
                  &ldquo;I applied to 50+ jobs with my old resume and got zero responses. After rebuilding it with
                  BeatTheATS, I landed 5 interviews in the first week. The ATS was eating my applications.&rdquo;
                </p>
                <footer className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-display text-lg font-bold text-primary">
                    MR
                  </div>
                  <div>
                    <cite className="font-semibold not-italic text-foreground">Marcus R.</cite>
                    <p className="text-sm text-muted-foreground">Software Engineer</p>
                  </div>
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="border-t border-border bg-primary/5 py-16 md:py-24" aria-labelledby="cta-heading">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="cta-heading" className="text-balance mb-4 font-display text-display-md text-foreground">
              Ready to beat the ATS?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join thousands of job seekers who&apos;ve gotten past applicant tracking systems and landed interviews.
            </p>
            <Link
              to="/start"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-md bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
            >
              <Target className="h-5 w-5" />
              Build Your ATS-Ready Resume
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">Free to start • No credit card required</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-8">
        <div className="container">
          <div className="flex flex-col items-center gap-6 text-center md:grid md:grid-cols-3 md:text-left">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-primary">
                <Target className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-bold text-foreground">BeatTheATS</span>
            </div>

            {/* Navigation */}
            <nav aria-label="Footer navigation" className="order-3 md:order-2 md:justify-self-center">
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

            {/* Copyright */}
            <p className="order-2 text-sm text-muted-foreground md:order-3 md:justify-self-end">
              © {new Date().getFullYear()} BeatTheATS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}

HomePage.getLayout = getLandingLayout

export default HomePage
