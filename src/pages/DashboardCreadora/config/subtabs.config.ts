import { TrendingUp, Users, Activity } from 'lucide-react';
import { SubTab } from '../components/SubTabsHeader';

export const subTabsConfig: SubTab[] = [
  { id: 'invitaciones', label: 'Invitaciones', icon: Users },
 // { id: 'miactividad', label: 'Mi Actividad', icon: Activity },
  { id: 'resumen', label: 'Resumen', icon: TrendingUp },
];
