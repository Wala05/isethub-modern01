import { useState } from 'react';
import { HousingSection } from '@/components/housing/HousingSection';
import { RideSection } from '@/components/rides/RideSection';
import { DealsHub } from '@/components/life/DealsHub';
import { PageShell } from '@/components/shared/PageShell';
import { SegmentedTabs } from '@/components/shared/SegmentedTabs';
import type { NotifyFn } from '@/lib/types';

type LifeTab = 'logement' | 'covoit' | 'bons';
const tabs = [
  { key: 'logement', label: 'Logement & Coloc' },
  { key: 'covoit', label: 'Covoiturage' },
  { key: 'bons', label: 'Bons plans' },
] as const;

export function LifePage({ notify, initialTab }: { notify: NotifyFn; initialTab?: string }) {
  const start: LifeTab = tabs.some((tab) => tab.key === initialTab) ? (initialTab as LifeTab) : 'logement';
  const [tab, setTab] = useState<LifeTab>(start);

  return (
    <PageShell eyebrow="Vie étudiante" title="La vie autour du campus, en mieux." intro="Parce que les études, c’est aussi trouver son chez-soi, rentrer ensemble et connaître les bons endroits.">
      <SegmentedTabs tabs={tabs} value={tab} onChange={setTab} />
      <div key={tab} className="animate-fade">
        {tab === 'logement' && <HousingSection notify={notify} />}
        {tab === 'covoit' && <RideSection notify={notify} />}
        {tab === 'bons' && <DealsHub />}
      </div>
    </PageShell>
  );
}
