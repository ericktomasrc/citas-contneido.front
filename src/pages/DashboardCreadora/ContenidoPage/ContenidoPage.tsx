// src/pages/DashboardCreadora/ContenidoPage/ContenidoPage.tsx
// ✅ MEJORADO: Elementos más pequeños, colores ORIGINALES mantenidos

import { useState } from 'react';
import { Image, Video, Package, Camera, Sparkles } from 'lucide-react';
import { CONTENIDO_CONFIG } from '../../../components/Common/config/config';
import { TabContenido } from '../../../components/DashboardCreadora/Tabs/Contenido/TabContenido';
import { TabPacks } from '../../../components/DashboardCreadora/Tabs/Contenido/TabPacks';

type TipoTab = 'fotos' | 'videos' | 'packs';

export const ContenidoPage = () => {
  const [tabActivo, setTabActivo] = useState<TipoTab>('fotos');

  const currentUser = {
    nombre: 'María García',
    avatar: 'https://i.pravatar.cc/150?img=5',
  };

  const tabs = [
    { id: 'fotos' as const, label: 'Fotos', icon: Image },
    { id: 'videos' as const, label: 'Videos', icon: Video },
    { id: 'packs' as const, label: 'Packs', icon: Package },
  ];

  return (
    <>
      {/* Header compacto */}
      <div className="bg-white border-b border-gray-200 -mx-3 -mt-3 mb-4 md:-mx-4 md:-mt-4">
        {/* Avatar + Nombre */}
        <div className="border-b border-gray-100 py-2.5 px-3 md:px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2.5">
              {/* Avatar compacto */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
                  <img
                    src={currentUser.avatar}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-sm hover:from-pink-600 hover:to-rose-600 transition-all">
                  <Camera className="w-2.5 h-2.5 text-white" strokeWidth={2} />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                  {currentUser.nombre}
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-green-500 text-white text-[9px] font-bold rounded-full">
                    <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verificado
                  </span>
                </h1>
                <p className="text-[10px] text-rose-600 font-semibold flex items-center gap-1 mt-0.5">
                  <Sparkles className="w-3 h-3" strokeWidth={2} />
                  Sube tu contenido inicial para empezar a recibir suscriptores
                </p>
              </div>
            </div>
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

        <div style={{ display: tabActivo === 'packs' ? 'block' : 'none' }}>
          <TabPacks />
        </div>
      </div>
    </>
  );
};