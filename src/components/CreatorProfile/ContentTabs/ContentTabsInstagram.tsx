import { useState } from 'react';
import { Image, Video, Lock, Radio, ShoppingBag, Crown } from 'lucide-react';
import { CreatorProfile, ContentTabType } from '../../../shared/types/creator-profile.types';
import { MediaGrid } from '../MediaGrid/MediaGrid';
import { PurchasableContentCard } from '../MediaCard/PurchasableContentCard';
import { PurchasableContentList } from './PurchasableContentList';

interface ContentTabsInstagramProps {
  profile: CreatorProfile;
  isSubscribedToPhotos: boolean;
  isSubscribedToVideos: boolean;
}

export const ContentTabsInstagram = ({ 
  profile, 
  isSubscribedToPhotos = false,
  isSubscribedToVideos = false 
}: ContentTabsInstagramProps) => {
  const [activeTab, setActiveTab] = useState<ContentTabType>('fotos');

  const tabs = [
    {
      id: 'fotos' as ContentTabType,
      label: 'Fotos',
      icon: Image,
      count: profile.fotosPublicas.length,
      disabled: false,
      color: 'blue',
    },
    {
      id: 'videos' as ContentTabType,
      label: 'Videos',
      icon: Video,
      count: profile.videosPublicos.length,
      disabled: false,
      color: 'purple',
    },
    {
      id: 'premium-fotos' as ContentTabType,
      label: 'Premium Fotos',
      icon: Crown,
      count: profile.contenidoPremiumFotos?.length || 0,
      disabled: false,
      color: 'pink',
    },
    {
      id: 'premium-videos' as ContentTabType,
      label: 'Premium Videos',
      icon: Crown,
      count: profile.contenidoPremiumVideos?.length || 0,
      disabled: false,
      color: 'rose',
    },
    {
      id: 'contenido-comprable' as ContentTabType,
      label: 'Contenido ($)',
      icon: ShoppingBag,
      count: profile.contenidoComprable?.length || 0,
      disabled: false,
      color: 'yellow',
    },
    {
      id: 'envivo' as ContentTabType,
      label: 'En vivo',
      icon: Radio,
      count: 0,
      disabled: !profile.estaEnVivo,
      color: 'red',
    },
  ];

  const getColorClasses = (color: string, isActive: boolean) => {
    const colors = {
      blue: isActive ? 'from-blue-500 to-cyan-500 shadow-blue-500/30' : '',
      purple: isActive ? 'from-purple-500 to-pink-500 shadow-purple-500/30' : '',
      pink: isActive ? 'from-pink-500 to-rose-500 shadow-pink-500/30' : '',
      rose: isActive ? 'from-rose-500 to-red-500 shadow-rose-500/30' : '',
      yellow: isActive ? 'from-yellow-500 to-orange-500 shadow-yellow-500/30' : '',
      red: isActive ? 'from-red-500 to-rose-600 shadow-red-500/30' : '',
    };
    return colors[color as keyof typeof colors] || '';
  };

  const getBorderColor = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-cyan-500',
      purple: 'from-purple-500 to-pink-500',
      pink: 'from-pink-500 to-rose-500',
      rose: 'from-rose-500 to-red-500',
      yellow: 'from-yellow-500 to-orange-500',
      red: 'from-red-500 to-rose-600',
    };
    return colors[color as keyof typeof colors] || '';
  };

  const getContent = () => {
    switch (activeTab) {
      case 'fotos':
        return profile.fotosPublicas;
      case 'videos':
        return profile.videosPublicos;
      case 'premium-fotos':
        return profile.contenidoPremiumFotos || [];
      case 'premium-videos':
        return profile.contenidoPremiumVideos || [];
      case 'contenido-comprable':
        return null; // Manejado aparte
      case 'envivo':
        return [];
      default:
        return [];
    }
  };

  const handlePurchase = (contentId: number) => {
    console.log('Comprar contenido:', contentId);
    // TODO: Implementar modal de pago con Stripe
  };

  const handleDownload = (contentId: number) => {
    console.log('Descargar contenido:', contentId);
    // TODO: Implementar descarga
  };

  return (
    <div>
      {/* Tabs - Scrollable horizontal en móvil */}
      <div className="sticky top-14 bg-white border-b border-gray-200 z-20">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 px-4 min-w-max">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => !tab.disabled && setActiveTab(tab.id)}
                  disabled={tab.disabled}
                  className={`flex items-center gap-2 px-3 py-3 font-semibold text-xs transition relative whitespace-nowrap ${
                    isActive 
                      ? 'text-gray-900' 
                      : tab.disabled
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`p-2 rounded-lg transition ${
                      isActive
                        ? `bg-gradient-to-br ${getColorClasses(tab.color, true)} shadow-lg`
                        : tab.disabled
                        ? 'bg-gray-100'
                        : 'bg-gray-100'
                    }`}
                  >
                    <tab.icon className={`w-4 h-4 ${
                      isActive 
                        ? 'text-white' 
                        : tab.disabled
                        ? 'text-gray-300'
                        : 'text-gray-600'
                    }`} />
                  </div>

                  {/* Label */}
                  <span>{tab.label}</span>

                  {/* Badge */}
                  {tab.count > 0 && !tab.disabled && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        isActive
                          ? 'bg-white/30 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}

                  {/* Live Indicator */}
                  {tab.id === 'envivo' && !tab.disabled && (
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  )}

                  {/* Active Border */}
                  {isActive && (
                    <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-t bg-gradient-to-r ${getBorderColor(tab.color)}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {/* Contenido Comprable */}
        {activeTab === 'contenido-comprable' ? (
          
          <PurchasableContentList
          items={profile.contenidoComprable || []}
          onPurchase={handlePurchase}
          onDownload={handleDownload}
        />
          
        ) : activeTab === 'envivo' && profile.estaEnVivo ? (
          /* Live Stream */
          <div className="max-w-4xl mx-auto">
            <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl flex items-center justify-center shadow-2xl">
              <div className="text-white text-center">
                <Radio className="w-16 h-16 mx-auto mb-4 text-red-500 animate-pulse" />
                <p className="text-2xl font-bold">Transmisión en vivo</p>
              </div>
            </div>
          </div>
        ) : (
          /* Media Grid */
          <MediaGrid
            items={getContent() as any}
            isPremiumTab={activeTab === 'premium-fotos' || activeTab === 'premium-videos'}
            isSubscribed={
              activeTab === 'premium-fotos' 
                ? isSubscribedToPhotos 
                : activeTab === 'premium-videos'
                ? isSubscribedToVideos
                : false
            }
          />
        )}
      </div>
    </div>
  );
};