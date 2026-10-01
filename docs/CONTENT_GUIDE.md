# Famebros Studio Content Pipeline Guide

This guide specifies asset production standards, file naming rules, client permission protocols, and launch readiness verification for Famebros Studio.

---

## 1. Asset Specifications Matrix

Every media asset must strictly follow the dimensions, formats, and file size ceilings listed below to maintain instant page loads and zero layout shift.

| Asset Type | Aspect Ratio | Dimensions | Format & Codec | Size Limit | Notes |
|---|---|---|---|---|---|
| **Wall Cover** | 3:4 | 720 × 960 px | WebP | < 120 KB | High-contrast visual representing the feed aesthetic. |
| **Hero Clip** | 9:16 | 720 × 1280 px | MP4 (H.264 / AAC) | < 2 MB | 3 to 6 seconds duration. **No audio track**. Loopable motion. |
| **Hero Poster** | 9:16 | 720 × 1280 px | WebP | < 150 KB | First-frame preview loaded prior to video playback. |
| **Case-Study Reel** | 9:16 | 720 × 1280 px | MP4 (H.264 / AAC) | < 8 MB | 15 to 30 seconds duration. **`+faststart` (moov atom at front)** enabled. |
| **Case-Study Poster** | 9:16 | 720 × 1280 px | WebP | < 150 KB | Fallback and scrub poster image. |
| **Crew Portrait** | 4:5 | 1000 × 1250 px | WebP | < 150 KB | High-key, natural portrait of the crew member. |
| **Behind The Scenes (BTS)** | 4:3 | 1200 × 900 px | WebP | < 150 KB | On-set production snapshots. |
| **Proof Screenshot** | Varied | Min 800 px wide | WebP or PNG | < 250 KB | **Crop out phone numbers, addresses, and private personal details**. |

### FFmpeg Encoding Reference

- **Hero Clip (Muted, Under 2MB)**:
  ```bash
  ffmpeg -i input.mov -an -c:v libx264 -pix_fmt yuv420p -crf 24 -vf "scale=720:1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2" -movflags +faststart hero_clip.mp4
  ```

- **Case-Study Reel (Faststart, Web-Optimized)**:
  ```bash
  ffmpeg -i input.mov -c:v libx264 -pix_fmt yuv420p -crf 23 -c:a aac -b:a 128k -movflags +faststart reel.mp4
  ```

---

## 2. Directory & File Naming Conventions

All media files live in `public/media/` (or on a CDN host defined via `NEXT_PUBLIC_MEDIA_HOST`). Paths in data files are resolved automatically via `src/lib/media.ts`.

```
public/media/
├── clients/
│   └── {handle-without-@}/
│       └── cover.webp               # e.g. public/media/clients/ananyajewels/cover.webp
├── hero/
│   ├── clip_01.mp4
│   └── poster_01.webp
├── posts/
│   └── {post-id}/
│       ├── video.mp4                # e.g. public/media/posts/post-ananya-01/video.mp4
│       └── poster.webp              # e.g. public/media/posts/post-ananya-01/poster.webp
├── crew/
│   └── {name-lowercase}.webp        # e.g. public/media/crew/aryan.webp
├── bts/
│   └── bts_{number}.webp            # e.g. public/media/bts/bts_01.webp
└── proof/
    └── {proof-id}.webp              # e.g. public/media/proof/proof_01.webp
```

---

## 3. Client Permission Checklist

Before any client tile, case study, or post is marked `hasPermission: true` and `isPlaceholder: false`:

- [ ] **Written Feed Permission**: Confirmed written authorization from the brand owner/founder to showcase their feed and creative assets on the agency site (a dated WhatsApp conversation or email thread counts; keep an archival screenshot in agency records).
- [ ] **Testimonial Clearance**: Explicit agreement from the founder/client for their quote or chat message to be publicly displayed.
- [ ] **Model & Talent Consent**: Verified talent/model release for any identifiable faces featured in the promotional reels and cover imagery.
- [ ] **Audio Licensing**: Ensure any reel published with audible sound uses licensed or royalty-free audio tracks; otherwise, enforce `isMuted` and strip audio from the file.

---

## 4. Pre-Launch Verification Checklist

Before publishing to production or toggling off preview flags:

1. **Content Status Dossier**:
   - Open the **Content Pipeline** panel in the top-right of the site.
   - Confirm **0 errors** remain across all sections (Site, Clients, Posts, Case Studies, Hero, Crew, Proof, One Month).
2. **Toggle Off Pipeline Status Panel**:
   - In `src/data/site.ts`, set:
     ```ts
     export const SHOW_CONTENT_STATUS = false;
     ```
3. **Toggle Off Wall Draft Mode**:
   - In `src/data/site.ts`, set:
     ```ts
     export const WALL_DRAFT_MODE = false;
     ```
4. **Environment & SEO Pre-Launch Configuration**:
   - Set `NEXT_PUBLIC_SITE_URL` to the real domain in environment variables.
   - Add real `favicon.ico`, `icon.png`, and a real 1200x630 `og-image.jpg` in `/public`.
   - Confirm metadata title/description wording with Famebros.
   - Verify `/sitemap.xml` and `/robots.txt` resolve correctly after deploy.
   - Decide whether to set `ANALYTICS_ENABLED = true` in `src/data/site.ts` and wire a provider.
   - Refer to `docs/LAUNCH_CHECKLIST.md` for the full deployment checklist.
5. **Re-Verify Public Metrics**:
   - Cross-check every metric (`label`, `value`, `verifiedOn`) against live Instagram post analytics.
   - Ensure none of the verification timestamps are older than 90 days.
6. **Alt Text Audit**:
   - Verify every non-placeholder image has descriptive, contextual `coverAlt`, `posterAlt`, or `photoAlt` attributes configured in data files.
