import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import type { Resource } from './types';

export const departments = ['Tous', 'IT', 'Gestion', 'Mécanique', 'Électrique'];
export const resourceTypes = ['Cours', 'Examen', 'TD', 'TP', 'Résumé'];
export const semesters = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'];

export const mockResources: Resource[] = [
  { id: 'r1', title: 'Réseaux informatiques — adressage IP & routage', resource_type: 'Cours', department: 'IT', semester: 'S4', author_name: 'Yasmine B.', votes: 28 },
  { id: 'r2', title: 'Analyse financière — examen de synthèse', resource_type: 'Examen', department: 'Gestion', semester: 'S3', author_name: 'Amine K.', votes: 19 },
  { id: 'r3', title: 'Mécanique des fluides — TD série 2', resource_type: 'TD', department: 'Mécanique', semester: 'S2', author_name: 'Nour J.', votes: 34 },
  { id: 'r4', title: 'Automatismes — résumé capteurs et actionneurs', resource_type: 'Résumé', department: 'Électrique', semester: 'S5', author_name: 'Sami R.', votes: 41 },
];

export function useResources() {
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const [loading, setLoading] = useState<boolean>(Boolean(supabase));

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    supabase
      .from('study_resources')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30)
      .then(({ data }) => {
        if (!active) return;
        if (data?.length) setResources(data as Resource[]);
        setLoading(false);
      });
    return () => { active = false; };
  }, []);

  return { resources, setResources, loading };
}
