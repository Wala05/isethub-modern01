import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { departments } from '@/lib/resources';
import type { User } from '@/lib/types';
import { Modal } from '@/components/shared/Modal';
import { SelectFilter } from '@/components/shared/SelectFilter';

type AuthMode = 'login' | 'signup';
type AuthModalProps = { mode: AuthMode; setMode: (mode: AuthMode) => void; onClose: () => void; onSuccess: (user: User) => void };

export function initials(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('') || 'IS';
}

const inputClass = 'mt-4 h-12 w-full border border-[var(--line)] bg-[var(--surface)] px-3.5 text-sm font-semibold outline-none transition focus:border-[var(--accent)]';

export function AuthModal({ mode, setMode, onClose, onSuccess }: AuthModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('IT');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError('');
    if (!email.trim().toLowerCase().endsWith('@iset.tn')) { setError('Utilise ton adresse universitaire qui se termine par @iset.tn.'); return; }
    if (mode === 'signup' && !name.trim()) { setError('Ajoute ton nom pour créer ton profil.'); return; }
    setBusy(true);
    try {
      if (supabase) {
        const result = mode === 'signup'
          ? await supabase.auth.signUp({ email, password, options: { data: { full_name: name, department } } })
          : await supabase.auth.signInWithPassword({ email, password });
        if (result.error) {
          setError(result.error.message.includes('Invalid') ? 'Adresse ou mot de passe incorrect.' : result.error.message);
          return;
        }
        if (mode === 'signup' && result.data.user) {
          await supabase.from('profiles').upsert({ id: result.data.user.id, full_name: name, email, department, avatar_initials: initials(name) });
        }
      }
      const displayName = name || email.split('@')[0];
      onSuccess({ name: displayName, email, department, initials: initials(displayName) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal title={mode === 'login' ? 'Ravi de te revoir.' : 'Bienvenue dans la communauté.'} onClose={onClose}>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">{mode === 'login' ? 'Connecte-toi avec ton email ISET.' : 'Crée ton profil étudiant en quelques secondes.'}</p>
      {mode === 'signup' && <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom et prénom" autoComplete="name" className={inputClass + ' !mt-6'} />}
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="prenom.nom@iset.tn" type="email" autoComplete="email" className={inputClass} />
      <input value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') void submit(); }} placeholder="Mot de passe" type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} className={inputClass} />
      {mode === 'signup' && <div className="mt-4"><SelectFilter label="Département" value={department} setValue={setDepartment} options={departments.slice(1)} /></div>}
      {error && <p role="alert" className="mt-4 bg-[var(--accent-soft)] p-3 text-xs font-bold text-[var(--accent)]">{error}</p>}
      <button onClick={() => void submit()} disabled={busy} className="btn btn-primary mt-6 w-full uppercase tracking-[.1em]">
        {busy ? 'Un instant…' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
      </button>
      <div className="hairline mt-6 pt-4 text-center">
        <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-xs font-bold text-[var(--accent)]">
          {mode === 'login' ? 'Pas encore de compte ? Rejoins-nous' : 'Déjà membre ? Se connecter'}
        </button>
      </div>
    </Modal>
  );
}
