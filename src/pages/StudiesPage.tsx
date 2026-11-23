import { useMemo, useState } from 'react';
import { Bookmark, BookOpen, Download, FileText, Search, ThumbsUp, Upload, X } from 'lucide-react';
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
      <div className="mb-5 flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-3 shadow-soft sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex h-12 flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3.5 transition focus-within:border-[#126cb1] focus-within:ring-4 focus-within:ring-[#126cb1]/10">
            <Search size={18} className="shrink-0 text-slate-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Matière, titre, auteur…" aria-label="Rechercher une ressource" className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400" />
            {query && <button onClick={() => setQuery('')} aria-label="Effacer" className="text-slate-400 hover:text-slate-700"><X size={16} /></button>}
          </label>
          <button onClick={() => setUploadOpen(true)} className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#fba831] px-5 text-sm font-extrabold text-[#021d33] shadow-sm transition hover:-translate-y-0.5 hover:brightness-105">
            <Upload size={17} /> Partager un document
          </button>
        </div>

        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
          {departments.map((item) => (
            <button key={item} onClick={() => setDepartment(item)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${department === item ? 'bg-[#126cb1] text-white shadow-md shadow-[#126cb1]/25' : 'bg-slate-50 text-slate-500 hover:bg-[#e8f3fb] hover:text-[#126cb1]'}`}>{item}</button>
          ))}
          <button onClick={() => setOnlyFavs((value) => !value)} className={`ml-auto flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition ${onlyFavs ? 'bg-[#fba831] text-[#021d33]' : 'bg-[#fff4df] text-[#d4840f]'}`}>
            <Bookmark size={15} fill={onlyFavs ? 'currentColor' : 'none'} /> Favoris ({favs.length})
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <SelectFilter label="Type" value={type} setValue={setType} options={['Tous', ...resourceTypes]} />
          <SelectFilter label="Semestre" value={semester} setValue={setSemester} options={['Tous', ...semesters]} />
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between px-1">
        <p className="text-sm font-bold text-slate-500">{filtered.length} ressource{filtered.length > 1 ? 's' : ''}</p>
        {hasFilters && <button onClick={reset} className="text-sm font-extrabold text-[#126cb1]">Réinitialiser</button>}
      </div>

      <div className="grid gap-3">
        {loading && [0, 1, 2].map((n) => <div key={n} className="skeleton h-24 rounded-3xl" />)}
        {!loading && filtered.map((resource) => {
          const saved = favs.includes(resource.id);
          const liked = voted.includes(resource.id);
          return (
            <article key={resource.id} className="group flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#b8dbf2] hover:shadow-lift sm:flex-row sm:items-center sm:p-5">
              <div className="flex items-start gap-4 sm:flex-1 sm:items-center">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#eaf5fc] text-[#126cb1]"><FileText size={21} /></div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-[#eef7fd] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#126cb1]">{resource.resource_type}</span>
                    <span className="text-xs font-bold text-slate-400">{resource.department} · {resource.semester}</span>
                  </div>
                  <h3 className="font-extrabold leading-snug">{resource.title}</h3>
                  <p className="mt-1 text-xs font-semibold text-slate-400">Partagé par {resource.author_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 border-t border-slate-100 pt-3 sm:border-0 sm:pt-0">
                <button onClick={() => toggleFav(resource)} aria-label={saved ? 'Retirer des favoris' : 'Ajouter aux favoris'} aria-pressed={saved} className={`rounded-xl border p-2.5 transition ${saved ? 'border-[#fba831] bg-[#fff4df] text-[#d4840f]' : 'border-slate-200 text-slate-500 hover:border-[#fba831] hover:text-[#d4840f]'}`}>
                  <Bookmark size={17} fill={saved ? 'currentColor' : 'none'} />
                </button>
                <button onClick={() => notify('Aperçu ouvert pour « ' + resource.title + ' »')} aria-label="Prévisualiser" className="rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:border-[#126cb1] hover:text-[#126cb1]"><BookOpen size={17} /></button>
                <button onClick={() => notify('Téléchargement de « ' + resource.title + ' »')} aria-label="Télécharger" className="rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:border-[#126cb1] hover:text-[#126cb1]"><Download size={17} /></button>
                <button onClick={() => toggleVote(resource)} aria-pressed={liked} className={`ml-auto flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-sm font-extrabold transition sm:ml-0 ${liked ? 'bg-[#126cb1] text-white' : 'bg-[#fff4df] text-[#d4840f]'}`}>
                  <ThumbsUp size={16} fill={liked ? 'currentColor' : 'none'} /> {resource.votes}
                </button>
              </div>
            </article>
          );
        })}
        {!loading && filtered.length === 0 && (
          <EmptyState text={onlyFavs ? 'Tu n’as pas encore de favoris. Touche le marque-page sur une ressource pour la retrouver ici.' : 'Aucune ressource avec ces filtres.'} action={hasFilters ? { label: 'Réinitialiser les filtres', onClick: reset } : undefined} />
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
      <p className="mt-1 text-sm text-slate-500">Aide ta promo en partageant le titre et les informations du document.</p>
      <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre du document" className="mt-5 h-12 w-full rounded-xl border border-slate-200 px-3.5 text-sm font-semibold outline-none transition focus:border-[#126cb1] focus:ring-4 focus:ring-[#126cb1]/10" />
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <SelectFilter label="Type" value={type} setValue={setType} options={resourceTypes} />
        <SelectFilter label="Département" value={department} setValue={setDepartment} options={departments.slice(1)} />
        <SelectFilter label="Semestre" value={semester} setValue={setSemester} options={semesters} />
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-500 transition hover:bg-slate-50">Annuler</button>
        <button disabled={!title.trim()} onClick={() => onSubmit(title.trim(), type, department, semester)} className="rounded-xl bg-[#126cb1] px-5 py-2.5 text-sm font-extrabold text-white shadow-md shadow-[#126cb1]/25 transition hover:bg-[#0f5b96] disabled:opacity-50">Ajouter</button>
      </div>
    </Modal>
  );
}
