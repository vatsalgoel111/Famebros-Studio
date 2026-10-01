# UI Components & Primitives

All UI components and primitives for Famebros Studio reside in this directory:

## Primitives
- **`Container`**: Max-width 1360px container with responsive 16/32/48px horizontal padding.
- **`Section`**: Semantic wrapper with 64px mobile / 128px desktop vertical padding, and optional `dark` variant (`#0E0E0E` canvas).
- **`SectionLabel`**: Small uppercase tracking label with short hairline (e.g. `01 / The Wall`).
- **`CreditPill`**: Black-on-signal-yellow fully rounded pill (`Managed by Famebros` or `Managed by @handle`).
- **`Highlight`**: Inline text highlighter with signal-yellow background and ink text.
- **`Button`**: `primary` (ink on paper), `secondary` (transparent with ink border), and `onDark` (paper on ink) variants with animated arrow nudging.
- **`Chip`**: Sharp filter chip with 44px min height for touch targets.
- **`PlaceholderTile`**: CSS-only diagonal hatched diagnostic tile for `9:16`, `4:5`, `1:1`, and `3:4` aspect ratios.
- **`Hairline`**: Crisp 1px horizontal separator line.

## Shell Components
- **`Header`**: Sticky header with wordmark, desktop nav links, WhatsApp action, and keyboard-accessible mobile menu.
- **`Footer`**: Minimal dark footer with studio location, social handle, and ownership statement.
- **`MobileBottomBar`**: Fixed bottom bar on screens <768px with WhatsApp and The Wall buttons respecting safe-area-insets.

## Rules
- Keep every component in its own file.
- Default to Server Components. Only add `'use client'` if interactive state or DOM events are required.
- Sharp corners (0 border radius) everywhere except `CreditPill`.
- Zero shadows, zero gradients, zero glassmorphism.

