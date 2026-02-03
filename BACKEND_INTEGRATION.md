# BeatTheATS Backend Integration Guide

This document outlines all the integration points where the BeatTheATS frontend expects to communicate with a backend API.

## Overview

The frontend is designed as a **standalone SPA** that can work entirely offline (localStorage-based) but is architected to easily integrate with a backend for:

- User authentication
- Resume data persistence
- PDF generation
- Analytics

---

## Integration Points

### 1. Resume Data Persistence

**Current State**: Uses React Context + localStorage (see `src/lib/resume-context.tsx`)

**Backend Integration**:

```typescript
// API Endpoints needed:
POST   /api/resumes              // Create new resume
GET    /api/resumes              // List user's resumes
GET    /api/resumes/:id          // Get specific resume
PUT    /api/resumes/:id          // Update resume
DELETE /api/resumes/:id          // Delete resume

// Data shape (matches ResumeData interface):
interface ResumePayload {
  personal: {
    fullName: string
    jobTitle: string
    email: string
    phone: string
    location: string
    summary: string
  }
  experiences: Array<{
    id: string
    company: string
    position: string
    startDate: string  // YYYY-MM format
    endDate: string
    current: boolean
    description: string
  }>
  education: Array<{
    id: string
    institution: string
    degree: string
    field: string
    startDate: string
    endDate: string
    description: string
  }>
  skills: string[]
}
```

**Integration Location**: `src/lib/resume-context.tsx`

- Add API calls in the reducer or create a separate `useResumeApi` hook
- Implement optimistic updates with rollback on failure

---

### 2. User Authentication

**Current State**: Mock signup form at `/signup` (see `src/pages/signup/index.tsx`)

**Backend Integration**:

```typescript
// API Endpoints needed:
POST /api/auth/signup           // Create account
POST /api/auth/login            // Login (email/password)
POST /api/auth/logout           // Logout
GET  /api/auth/me               // Get current user
POST /api/auth/forgot-password  // Password reset request
POST /api/auth/reset-password   // Complete password reset

// OAuth (optional):
GET  /api/auth/google           // Google OAuth redirect
GET  /api/auth/google/callback  // OAuth callback

// Response shape:
interface AuthResponse {
  user: {
    id: string
    email: string
    name?: string
    createdAt: string
  }
  token: string  // JWT or session token
}
```

**Integration Location**:

- Create `src/lib/auth-context.tsx` for auth state
- Update `src/pages/signup/index.tsx` with real form submission
- Add protected route wrapper in `src/router.tsx`

---

### 3. PDF Generation

**Current State**: Uses browser print dialog (`window.print()`)

**Backend Integration** (recommended for better PDF quality):

```typescript
// API Endpoint:
POST /api/resumes/:id/pdf

// Request:
{
  format: 'A4' | 'Letter',
  includePhoto?: boolean
}

// Response:
// Returns PDF binary with Content-Type: application/pdf
// Or returns a signed URL to download from S3/storage
```

**Alternative**: Use client-side libraries:

- `html2pdf.js` - Quick setup, variable quality
- `react-pdf` - More control, larger bundle
- `puppeteer` (server-side) - Best quality, requires backend

**Integration Location**: `src/pages/preview/index.tsx` - `handleDownload` function

---

### 4. Resume Sharing

**Current State**: Copies current URL to clipboard

**Backend Integration**:

```typescript
// API Endpoints:
POST /api/resumes/:id/share     // Generate shareable link
GET  /api/shared/:token         // Get shared resume (public)

// Request:
{
  expiresIn?: number,  // Hours until expiry (optional)
  password?: string    // Password protection (optional)
}

// Response:
{
  shareUrl: string,    // e.g., https://beattheats.com/r/abc123
  token: string,
  expiresAt?: string
}
```

**Integration Location**: `src/pages/preview/index.tsx` - `handleCopyLink` function

---

### 5. Analytics (Optional)

**Recommended Events**:

```typescript
// Track these user actions:
track('resume_started')
track('section_completed', { section: 'personal' | 'experience' | 'education' | 'skills' })
track('resume_completed')
track('pdf_downloaded')
track('resume_shared')
track('signup_started')
track('signup_completed')
```

**Integration**:

- Use Segment, Mixpanel, PostHog, or Plausible
- Create `src/lib/analytics.ts` wrapper
- Call from relevant components

---

## Environment Variables

Create a `.env` file (not committed) with:

```env
# API
VITE_API_URL=https://api.beattheats.com
VITE_API_TIMEOUT=30000

# Auth (if using OAuth)
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# Analytics (optional)
VITE_SEGMENT_WRITE_KEY=your-segment-key
VITE_POSTHOG_KEY=your-posthog-key

# Feature flags
VITE_ENABLE_SHARING=true
VITE_ENABLE_ANALYTICS=true
```

Access in code via:

```typescript
const apiUrl = import.meta.env.VITE_API_URL
```

---

## Recommended Backend Stack

For a backend that pairs well with this frontend:

1. **Node.js + Express/Fastify** - JavaScript consistency
2. **PostgreSQL** - Reliable, great for structured data
3. **Prisma** - Type-safe ORM
4. **JWT** - Stateless auth
5. **AWS S3 / Cloudflare R2** - PDF storage
6. **Puppeteer / Playwright** - PDF generation

### Minimal Schema for PostgreSQL

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) DEFAULT 'Untitled Resume',
  data JSONB NOT NULL,  -- Store ResumeData as JSON
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE shared_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
  token VARCHAR(64) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  expires_at TIMESTAMP,
  view_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Migration Strategy

1. **Phase 1**: Keep localStorage, add optional account creation
2. **Phase 2**: Sync localStorage data to backend on signup
3. **Phase 3**: Default to backend storage, localStorage as offline fallback
4. **Phase 4**: Add sharing, PDF generation, analytics

---

## API Client Setup

Recommended structure:

```typescript
// src/lib/api.ts
import { ResumeData } from './resume-context'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

class ApiClient {
  private token: string | null = null

  setToken(token: string | null) {
    this.token = token
  }

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options?.headers,
      },
    })

    if (!response.ok) {
      throw new ApiError(response.status, await response.text())
    }

    return response.json()
  }

  // Resume methods
  async createResume(data: ResumeData) {
    return this.request<{ id: string }>('/api/resumes', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateResume(id: string, data: ResumeData) {
    return this.request<void>(`/api/resumes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // ... other methods
}

export const api = new ApiClient()
```

---

## Questions?

This frontend is designed to be backend-agnostic. The integration points above are suggestions based on common patterns. Adapt as needed for your specific backend architecture.
