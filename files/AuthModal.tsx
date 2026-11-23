import { useState } from 'react';
import { LogIn, Sparkles } from 'lucide-react';
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

const inputClass = 'mt-3 h-12 w-full rounded-xl border border-slate-200 px-3.5 text-sm font-semibold outline-none transition focus:border-[#126cb1] focus:ring-4 focus:ring-[#126cb1]/10';

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
      <p className="mt-1 text-sm text-slate-500">{mode === 'login' ? 'Connecte-toi avec ton email ISET.' : 'Crée ton profil étudiant en quelques secondes.'}</p>
      {mode === 'signup' && <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom et prénom" autoComplete="name" className={inputClass + ' mt-5'} />}
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="prenom.nom@iset.tn" type="email" autoComplete="email" className={inputClass + (mode === 'login' ? ' mt-5' : '')} />
      <input value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') void submit(); }} placeholder="Mot de passe" type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} className={inputClass} />
      {mode === 'signup' && <div className="mt-3"><SelectFilter label="Département" value={department} setValue={setDepartment} options={departments.slice(1)} /></div>}
      {error && <p role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-xs font-bold text-red-600">{error}</p>}
      <button onClick={() => void submit()} disabled={busy} className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#126cb1] px-4 text-sm font-extrabold text-white shadow-lg shadow-[#126cb1]/25 transition hover:bg-[#0f5b96] disabled:opacity-60">
        {mode === 'login' ? <LogIn size={16} /> : <Sparkles size={16} />}
        {busy ? 'Un instant…' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
      </button>
      <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="mt-4 w-full text-center text-xs font-bold text-[#126cb1]">
        {mode === 'login' ? 'Pas encore de compte ? Rejoins-nous' : 'Déjà membre ? Se connecter'}
      </button>
    </Modal>
  );
}
