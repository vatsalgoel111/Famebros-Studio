import { siteConfig, WALL_DRAFT_MODE } from '@/data/site';
import { clients } from '@/data/clients';
import { posts } from '@/data/posts';
import { caseStudies } from '@/data/caseStudies';
import { heroClips } from '@/data/hero';
import { crewMembers } from '@/data/crew';
import { proofItems } from '@/data/proof';
import { monthPlans } from '@/data/oneMonth';

export type IssueSeverity = 'error' | 'warning' | 'info';

export interface Issue {
  severity: IssueSeverity;
  section: string;
  id?: string;
  message: string;
}

/**
 * Pure function that scans all data files and returns content readiness issues.
 * Has no side effects.
 */
export function validateContent(): Issue[] {
  const issues: Issue[] = [];

  // Helper to push issue
  const report = (
    severity: IssueSeverity,
    section: string,
    message: string,
    id?: string
  ) => {
    issues.push({ severity, section, message, id });
  };

  // Helper to scan for unresolved "PLACEHOLDER" strings in non-placeholder objects
  const checkNoPlaceholderStrings = (
    obj: unknown,
    section: string,
    id?: string
  ) => {
    if (typeof obj === 'string') {
      if (obj.toLowerCase().includes('placeholder')) {
        report(
          'error',
          section,
          `Non-placeholder entry contains "PLACEHOLDER" text: "${obj.slice(0, 50)}"`,
          id
        );
      }
    } else if (Array.isArray(obj)) {
      for (const item of obj) {
        checkNoPlaceholderStrings(item, section, id);
      }
    } else if (obj !== null && typeof obj === 'object') {
      for (const [key, val] of Object.entries(obj)) {
        if (key === 'isPlaceholder') continue;
        checkNoPlaceholderStrings(val, section, id);
      }
    }
  };

  // Helper to scan for specific invented content in placeholder objects
  // Warns if any placeholder object's string fields exceed heuristic:
  // longer than 60 characters AND does not start with "PLACEHOLDER" (case-insensitive) AND object's isPlaceholder is true
  const checkNoInventedPlaceholderDetail = (
    obj: unknown,
    section: string,
    id?: string
  ) => {
    const scan = (val: unknown) => {
      if (typeof val === 'string') {
        const trimmed = val.trim();
        if (
          trimmed.length > 60 &&
          !trimmed.toLowerCase().startsWith('placeholder')
        ) {
          report(
            'warning',
            section,
            `Placeholder contains specific invented detail (>60 chars without "PLACEHOLDER" prefix): "${trimmed.slice(0, 50)}..."`,
            id
          );
        }
      } else if (Array.isArray(val)) {
        for (const item of val) {
          scan(item);
        }
      } else if (val !== null && typeof val === 'object') {
        for (const [key, propVal] of Object.entries(val as Record<string, unknown>)) {
          if (
            key === 'isPlaceholder' ||
            key === 'videoSrc' ||
            key === 'poster' ||
            key === 'photo' ||
            key === 'src' ||
            key === 'instagramUrl'
          ) {
            continue;
          }
          scan(propVal);
        }
      }
    };

    scan(obj);
  };

  // 1. SITE CONFIG RULES
  const phone = siteConfig.whatsappNumber || '';
  if (phone.toLowerCase().includes('x') || !/^\d+$/.test(phone)) {
    report(
      'error',
      'Site',
      `WhatsApp number contains placeholder characters or non-digits: "${phone}"`
    );
  }

  const email = siteConfig.email || '';
  if (
    !email ||
    email.toLowerCase().includes('placeholder') ||
    email.includes('example.com')
  ) {
    report('error', 'Site', `Email is a placeholder: "${email}"`);
  }

  // 2. CLIENTS RULES
  let liveClientsCount = 0;
  let clientPlaceholdersCount = 0;

  for (const client of clients) {
    const isLive = client.hasPermission && !client.isPlaceholder;

    if (isLive) {
      liveClientsCount++;

      if (!client.coverImage || client.coverImage.trim() === '') {
        report('error', 'Clients', 'Live client lacks coverImage', client.id);
      }
      if (!client.coverAlt || client.coverAlt.trim() === '') {
        report('error', 'Clients', 'Live client lacks coverAlt', client.id);
      }
      if (!client.industry) {
        report('error', 'Clients', 'Live client lacks industry', client.id);
      }
      if (!client.servicesWeRun || client.servicesWeRun.length === 0) {
        report(
          'error',
          'Clients',
          'Live client has empty servicesWeRun',
          client.id
        );
      }

      if (
        !client.handle.startsWith('@') ||
        client.handle.toLowerCase().includes('placeholder')
      ) {
        report(
          'error',
          'Clients',
          `Live client handle must start with "@" and not match placeholder: "${client.handle}"`,
          client.id
        );
      }

      // Global check for non-placeholder
      checkNoPlaceholderStrings(client, 'Clients', client.id);
    } else {
      clientPlaceholdersCount++;

      if (client.hasPermission && client.isPlaceholder) {
        report(
          'warning',
          'Clients',
          `Client hasPermission is true, but isPlaceholder is still true: "${client.handle}"`,
          client.id
        );
      }

      checkNoInventedPlaceholderDetail(client, 'Clients', client.id);
    }
  }

  report(
    'info',
    'Clients',
    `${liveClientsCount} live clients, ${clientPlaceholdersCount} placeholders remaining`
  );

  // 3. POSTS RULES
  const liveClientIds = new Set(
    clients
      .filter((c) => c.hasPermission && !c.isPlaceholder)
      .map((c) => c.id)
  );

  for (const post of posts) {
    const isRealPost = liveClientIds.has(post.clientId);

    if (isRealPost) {
      // Instagram URL format
      if (
        !post.instagramUrl ||
        !post.instagramUrl.startsWith('https://www.instagram.com/')
      ) {
        report(
          'error',
          'Posts',
          `Post instagramUrl must start with "https://www.instagram.com/": "${post.instagramUrl}"`,
          post.id
        );
      }

      // Poster & PosterAlt
      if (!post.poster || post.poster.trim() === '') {
        report('error', 'Posts', 'Real post is missing poster image', post.id);
      }
      if (!post.posterAlt || post.posterAlt.trim() === '') {
        report('error', 'Posts', 'Real post is missing posterAlt', post.id);
      }

      // Public Metric
      if (post.publicMetric) {
        const m = post.publicMetric;
        if (!m.label || m.label.trim() === '') {
          report('error', 'Posts', 'publicMetric missing label', post.id);
        }
        if (!m.value || m.value.trim() === '') {
          report('error', 'Posts', 'publicMetric missing value', post.id);
        }
        if (
          !m.verifiedOn ||
          !/^\d{4}-\d{2}-\d{2}$/.test(m.verifiedOn) ||
          isNaN(Date.parse(m.verifiedOn))
        ) {
          report(
            'error',
            'Posts',
            `publicMetric verifiedOn is not a valid YYYY-MM-DD date: "${m.verifiedOn}"`,
            post.id
          );
        } else {
          const ageDays =
            (Date.now() - Date.parse(m.verifiedOn)) / (1000 * 60 * 60 * 24);
          if (ageDays > 90) {
            report(
              'warning',
              'Posts',
              `publicMetric verifiedOn (${m.verifiedOn}) is older than 90 days (re-verify)`,
              post.id
            );
          }
        }
      }

      // Breakdown Markers
      if (post.breakdownMarkers) {
        const markers = post.breakdownMarkers;
        if (markers.length < 2) {
          report(
            'error',
            'Posts',
            'breakdownMarkers has fewer than 2 items',
            post.id
          );
        }
        for (let i = 0; i < markers.length; i++) {
          if (!markers[i].note || markers[i].note.trim() === '') {
            report(
              'error',
              'Posts',
              `Marker #${i + 1} (${markers[i].label}) has empty note`,
              post.id
            );
          }
          if (i > 0 && markers[i].time < markers[i - 1].time) {
            report(
              'error',
              'Posts',
              `breakdownMarkers are not sorted by time (marker #${i + 1} at ${markers[i].time}s is before #${i} at ${markers[i - 1].time}s)`,
              post.id
            );
          }
          if (
            post.durationSeconds !== undefined &&
            markers[i].time > post.durationSeconds
          ) {
            report(
              'error',
              'Posts',
              `Marker time (${markers[i].time}s) exceeds post durationSeconds (${post.durationSeconds}s)`,
              post.id
            );
          }
        }
      }

      // Video without durationSeconds
      if (post.videoSrc && post.durationSeconds === undefined) {
        report(
          'warning',
          'Posts',
          'Video post has videoSrc but durationSeconds is missing',
          post.id
        );
      }

      checkNoPlaceholderStrings(post, 'Posts', post.id);
    } else {
      checkNoInventedPlaceholderDetail(post, 'Posts', post.id);
    }
  }

  // 4. CASE STUDIES RULES
  let csPlaceholdersCount = 0;
  for (const cs of caseStudies) {
    if (!cs.isPlaceholder) {
      const referencedPost = posts.find((p) => p.id === cs.postId);
      if (!referencedPost) {
        report(
          'error',
          'Case Studies',
          `Referenced postId "${cs.postId}" does not exist`,
          cs.id
        );
      } else if (referencedPost.clientId !== cs.clientId) {
        report(
          'error',
          'Case Studies',
          `Referenced post's clientId ("${referencedPost.clientId}") does not match case study clientId ("${cs.clientId}")`,
          cs.id
        );
      }

      const client = clients.find((c) => c.id === cs.clientId);
      if (!client || !client.hasPermission || client.isPlaceholder) {
        report(
          'error',
          'Case Studies',
          `Client "${cs.clientId}" is not live for case study`,
          cs.id
        );
      }

      if (!cs.whatWeDid || cs.whatWeDid.length === 0 || cs.whatWeDid.some((s) => !s.trim())) {
        report('error', 'Case Studies', 'whatWeDid is empty or contains empty lines', cs.id);
      }
      if (!cs.whyItWorked || cs.whyItWorked.length === 0 || cs.whyItWorked.some((s) => !s.trim())) {
        report('error', 'Case Studies', 'whyItWorked is empty or contains empty lines', cs.id);
      }

      checkNoPlaceholderStrings(cs, 'Case Studies', cs.id);
    } else {
      csPlaceholdersCount++;
      checkNoInventedPlaceholderDetail(cs, 'Case Studies', cs.id);
    }
  }

  report(
    'info',
    'Case Studies',
    `${csPlaceholdersCount} placeholders remaining`
  );

  // 5. HERO RULES
  let heroPlaceholdersCount = 0;
  for (const clip of heroClips) {
    if (!clip.isPlaceholder) {
      if (!clip.videoSrc || clip.videoSrc.trim() === '') {
        report('error', 'Hero', 'Non-placeholder hero clip lacks videoSrc', clip.id);
      }
      if (!clip.poster || clip.poster.trim() === '') {
        report('error', 'Hero', 'Non-placeholder hero clip lacks poster', clip.id);
      }
      if (!clip.posterAlt || clip.posterAlt.trim() === '') {
        report('error', 'Hero', 'Non-placeholder hero clip lacks posterAlt', clip.id);
      }

      checkNoPlaceholderStrings(clip, 'Hero', clip.id);
    } else {
      heroPlaceholdersCount++;
      checkNoInventedPlaceholderDetail(clip, 'Hero', clip.id);
    }
  }

  report('info', 'Hero', `${heroPlaceholdersCount} placeholders remaining`);

  // 6. CREW RULES
  let crewPlaceholdersCount = 0;
  for (const member of crewMembers) {
    if (!member.isPlaceholder) {
      if (!member.name || member.name.trim() === '') {
        report('error', 'Crew', 'Non-placeholder crew member lacks name', member.id);
      }
      if (!member.role || member.role.trim() === '') {
        report('error', 'Crew', 'Non-placeholder crew member lacks role', member.id);
      }
      if (!member.photo || member.photo.trim() === '') {
        report('error', 'Crew', 'Non-placeholder crew member lacks photo', member.id);
      }
      if (!member.photoAlt || member.photoAlt.trim() === '') {
        report('error', 'Crew', 'Non-placeholder crew member lacks photoAlt', member.id);
      }

      checkNoPlaceholderStrings(member, 'Crew', member.id);
    } else {
      crewPlaceholdersCount++;
      checkNoInventedPlaceholderDetail(member, 'Crew', member.id);
    }
  }

  report('info', 'Crew', `${crewPlaceholdersCount} placeholders remaining`);

  // 7. PROOF RULES
  let proofPlaceholdersCount = 0;
  for (const proof of proofItems) {
    if (!proof.isPlaceholder) {
      if (proof.hasPermission !== true) {
        report(
          'error',
          'Proof',
          'Non-placeholder proof item does not have hasPermission set to true',
          proof.id
        );
      }

      const hasScreenshot = Boolean(
        proof.screenshot && proof.screenshot.src && proof.screenshot.alt
      );
      const hasMessages = Array.isArray(proof.messages) && proof.messages.length > 0;

      if (!hasScreenshot && !hasMessages) {
        report(
          'error',
          'Proof',
          'Non-placeholder proof item has neither a screenshot (with alt) nor messages',
          proof.id
        );
      }

      checkNoPlaceholderStrings(proof, 'Proof', proof.id);
    } else {
      proofPlaceholdersCount++;
      checkNoInventedPlaceholderDetail(proof, 'Proof', proof.id);
    }
  }

  report('info', 'Proof', `${proofPlaceholdersCount} placeholders remaining`);

  // 8. ONE MONTH RULES
  let planPlaceholdersCount = 0;
  for (const plan of monthPlans) {
    if (!plan.isPlaceholder) {
      for (const day of plan.days) {
        for (const item of day.items) {
          const why = item.why;
          if (
            !why ||
            !why.hook?.trim() ||
            !why.audience?.trim() ||
            !why.format?.trim() ||
            !why.cta?.trim()
          ) {
            report(
              'error',
              'One Month',
              `Day ${day.date} item "${item.title}" has empty hook, audience, format or cta`,
              plan.clientId
            );
          }
          if (item.postId && !posts.some((p) => p.id === item.postId)) {
            report(
              'error',
              'One Month',
              `Day ${day.date} references missing postId "${item.postId}"`,
              plan.clientId
            );
          }
        }
      }

      checkNoPlaceholderStrings(plan, 'One Month', plan.clientId);
    } else {
      planPlaceholdersCount++;
      checkNoInventedPlaceholderDetail(plan, 'One Month', plan.clientId);
    }
  }

  report(
    'info',
    'One Month',
    `${planPlaceholdersCount} placeholders remaining`
  );

  // 9. WALL DRAFT MODE RULE
  if (WALL_DRAFT_MODE) {
    report(
      'error',
      'Wall',
      'WALL_DRAFT_MODE is on: unpermitted clients are visible. Set it to false before launch.'
    );
  }

  return issues;
}
