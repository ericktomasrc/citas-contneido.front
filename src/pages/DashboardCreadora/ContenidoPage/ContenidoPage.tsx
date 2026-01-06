// src/components/DashboardCreadora/Tabs/ContenidoPage.tsx
import { useState } from 'react';
import { Image, Video, Package } from 'lucide-react';
import { CONTENIDO_CONFIG } from '../../../components/Common/config';
import { TabContenido } from '../../../components/DashboardCreadora/Tabs/Contenido/TabContenido';
import { TabPacks } from '../../../components/DashboardCreadora/Tabs/Contenido/TabPacks';

type TipoTab = 'fotos' | 'videos' | 'packs';

export const ContenidoPage = () => {
  const [tabActivo, setTabActivo] = useState<TipoTab>('fotos');

  return (
    <div className="p-8">
      {/* Tabs Header con línea indicadora */}
      <div className="mb-6">
        <div className="flex gap-1 border-b border-slate-200">
          <button
            onClick={() => setTabActivo('fotos')}
            className={`relative px-6 py-3 font-semibold text-sm transition-all flex items-center gap-2 ${
              tabActivo === 'fotos'
                ? 'text-indigo-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Image className="w-4 h-4" />
            Fotos
            {/* Línea indicadora */}
            {tabActivo === 'fotos' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
            )}
          </button>
          <button
            onClick={() => setTabActivo('videos')}
            className={`relative px-6 py-3 font-semibold text-sm transition-all flex items-center gap-2 ${
              tabActivo === 'videos'
                ? 'text-indigo-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Video className="w-4 h-4" />
            Videos
            {/* Línea indicadora */}
            {tabActivo === 'videos' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
            )}
          </button>
          <button
            onClick={() => setTabActivo('packs')}
            className={`relative px-6 py-3 font-semibold text-sm transition-all flex items-center gap-2 ${
              tabActivo === 'packs'
                ? 'text-indigo-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Package className="w-4 h-4" />
            Packs
            {/* Línea indicadora */}
            {tabActivo === 'packs' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
            )}
          </button>
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
