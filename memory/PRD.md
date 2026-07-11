# NEXCARE — Product Requirements

## Problem Statement
Full-stack responsive healthcare consulting & hospital planning website with modern UI/UX, hero animation, text animation, glowing light, light/dark mode toggle, illustrations, HD images, reel-style effects, 3D animation, contact form (MongoDB + Resend), chatbot, brochure download, multiple pages.

## Implemented (2026-02)
- 9 pages: Home, Services, About, Vision, Projects, Blog, Career, Contact, Admin
- Three.js hero 3D wireframe sphere + particle field
- Light/Dark mode toggle (persisted) — brand-driven HSL tokens
- Tailwind + Shadcn components, Outfit + DM Sans fonts
- Reel-style horizontal Projects scroll, marquee, glowing blobs, grid-pattern
- Contact form → POST /api/contact → MongoDB + Resend email
- Admin: password-protected dashboard at /admin (table, filter, status update, delete, modal view)
- Brochure: server-side ReportLab PDF at /api/brochure
- Rule-based FAQ chatbot widget (floating)

## API Endpoints
- GET  /api/                            — health
- POST /api/contact                     — submit form (saves + emails)
- POST /api/admin/login                 — admin auth
- GET  /api/admin/contacts              — list (X-Admin-Token)
- DELETE /api/admin/contacts/{id}
- PATCH  /api/admin/contacts/{id}/status?status=new|read|replied|archived
- GET  /api/brochure                    — PDF download

## Backlog
- P1: Replace placeholder brochure with branded one
- P1: Real blog content + CMS
- P2: Career role detail/apply form
- P2: Multi-language (i18n)
- P2: Animated page transitions
