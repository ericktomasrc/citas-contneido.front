import { useState } from 'react';
import { Image, Video, Package, Camera } from 'lucide-react';
import { CONTENIDO_CONFIG } from '../../../components/Common/config/config';
import { TabContenido } from '../../../components/DashboardCreadora/Tabs/Contenido/TabContenido';
import { TabPacks } from '../../../components/DashboardCreadora/Tabs/Contenido/TabPacks'; 
 
type TipoTab = 'fotos' | 'videos' | 'packs';

export const ContenidoPage = () => {
  const [tabActivo, setTabActivo] = useState<TipoTab>('fotos');

  // Mock data del usuario
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
      {/* Header con Avatar + Info + Tabs */}
      <div className="bg-white border-b border-gray-200 -mx-6 -mt-6 mb-6">
        {/* DIV 1: Avatar + Nombre */}
        <div className="border-b border-gray-100 py-3 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              {/* Foto de perfil circular */}
              <div className="relative group">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md">
                  <img
                    src={currentUser.avatar}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="absolute bottom-0 right-0 w-6 h-6 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-md hover:from-pink-600 hover:to-rose-600 transition-all">
                  <Camera className="w-3 h-3 text-white" />
                </button>
              </div>

              <div>
                <h1 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  {currentUser.nombre}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full">
                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verificado
                  </span>
                </h1>
                <p className="text-xs text-gray-600">Gestiona tu contenido</p>
              </div>
            </div>
          </div>
        </div>

        {/* DIV 2: Tabs de navegación */}
        <div className="px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex overflow-x-auto scrollbar-hide gap-0.5">
              {tabs.map((tab) => {
                const isActive = tabActivo === tab.id;
                const Icon = tab.icon;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setTabActivo(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition-all whitespace-nowrap text-xs ${
                      isActive
                        ? 'border-pink-500 text-pink-600 font-semibold'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido del Tab - CENTRADO */}
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
