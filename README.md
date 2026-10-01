# Famebros Studio

Production website codebase for **Famebros Studio**, a Mumbai social media and creative studio managing the Instagram feeds of leading brands.

## Tech Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Data-driven architecture (Server Components by default)

---

## How to Add a New Client

All client data is centralized in `src/data/clients.ts`. Adding a client requires only a single object entry in the `clients` array:

```typescript
// src/data/clients.ts
{
  id: 'unique-client-slug',
  handle: '@brandhandle',
  displayName: 'Brand Name',
  industry: 'jewellery', // 'jewellery' | 'fashion' | 'hospitality' | 'retail' | 'other'
  city: 'Mumbai',
  coverImage: '/images/clients/brand-cover.jpg',
  servicesWeRun: ['Reels Production', 'Community Management', 'Content Strategy'],
  hasPermission: true,  // Set to true once the brand grants public showcase rights
  isPlaceholder: false, // Set to false for real live clients
}
```

### Live Clients vs Placeholders
- **`isPlaceholder: true` & `hasPermission: false`**: Used for drafts and template demonstration.
- **`getLiveClients()`**: Filter helper that strictly returns clients where `hasPermission === true` and `isPlaceholder === false`.
- Any counter on the website (e.g. number of active partner brands) automatically derives its count from `getLiveClients().length`. Never hardcode client counts.
