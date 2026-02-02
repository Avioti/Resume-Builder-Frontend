import React, { useMemo } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router-dom'
import { createRouter } from './router'
import { ResumeProvider } from './lib/resume-context'

export default function App() {
  const queryClient = useMemo(() => new QueryClient({}), [])
  return (
    <QueryClientProvider client={queryClient}>
      <ResumeProvider>
        <RouterProvider router={createRouter()} />
      </ResumeProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}
