import { TrendingUp, Users, Activity } from 'lucide-react';
import { SubTab } from '../components/SubTabsHeader';

export const subTabsConfig: SubTab[] = [
  { id: 'invitaciones', label: 'Invitaciones', icon: Users },
  { id: 'resumen', label: 'Resumen', icon: TrendingUp },
  { id: 'miactividad', label: 'Mi Actividad', icon: Activity },
];
