# BetMaster Pro — Web Panels

React + TypeScript (Vite) implementation of the Figma file
[Betting App](https://www.figma.com/design/DDn4Wt7skvLstgchpGybDV/Betting-App), built for the four
panel roles: **Super Admin, Franchise, Super Agent, Agent**.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production bundle
npm run lint
```

## Screens implemented

| Figma node | Screen | Where |
| --- | --- | --- |
| `119:64198` | Login with quick demo role login | [src/features/auth/](src/features/auth/) |
| `79:1537` | Admin dashboard (stats, charts, live matches, risk, tables, feed) | [src/features/dashboard/](src/features/dashboard/) |
| `79:3065` | Users list — stats, toolbar, table, pagination | [PeopleListPage.tsx](src/features/users/PeopleListPage.tsx) |
| `79:4484` | Add New User dialog | [AddUserModal.tsx](src/features/users/AddUserModal.tsx) |
| `79:6144`, `79:12933`, `79:8679`, `79:9518`, `79:10332`, `79:12074` | User detail drawer — all six tabs (Overview, Bets, Transactions, Kyc, Activity, Devices) | [UserDrawer.tsx](src/features/users/UserDrawer.tsx) |
| `111:3` | Franchise directory — stats, toolbar, record card grid | [FranchisePage.tsx](src/features/franchises/FranchisePage.tsx) |
| `101:2`, `101:803` | Create Franchise dialog (commission splits appear once a type is picked) | [CreateFranchiseModal.tsx](src/features/franchises/CreateFranchiseModal.tsx) |
| `114:13787`, `116:15541`, `116:16345`, `116:17152` | Franchise detail drawer — Overview, Super Agents, Wallet, Settings | [FranchiseDrawer.tsx](src/features/franchises/FranchiseDrawer.tsx) |
| `116:17943`, `116:18917`, `116:19859`, `116:20803`, `116:22685`, `116:23728`, `116:24739`, `116:25750` | Super agent drawer (from the franchise drawer *and* the super agent page) — Overview, Agents, Users, Performance | [SuperAgentDrawer.tsx](src/features/franchises/SuperAgentDrawer.tsx) |
| `112:698` | Super agent directory — stats, capability panel, table, highlight cards | [SuperAgentPage.tsx](src/features/superAgents/SuperAgentPage.tsx) |
| `116:21713` | Create Super Agent dialog | [CreateSuperAgentModal.tsx](src/features/superAgents/CreateSuperAgentModal.tsx) |
| `112:1579` | Agent directory — stats, filters, table, pagination | [AgentPage.tsx](src/features/agents/AgentPage.tsx) |
| `116:26729` | Create Agent dialog | [CreateAgentModal.tsx](src/features/agents/CreateAgentModal.tsx) |
| `116:27600`, `116:28563`, `116:29510`, `116:30416`, `116:31356`, `116:33379` | Agent drawer — Overview, Users, Wallet, Transactions, Reports, Activity | [AgentDrawer.tsx](src/features/agents/AgentDrawer.tsx) |
| `112:2359`, `117:34376` | Wallet console — stats, partner payments, quick actions, request tabs and the Payments tab | [WalletPage.tsx](src/features/wallet/WalletPage.tsx), [PaymentsTab.tsx](src/features/wallet/PaymentsTab.tsx) |
| `117:35363`, `119:36414`, `119:37465`, `119:38529` | Manual Credit / Debit / Transfer / Adjustment dialogs | [WalletActionModal.tsx](src/features/wallet/WalletActionModal.tsx) |
| `119:39582` | New Payment dialog | [NewPaymentModal.tsx](src/features/wallet/NewPaymentModal.tsx) |

Nav destinations with no design yet (Wallet, Betting, Events, Markets, Risk, Commission,
Partnership, Reports, Analytics, CMS, Notifications, Security, Settings, Profile) render a shared
stub from [PanelSection.tsx](src/features/panel/PanelSection.tsx) — drop their components there as
the designs land; the shell, routing and access rules already work.

## Demo logins

The "Quick Demo Login" chips fill these in for you.

| Role | User name | Password | Panel |
| --- | --- | --- | --- |
| Super Admin | `mithu8178` | `superadmin@123` | `/super-admin` |
| Franchise | `franchise01` | `franchise@123` | `/franchise` |
| Super Agent | `superagent01` | `superagent@123` | `/super-agent` |
| Agent | `agent01` | `agent@123` | `/agent` |

## How the four roles are wired

Everything role-specific lives in **one file**: [src/config/roles.ts](src/config/roles.ts).
A role declares its label, icon, operator, demo credentials, base path, who it manages, its
downline segment and its nav entries — and that single declaration drives:

- the Quick Demo Login grid and the `Sign In as …` button on the login screen,
- the router (`/super-admin`, `/franchise`, … and every child route),
- the access guard (a signed-in Agent cannot open `/franchise`),
- the sidebar rail, the identity chip, the topbar title and breadcrumb,
- which segments show the people list, and what the downline table is called.

There is no per-role component, page or route file. Adding a fifth role is a new entry in `ROLES`
plus its figures in the two data modules.

## Structure

```
src/
  styles/          tokens.css (every colour, radius and type step from Figma) + global.css
  lib/             cx (class joiner) + format (₹ / count formatting)
  components/
    icons/         61 glyphs generated from the Figma SVG exports via one createIcon() factory
    charts/        AreaChart, BarChart, DonutChart — plain SVG, no chart library
    ui/            Badge, BrandMark, Button, Card, Checkbox, DataTable, Dot, Drawer, IconButton,
                   MetricTile, Modal, Pagination, ProgressBar, SearchInput, SectionCard,
                   SectionLabel, SelectField, StatCard, Tabs, TextField
  config/          app.ts (product copy) + roles.ts (the four roles)
  features/
    auth/          AuthProvider, session context, LoginPage, RoleSelector
    dashboard/     DashboardView + widgets/ (chart, monitor and ledger panels) + dashboardData
    users/         PeopleListPage, AddUserModal, UserDrawer + usersData
    franchises/    FranchisePage, CreateFranchiseModal, FranchiseDrawer, SuperAgentDrawer,
                   NetworkRows (shared list/summary rows) + franchisesData
    superAgents/   SuperAgentPage, CreateSuperAgentModal + superAgentsData
    agents/        AgentPage, CreateAgentModal, AgentDrawer + agentsData
    wallet/        WalletPage, PaymentsTab, WalletActionModal, NewPaymentModal + walletData
    panel/         PanelSection — maps a nav entry to its view
  layouts/
    PanelLayout/   Sidebar, Topbar, StatusBar — one shell for all four panels
  routes/          AppRoutes — routes generated from ROLES
```

Rules that keep the code duplicate-free:

- **No raw hex in components.** Colours, radii and type steps come from `tokens.css`.
- **One component per idea.** Variants are props (`<Button variant="primary" />`,
  `<Tabs variant="underline" />`, `<DataTable size="sm" />`), never copies.
- **One icon factory.** Glyph geometry is verbatim from the Figma exports; only the stroke colour
  is `currentColor`, so the same component serves idle / active / on-gradient states.
- **One list screen.** `PeopleListPage` backs Users *and* the Franchise / Super Agent / Agent
  downline segments.
- **Data is separate from views.** `dashboardData.ts` and `usersData.ts` are the only places with
  figures — swap them for API calls without touching a component. Each panel sees the slice of the
  platform it owns, so the Super Admin numbers from Figma are scaled down the hierarchy rather than
  duplicated per role.

## Charts

The Figma frames embed Recharts renders. Those are reproduced as small SVG components
(`components/charts/`) driven by real data rather than pasted as exported images, so they respond
to the role's figures and to the Revenue / Wallet / Commission tab switch. Icons, by contrast, are
the exported Figma assets.
