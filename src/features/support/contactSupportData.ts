export type SupportChannel = {
  /** Drawn as an emoji glyph in the design, not an exported icon. */
  emoji: string;
  title: string;
  /** The number, handle or address people reach the channel on. */
  handle: string;
  note: string;
  /** rgb triplet the card, tile and action are tinted with. */
  rgb: string;
  action?: string;
  /** Where the action button goes: tel:, WhatsApp, Telegram or mailto:. */
  href?: string;
};

export type SupportWindow = { day: string; hours: string; open: boolean };

/** Contact Support — node 139:90076. */
export const SUPPORT_INTRO = {
  emoji: '🎧',
  title: 'Contact Support',
  subtitle:
    'Our dedicated support team is available to help you. Reach us through any of the channels below.',
};

export const SUPPORT_CHANNELS: SupportChannel[] = [
  {
    emoji: '📞',
    title: 'Call Support',
    handle: '+91 98765 00000',
    note: 'Mon–Sat, 9 AM – 9 PM IST',
    rgb: '34, 197, 94',
    action: 'Call Now',
    href: 'tel:+919876500000',
  },
  {
    emoji: '💬',
    title: 'WhatsApp',
    handle: '+91 98765 00001',
    note: 'Chat instantly on WhatsApp',
    rgb: '37, 211, 102',
    action: 'Open WhatsApp',
    href: 'https://wa.me/919876500001',
  },
  {
    emoji: '✈️',
    title: 'Telegram',
    handle: '@betmaster_support',
    note: 'Fast responses via Telegram',
    rgb: '41, 182, 246',
    action: 'Open Telegram',
    href: 'https://t.me/betmaster_support',
  },
  {
    emoji: '✉️',
    title: 'Email Support',
    handle: 'support@betmaster.com',
    note: 'Response within 2–4 hours',
    rgb: '250, 204, 21',
    action: 'Send Email',
    href: 'mailto:support@betmaster.com',
  },
];

export const SUPPORT_WINDOWS: SupportWindow[] = [
  { day: 'Monday – Friday', hours: '9:00 AM – 10:00 PM', open: true },
  { day: 'Saturday', hours: '9:00 AM – 9:00 PM', open: true },
  { day: 'Sunday', hours: '10:00 AM – 6:00 PM', open: true },
  { day: 'Public Holidays', hours: 'WhatsApp & Telegram only', open: false },
];
