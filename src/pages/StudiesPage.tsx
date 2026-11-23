import { useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { departments, resourceTypes, semesters, useResources } from '@/lib/resources';
import { useLocalStorage } from '@/lib/useLocalStorage';
import type { NotifyFn, Resource } from '@/lib/types';
import { PageShell } from '@/components/shared/PageShell';
import { EmptyState } from '@/components/shared/EmptyState';
import { Modal } from '@/components/shared/Modal';
import { SelectFilter } from '@/components/shared/SelectFilter';

const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

type StudiesPageProps = { notify: NotifyFn; initialType?: string; initialQuery?: string };

export function StudiesPage({ notify, initialType, initialQuery }: StudiesPageProps) {
  const { resources, setResources, loading } = useResources();
  const [department, setDepartment] = useState('Tous');
  const [type, setType] = useState(initialType && resourceTypes.includes(initialType) ? initialType : 'Tous');
  const [semester, setSemester] = useState('Tous');
  const [query, setQuery] = useState(initialQuery ?? '');
  const [onlyFavs, setOnlyFavs] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [favs, setFavs] = useLocalStorage<string[]>('isethub-favs', []);
  const [voted, setVoted] = useLocalStorage<string[]>('isethub-voted', []);

  const filtered = useMemo(() => {
    const needle = normalize(query.trim());
    return resources.filter((r) =>
      (department === 'Tous' || r.department === department) &&
      (type === 'Tous' || r.resource_type === type) &&
      (semester === 'Tous' || r.semester === semester) &&
      (!onlyFavs || favs.includes(r.id)) &&
      (!needle || normalize(`${r.title} ${r.author_name} ${r.department} ${r.resource_type}`).includes(needle))
    );
  }, [resources, department, type, semester, query, onlyFavs, favs]);

  const hasFilters = department !== 'Tous' || type !== 'Tous' || semester !== 'Tous' || query !== '' || onlyFavs;
  const reset = () => { setDepartment('Tous'); setType('Tous'); setSemester('Tous'); setQuery(''); setOnlyFavs(false); };

  const toggleFav = (resource: Resource) => {
    const saved = favs.includes(resource.id);
    setFavs((current) => (saved ? current.filter((id) => id !== resource.id) : [...current, resource.id]));
    notify(saved ? 'Retiré de tes favoris.' : 'Ajouté à tes favoris ⭐');
  };

  const toggleVote = (resource: Resource) => {
    const already = voted.includes(resource.id);
    setVoted((current) => (already ? current.filter((id) => id !== resource.id) : [...current, resource.id]));
    setResources((current) => current.map((item) => (item.id === resource.id ? { ...item, votes: item.votes + (already ? -1 : 1) } : item)));
  };

  const addResource = async (title: string, selectedType: string, selectedDepartment: string, selectedSemester: string) => {
    const draft = { title, resource_type: selectedType, department: selectedDepartment, semester: selectedSemester, author_name: 'Moi', votes: 0 };
    const { data } = supabase ? await supabase.from('study_resources').insert(draft).select().maybeSingle() : { data: null };
    setResources((current) => [{ id: data?.id ?? String(Date.now()), ...draft }, ...current]);
    setUploadOpen(false);
    notify('Ta ressource a été ajoutée. Merci !');
  };

  return (
    <PageShell eyebrow="Espace études" title="Tout ce qu’il te faut pour réussir." intro="Les bons documents, au bon moment. Cherche, filtre, enregistre et partage les ressources de ta promo.">
      <div className="hairline mb-6 flex flex-col gap-4 py-6 sm:flex-row sm:items-center">
        <label className="flex h-12 flex-1 items-center gap-3 border border-[var(--line)] bg-[var(--surface)] px-4 transition focus-within:border-[var(--accent)]">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Matière, titre, auteur…" aria-label="Rechercher une ressource" className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-[var(--ink-faint)]" />
          {query && <button onClick={() => setQuery('')} aria-label="Effacer" className="index-tag transition hover:!text-[var(--accent)]">✕</button>}
        </label>
        <button onClick={() => setUploadOpen(true)} className="btn btn-primary shrink-0 uppercase tracking-[.1em]">Partager un document</button>
      </div>

      <div className="no-scrollbar -mx-5 mb-4 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        {departments.map((item) => (
          <button key={item} onClick={() => setDepartment(item)} className={`shrink-0 border px-4 py-2 text-sm font-bold transition ${department === item ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]' : 'border-[var(--line)] text-[var(--ink-soft)] hover:border-[var(--ink)] hover:text-[var(--ink)]'}`}>{item}</button>
        ))}
        <button onClick={() => setOnlyFavs((value) => !value)} className={`ml-auto shrink-0 border px-4 py-2 text-sm font-bold transition ${onlyFavs ? 'border-[var(--accent)] bg-[var(--accent)] text-white' : 'border-[var(--line)] text-[var(--ink-soft)] hover:border-[var(--accent)] hover:text-[var(--accent)]'}`}>
          Favoris ({favs.length})
        </button>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3">
        <SelectFilter label="Type" value={type} setValue={setType} options={['Tous', ...resourceTypes]} />
        <SelectFilter label="Semestre" value={semester} setValue={setSemester} options={['Tous', ...semesters]} />
      </div>

      <div className="mb-2 flex items-center justify-between px-1">
        <p className="index-tag">{filtered.length} ressource{filtered.length > 1 ? 's' : ''}</p>
        {hasFilters && <button onClick={reset} className="btn btn-line !min-h-8 text-xs uppercase tracking-[.12em]">Réinitialiser</button>}
      </div>

      <div>
        {loading && [0, 1, 2].map((n) => <div key={n} className="skeleton hairline my-3 h-24" />)}
        {!loading && filtered.map((resource, index) => {
          const saved = favs.includes(resource.id);
          const liked = voted.includes(resource.id);
          return (
            <article key={resource.id} className="group hairline flex flex-col gap-4 py-6 transition hover:bg-[var(--surface-2)] sm:flex-row sm:items-center sm:gap-6 sm:px-5">
              <div className="flex items-start gap-5 sm:flex-1 sm:items-center">
                <span className="index-tag w-10 shrink-0 transition group-hover:text-[var(--accent)]">/{String(index + 1).padStart(2, '0')}/</span>
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[var(--accent)]">{resource.resource_type}</span>
                    <span className="index-tag">{resource.department} · {resource.semester}</span>
                  </div>
                  <h3 className="text-lg font-extrabold leading-snug tracking-tight">{resource.title}</h3>
                  <p className="mt-1 text-xs font-semibold text-[var(--ink-faint)]">Partagé par {resource.author_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 border-t border-[var(--line)] pt-4 sm:border-0 sm:pt-0">
                <button onClick={() => toggleFav(resource)} aria-label={saved ? 'Retirer des favoris' : 'Ajouter aux favoris'} aria-pressed={saved} className={`text-lg leading-none transition ${saved ? 'text-[var(--accent)]' : 'text-[var(--ink-faint)] hover:text-[var(--accent)]'}`}>★</button>
                <button onClick={() => notify('Aperçu ouvert pour « ' + resource.title + ' »')} aria-label="Prévisualiser" className="index-tag px-1 transition hover:!text-[var(--accent)]">Lire</button>
                <button onClick={() => notify('Téléchargement de « ' + resource.title + ' »')} aria-label="Télécharger" className="index-tag px-1 transition hover:!text-[var(--accent)]">↓</button>
                <button onClick={() => toggleVote(resource)} aria-pressed={liked} className={`ml-auto flex items-center gap-1.5 border px-3.5 py-2 text-sm font-extrabold transition sm:ml-0 ${liked ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]' : 'border-[var(--line)] text-[var(--ink-soft)] hover:border-[var(--ink)] hover:text-[var(--ink)]'}`}>
                  ▲ {resource.votes}
                </button>
              </div>
            </article>
          );
        })}
        {!loading && filtered.length === 0 && (
          <EmptyState text={onlyFavs ? 'Tu n’as pas encore de favoris. Touche l’étoile sur une ressource pour la retrouver ici.' : 'Aucune ressource avec ces filtres.'} action={hasFilters ? { label: 'Réinitialiser les filtres', onClick: reset } : undefined} />
        )}
      </div>

      {uploadOpen && <UploadModal onClose={() => setUploadOpen(false)} onSubmit={addResource} />}
    </PageShell>
  );
}

type UploadModalProps = { onClose: () => void; onSubmit: (title: string, type: string, department: string, semester: string) => void };

function UploadModal({ onClose, onSubmit }: UploadModalProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Cours');
  const [department, setDepartment] = useState('IT');
  const [semester, setSemester] = useState('S1');

  return (
    <Modal title="Partager une ressource" onClose={onClose}>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">Aide ta promo en partageant le titre et les informations du document.</p>
      <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre du document" className="mt-6 h-12 w-full border border-[var(--line)] px-3.5 text-sm font-semibold outline-none transition focus:border-[var(--accent)]" />
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <SelectFilter label="Type" value={type} setValue={setType} options={resourceTypes} />
        <SelectFilter label="Département" value={department} setValue={setDepartment} options={departments.slice(1)} />
        <SelectFilter label="Semestre" value={semester} setValue={setSemester} options={semesters} />
      </div>
      <div className="mt-7 flex justify-end gap-3">
        <button onClick={onClose} className="btn btn-ghost !min-h-11 text-xs uppercase tracking-[.1em]">Annuler</button>
        <button disabled={!title.trim()} onClick={() => onSubmit(title.trim(), type, department, semester)} className="btn btn-primary !min-h-11 text-xs uppercase tracking-[.1em]">Ajouter</button>
      </div>
    </Modal>
  );
}
