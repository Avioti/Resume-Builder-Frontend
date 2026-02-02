import React from 'react'
import { Header } from '../header'

/**
 * No layout wrapper - for pages that handle their own layout
 */
export const getNoneLayout = (page: React.ReactElement) => page

/**
 * Default layout with header - for most pages
 */
export const getDefaultLayout = (page: React.ReactElement) => {
  return (
    <div className="relative min-h-screen">
      <Header />
      <main className="pt-16">{page}</main>
    </div>
  )
}

/**
 * Landing layout - transparent header, no padding
 */
export const getLandingLayout = (page: React.ReactElement) => {
  return (
    <div className="relative min-h-screen">
      <Header />
      {page}
    </div>
  )
}

/**
 * Builder layout - for the resume editor with split view
 */
export const getBuilderLayout = (page: React.ReactElement) => {
  return (
    <div className="relative min-h-screen bg-muted/30">
      <Header />
      <main className="pt-16">{page}</main>
    </div>
  )
}
