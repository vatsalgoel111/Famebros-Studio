import { siteConfig } from '@/data/site';

/**
 * Builds a universal WhatsApp click-to-chat URL with prefilled text.
 * Strictly adheres to design guidelines: no third-party branding colors.
 */
export function buildWhatsAppLink(message: string): string {
  const encoded = encodeURIComponent(message.trim());
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encoded}`;
}
