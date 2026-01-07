import { useState } from 'react';
import { Image, Video, Package } from 'lucide-react';
import { CONTENIDO_CONFIG } from '../../../components/Common/config';
import { TabContenido } from '../../../components/DashboardCreadora/Tabs/Contenido/TabContenido';
import { TabPacks } from '../../../components/DashboardCreadora/Tabs/Contenido/TabPacks'; 
 
type TipoTab = 'fotos' | 'videos' | 'packs';

export const ContenidoPage = () => {
  const [tabActivo, setTabActivo] = useState<TipoTab>('fotos');

  const tabs = [
    { id: 'fotos' as const, label: 'Fotos', icon: Image },
    { id: 'videos' as const, label: 'Videos', icon: Video },
    { id: 'packs' as const, label: 'Packs', icon: Package },
  ];
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Tabs Simples y Elegantes */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6">
        <div className="flex border-b border-slate-200 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = tabActivo === tab.id;
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.id}
                onClick={() => setTabActivo(tab.id)}
                className={`
                  relative flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors whitespace-nowrap
                  ${isActive 
                    ? 'text-pink-600' 
                    : 'text-slate-600 hover:text-slate-900'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                
                {/* Línea inferior cuando está activo */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenido del Tab - SIN key para mantener el estado */}
      <div style={{ display: tabActivo === 'fotos' ? 'block' : 'none' }}>
        <TabContenido 
          tipo="fotos"
          minimo={CONTENIDO_CONFIG.MINIMO_FOTOS}
        />
      </div>
      
      <div style={{ display: tabActivo === 'videos' ? 'block' : 'none' }}>
        <TabContenido 
          tipo="videos"
          minimo={CONTENIDO_CONFIG.MINIMO_VIDEOS}
        />
      </div>

      <div style={{ display: tabActivo === 'packs' ? 'block' : 'none' }}>
        <TabPacks />
      </div>
    </div>
  );
};
