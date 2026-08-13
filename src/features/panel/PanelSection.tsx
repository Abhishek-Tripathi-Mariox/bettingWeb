import { SectionCard } from '../../components/ui/SectionCard/SectionCard';
import { getRole } from '../../config/roles';
import type { NavItem } from '../../config/roles';
import { useAuth } from '../auth/authContext';
import { DashboardView } from '../dashboard/DashboardView';
import { AgentPage } from '../agents/AgentPage';
import { FranchisePage } from '../franchises/FranchisePage';
import { SuperAgentPage } from '../superAgents/SuperAgentPage';
import { WalletPage } from '../wallet/WalletPage';
import { PeopleListPage } from '../users/PeopleListPage';
import styles from './PanelSection.module.css';

/** Segments that render the people list: platform users and the downline. */
const PEOPLE_SEGMENTS = new Set(['users']);

/**
 * Renders one nav destination for whichever role is signed in. Sections
 * without a design yet share a single stub, so adding one later is a new
 * branch here and nothing else.
 */
export function PanelSection({ item }: { item: NavItem }) {
  const { user } = useAuth();
  const role = getRole(user!.roleId);

  if (item.segment === '') return <DashboardView role={role} />;

  if (item.segment === 'franchise') return <FranchisePage role={role} />;

  if (item.segment === 'super-agent') return <SuperAgentPage role={role} />;

  if (item.segment === 'agent') return <AgentPage role={role} />;

  if (item.segment === 'wallet') return <WalletPage />;

  if (PEOPLE_SEGMENTS.has(item.segment)) {
    return <PeopleListPage role={role} segment={item.segment} title={item.label} />;
  }

  return (
    <SectionCard title={item.label} subtitle={`${role.label} · ${item.label}`} size="md">
      <p className={styles.placeholder}>
        This screen is not in the Figma hand-off yet. Drop its components here — the shell, nav and
        access rules for {role.label} already work.
      </p>
    </SectionCard>
  );
}
