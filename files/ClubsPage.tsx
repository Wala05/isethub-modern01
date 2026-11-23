import { ClubsSection } from '@/components/clubs/ClubsSection';
import { PageShell } from '@/components/shared/PageShell';
import type { NotifyFn } from '@/lib/types';

export function ClubsPage({ notify }: { notify: NotifyFn }) {
  return (
    <PageShell eyebrow="Clubs & campus life" title="Trouve ton crew. Crée tes souvenirs." intro="Les clubs officiels de l’ISET Djerba et leurs prochaines activités.">
      <ClubsSection notify={notify} />
    </PageShell>
  );
}
