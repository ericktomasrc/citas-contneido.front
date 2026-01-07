// src/layouts/DashboardEspectadorLayout.tsx
import { ReactNode } from 'react'; 
import { OnlineCreatorsSidebar } from '@/components/Common/OnlineCreators/OnlineCreatorsSidebar';
import { OnlineCreator } from '@/shared/types/creator.types'; 

interface OnlineCreatorExtended extends OnlineCreator {
  edad?: number;
}

interface DashboardEspectadorLayoutProps {
  children: ReactNode;
}

export const DashboardEspectadorLayout = ({ children }: DashboardEspectadorLayoutProps) => {
  // Mock data - Creadoras en línea (siempre visible)
  const onlineCreators: OnlineCreatorExtended[] = [
    { id: 1, slug: 'maria-rodriguez-a7k3', nombre: 'Chelsea', edad: 24, avatar: 'https://i.pravatar.cc/150?img=1', isLive: true, isFavorite: true },
    { id: 2, slug: 'amanda-garcia-b9d2', nombre: 'Amanda', edad: 26, avatar: 'https://i.pravatar.cc/150?img=2', isLive: false, isFavorite: false },
    { id: 3, slug: 'chloe-martin-c4f7', nombre: 'Chloe', edad: 22, avatar: 'https://i.pravatar.cc/150?img=3', isLive: true, isFavorite: false },
    { id: 4, slug: 'leslie-hall-e8k1', nombre: 'Leslie', edad: 28, avatar: 'https://i.pravatar.cc/150?img=4', isLive: false, isFavorite: true },
    { id: 5, slug: 'maria-lopez-d3j9', nombre: 'María', edad: 25, avatar: 'https://i.pravatar.cc/150?img=5', isLive: false, isFavorite: false },
    { id: 6, slug: 'ana-martinez-f6l4', nombre: 'Ana', edad: 27, avatar: 'https://i.pravatar.cc/150?img=6', isLive: true, isFavorite: true },
    { id: 7, slug: 'sofia-gonzalez-h7k2', nombre: 'Sofía', edad: 23, avatar: 'https://i.pravatar.cc/150?img=7', isLive: false, isFavorite: false },
    { id: 8, slug: 'lucia-morales-j9l8', nombre: 'Lucía', edad: 29, avatar: 'https://i.pravatar.cc/150?img=8', isLive: false, isFavorite: true },
    { id: 9, slug: 'valeria-castro-t8n4', nombre: 'Valeria', edad: 24, avatar: 'https://i.pravatar.cc/150?img=9', isLive: true, isFavorite: false },
    { id: 10, slug: 'camila-torres-r3b9', nombre: 'Camila', edad: 26, avatar: 'https://i.pravatar.cc/150?img=10', isLive: false, isFavorite: true },
    { id: 11, slug: 'daniela-ruiz-w5p3', nombre: 'Daniela', edad: 25, avatar: 'https://i.pravatar.cc/150?img=11', isLive: true, isFavorite: false },
    { id: 12, slug: 'andrea-silva-q7m8', nombre: 'Andrea', edad: 28, avatar: 'https://i.pravatar.cc/150?img=12', isLive: false, isFavorite: false },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* El children NO debe incluir NavbarDashboard */}
      {children} 
      
      {/* OnlineCreatorsSidebar SIEMPRE visible */}
      <OnlineCreatorsSidebar creators={onlineCreators} />
    </div>
  );
};
