# Famebros Studio — Production Launch Checklist

This checklist must be fully reviewed and executed prior to directing live domain traffic to the Famebros Studio production deployment.

---

## 1. Domain & Environment Configuration
- [ ] **Set Production URL**:
  - Set `NEXT_PUBLIC_SITE_URL` in production environment variables to the live canonical domain (e.g. `https://famebrosstudio.com`).
  - Default placeholder is `"https://example.com"`.
- [ ] **Optional Media CDN**:
  - If hosting heavy media assets on an external S3/CloudFront/Cloudflare R2 bucket, configure `NEXT_PUBLIC_MEDIA_HOST` (e.g. `https://cdn.famebrosstudio.com`).

---

## 2. Branding & Visual Meta Assets
- [ ] **OpenGraph Share Image (`/og-image.jpg`)**:
  - Provide a dedicated, high-contrast **1200 × 630 px** JPEG/PNG graphic saved to `public/og-image.jpg`.
  - Preview card appearance using Facebook Sharing Debugger, Twitter Card Validator, and LinkedIn Post Inspector.
- [ ] **Browser Icons**:
  - Add production `public/favicon.ico` (multi-resolution 16×16, 32×32, 48×48).
  - Add production `public/icon.png` (512×512 PNG, square, with transparent or studio background for Apple touch icon and PWA).

---

## 3. Copy & Metadata Sign-Off
- [ ] **Title & Description Approval**:
  - Confirm page title (`Famebros Studio — Mumbai creative studio`) and meta description wording with Famebros founders:
    > *"Famebros Studio runs the Instagram presence of creators and brands in Mumbai — shoots, edits, and social management."*
- [ ] **Structured Data (Schema.org)**:
  - Verify `LocalBusiness` JSON-LD output in Google's Rich Results Test tool.

---

## 4. Feature Toggles & Verification (`src/data/site.ts`)
- [ ] **Disable Draft Mode**:
  - Set `WALL_DRAFT_MODE = false` in `src/data/site.ts`. Only clients explicitly flagged with `hasPermission: true` will appear on the public feed wall.
- [ ] **Disable Content Status Badge**:
  - Set `SHOW_CONTENT_STATUS = false` in `src/data/site.ts`. Hides the floating readiness debugger panel from public visitors.
- [ ] **Disable Style Guide**:
  - Ensure `SHOW_STYLEGUIDE = false` in `src/data/site.ts`.

---

## 5. Analytics & Observability
- [ ] **Review Analytics**:
  - Review `ANALYTICS_ENABLED` in `src/data/site.ts`.
  - If user journey tracking is desired, set `ANALYTICS_ENABLED = true` and connect a privacy-first analytics provider (e.g. Plausible, Fathom, PostHog, or Google Tag Manager) within `src/lib/analytics.ts`.
  - Pre-wired events include:
    - `whatsapp_click` (`source: 'hero' | 'header' | 'bottom_bar' | 'your_tile_form' | 'breakdown'`)
    - `wall_tile_open` (`client: handle`)
    - `breakdown_case_switch` (`caseIndex: string`)

---

## 6. Post-Deploy Routing Verification
- [ ] **Sitemap Resolution**:
  - Verify `https://<domain>/sitemap.xml` returns valid XML referencing the homepage with priority 1.0.
- [ ] **Robots.txt Resolution**:
  - Verify `https://<domain>/robots.txt` returns `User-agent: * Allow: /` with the sitemap location.
- [ ] **Security & Cache Headers**:
  - Confirm HTTPS enforcement, HTTP/2 or HTTP/3, and AVIF/WebP image compression delivery.
