/** Product-level copy from the Figma header/footer — kept in one place. */
export const APP = {
  name: 'BetMaster Pro',
  shortName: 'BetMaster',
  initial: 'B',
  edition: 'Pro Admin v2.4',
  tagline: 'Enterprise Betting Platform · v2.4',
  legal: 'Protected by 256-bit SSL encryption · © 2024 BetMaster Pro',
  build: 'BetMaster Pro v2.4.1 · © 2024',
} as const;

/** Live-status figures shown in the topbar chip and the status bar. */
export const PLATFORM_STATUS = {
  liveMatches: 4,
  api: 'API Connected',
  db: 'DB: 24ms',
  cpu: 'CPU: 38%',
  uptime: 'Uptime: 99.9%',
} as const;
