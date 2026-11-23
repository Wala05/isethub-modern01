export type View = 'accueil' | 'etudes' | 'vie' | 'clubs' | 'marketplace';

export type User = { name: string; email: string; department: string; initials: string };

export type Resource = {
  id: string;
  title: string;
  resource_type: string;
  department: string;
  semester: string;
  author_name: string;
  votes: number;
};

export type GoFn = (view: View, sub?: string, query?: string) => void;
export type NotifyFn = (message: string) => void;
