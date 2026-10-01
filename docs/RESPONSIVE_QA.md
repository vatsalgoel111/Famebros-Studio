# Responsive & Mobile QA Checklist

This document details the responsive testing matrix, mobile optimizations, and verification guidelines for the Famebros Studio web application across multiple viewport scales and environmental constraints.

---

## 1. Viewport Testing Matrix

| Width | Category | Key Layout Behavior & Validated Breakpoints |
|---|---|---|
| **320px** | Ultra-compact phone | 2-column Wall grid; 44x44px touch targets; no horizontal body scroll. |
| **360px** | Standard small phone | 3-column Wall grid; calendar day cells maintain 44x44px target with 8px touch separation. |
| **390px** | Modern standard phone (iPhone 12/13/14/15) | Single-column Hero with constrained 9:16 reel frame; inline OneMonth schedule dossier. |
| **430px** | Large phone (Pro Max / Plus) | Ample typography breathing room; fluid headings via `clamp()`. |
| **768px** | Tablet portrait (`md:`) | Two-column Hero; two-column Breakdown studio (sticky reel); side-by-side OneMonth calendar; 4-column Crew portraits. |
| **1024px** | Tablet landscape / Laptop (`lg:`) | 6-column Wall grid; wider 400px sticky Breakdown reel; full desktop navigation. |
| **1280px** | Desktop standard (`xl:`) | Full-bleed section containers with maximum inner bound of 1360px. |
| **1440px** | Large Desktop | 8-column Wall grid; high density client gallery. |
| **1920px** | Ultra-wide workstation | Clean centering; no awkward content stretching; backgrounds maintain full bleed. |
| **844 x 390px** | Landscape phone | Hero frame constrained to 240px max height (`[@media(max-height:500px)]`); headline and CTA buttons immediately accessible without scrolling. |

---

## 2. Production Checklist Verification

- [x] **1. No Horizontal Page Scroll**: `overflow-x` strictly contained. Only intentional horizontal scrollers (Wall industry chip filter, Crew BTS strip) scroll horizontally within isolated containers.
- [x] **2. Viewport Units & Landscape Mode**: Replaced all legacy `vh` with dynamic `dvh`/`svh`. In landscape phone mode (height ≤ 500px), Hero automatically unclamps full-height container and constrains reel frame to 240px, ensuring headline and actions remain immediately reachable.
- [x] **3. Safe Area Insets**: `env(safe-area-inset-*)` respected across Header, Mobile Bottom Bar, Client Panel drawer, Mobile Menu modal, and Footer (including landscape left/right safe padding).
- [x] **4. 44x44px Touch Targets**: Interactive targets (Chips, Wall tiles, Calendar days, Scrubber marker ticks, Accordion rows, Close triggers, and Form fields) meet or exceed 44x44px with ≥8px separation.
- [x] **5. Text Hygiene & Wrapping**: Body text never renders below 16px on mobile viewports. Form inputs have minimum 16px text to prevent automatic iOS zoom. Headings utilize `text-wrap: balance`. Handles use `overflow-wrap: anywhere` (`[data-handle]`). No text containers use fixed height that risks clipping under system font scaling.
- [x] **6. Zoom & Text Scaling**: Survives 200% browser zoom and large system font scaling. Viewport meta maintains unrestricted pinch zoom (`viewportFit: 'cover'`, no `user-scalable=no`).
- [x] **7. Mobile Bottom Bar vs Form/Keyboard**: Fixed mobile bottom bar automatically hides whenever any input or textarea gains focus, and hides while `#your-tile` inquiry section is in view. `html` defines `scroll-padding-bottom` so focused inputs are never covered.
- [x] **8. Sticky Chip Row vs Auto-Hiding Header**: Synchronized `--header-offset` CSS variable dynamically reflects header height (64px when visible, 0px when hidden on scroll down). Wall filter row sticks smoothly to top of viewport regardless of scroll direction.
- [x] **9. Hover on Touch**: Tappable elements feature `touch-action: manipulation` and `-webkit-tap-highlight-color: transparent`. Non-sticky hover behavior ensured.
- [x] **10. Overscroll Containment & iOS Scroll Lock**: `overscroll-behavior: contain` applied to Client Panel drawer, Mobile Menu, and horizontal strips. Body scroll lock utilizes fixed positioning with scroll offset restoration to prevent iOS background scrolling and page jumping.
- [x] **11. Breakpoint Architecture**:
  - Wall: 2 cols (<360px), 3 cols (360px+), 4 cols (640px+), 6 cols (1024px+), 8 cols (1440px+).
  - Breakdown: 2 cols from 768px (`md:`) with 320px sticky reel; 400px sticky reel from 1024px (`lg:`).
  - One Month: Calendar and Day Dossier side-by-side from 768px (`md:`).
  - Crew: 2 cols on mobile, 4 cols from 768px (`md:`).
- [x] **12. Image Aspect Ratios & Layout Shift**: Reserved aspect ratios on all visual media (9:16, 4:5, 4:3, 3:4, 1:1). `sizes` attributes tuned to actual rendered layout widths at every breakpoint.
- [x] **13. Video on Mobile**: `playsInline` and `muted` configured; no background autoplay outside the Hero reel preview; zero dependence on hover state.
- [x] **14. Form Accessibility**: Form fields provide explicit autocomplete attributes, `type`, visible inline error feedback, and unobstructed WhatsApp dispatch button above keyboard.

---

## 3. How to Test on a Real Mobile Device

1. **Open the Site on a Smartphone**:
   - Access the preview URL in Mobile Safari (iOS) and Mobile Chrome (Android).
   - Verify that there is zero horizontal side-scrolling on the body.

2. **Rotate to Landscape (e.g. 844 x 390px)**:
   - Rotate the device horizontally.
   - Verify that the Hero headline, reel viewer, and CTA buttons are simultaneously visible on screen without requiring vertical scroll to find the action button.
   - Confirm safe areas (`env(safe-area-inset-left)` and `env(safe-area-inset-right)`) prevent the camera notch or island from obscuring navigation or text.

3. **Increase System Font Size (Dynamic Type / Accessibility)**:
   - In device settings, increase font size to maximum (or 200% zoom in browser).
   - Inspect caption rotation in Hero, calendar day labels, and accordion rows to ensure text wraps naturally without clipping.

4. **Turn on "Reduce Motion"**:
   - In device Accessibility settings, toggle on *Reduce Motion*.
   - Verify all transitions and reveals render immediately (no 400ms delay, no scale transforms).

5. **Test Form with Virtual Keyboard**:
   - Scroll down to Section 07 (*Your Feed*).
   - Tap into "Your name" and "Brand name" fields.
   - Verify the browser does NOT zoom in automatically (16px base font prevents iOS auto-zoom).
   - Observe that the fixed mobile bottom bar automatically slides out of view while the keyboard is active, keeping inputs unobstructed.
