// src/pages/DashboardCreadora/ContenidoPage/ContenidoPage.tsx
// ✅ SOLO SE QUITÓ: Avatar
// ✅ TODO LO DEMÁS QUEDA IGUAL

import { useState } from 'react';
import { Image, Video, Package, Sparkles } from 'lucide-react';
import { CONTENIDO_CONFIG } from '../../../components/Common/config/config';
import { TabContenido } from '../../../components/DashboardCreadora/Tabs/Contenido/TabContenido';
//import { TabPacks } from '../../../components/DashboardCreadora/Tabs/Contenido/TabPacks';

type TipoTab = 'fotos' | 'videos' | 'packs';

export const ContenidoPage = () => {
  const [tabActivo, setTabActivo] = useState<TipoTab>('fotos');

  const tabs = [
    { id: 'fotos' as const, label: 'Fotos', icon: Image },
    { id: 'videos' as const, label: 'Videos', icon: Video },
 //   { id: 'packs' as const, label: 'Packs', icon: Package },
  ];

  return (
    <>
      {/* Header compacto */}
      <div className="bg-white border-b border-gray-200 -mx-3 -mt-3 mb-4 md:-mx-4 md:-mt-4">
        {/* Mensaje (SIN Avatar) */}
        <div className="border-b border-gray-100 py-2.5 px-3 md:px-4">
          <div className="max-w-7xl mx-auto">
            <p className="text-[10px] text-rose-600 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" strokeWidth={2} />
              Sube tu contenido inicial para empezar a recibir suscriptores
            </p>
          </div>
        </div>

        {/* Tabs de navegación compactos */}
        <div className="px-3 md:px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex overflow-x-auto scrollbar-hide gap-0.5">
              {tabs.map((tab) => {
                const isActive = tabActivo === tab.id;
                const Icon = tab.icon;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setTabActivo(tab.id)}
                    className={`
                      flex items-center gap-1 px-2.5 py-2 border-b-2 transition-all whitespace-nowrap text-[11px] font-medium
                      ${isActive
                        ? 'border-pink-500 text-pink-600 font-semibold'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className="w-3.5 h-3.5" strokeWidth={isActive ? 2 : 1.75} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido del Tab */}
      <div className="max-w-7xl mx-auto">
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

        {/* <div style={{ display: tabActivo === 'packs' ? 'block' : 'none' }}>
          <TabPacks />
        </div> */}
      </div>
    </>
  );
};