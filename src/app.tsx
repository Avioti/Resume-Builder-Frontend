import React, { useMemo } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router-dom'
import { createRouter } from './router'
import { ExtendedResumeProvider } from './lib/extended-resume-context'
import { TemplateProvider } from './lib/template-context'

export default function App() {
  const queryClient = useMemo(() => new QueryClient({}), [])
  return (
    <QueryClientProvider client={queryClient}>
      <ExtendedResumeProvider>
        <TemplateProvider>
          <RouterProvider router={createRouter()} />
        </TemplateProvider>
      </ExtendedResumeProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}
