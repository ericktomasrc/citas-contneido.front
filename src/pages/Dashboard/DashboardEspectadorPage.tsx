// src/pages/Dashboard/DashboardEspectadorPage_ConChat.tsx
// EJEMPLO DE IMPLEMENTACIÓN CON SISTEMA DE CHAT

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Video, MapPin, UserPlus, Eye, MessageCircle } from 'lucide-react';
import { NavbarDashboard } from '../../components/Dashboard/Navbar/NavbarDashboard';
import { SidebarDashboard } from '../../components/Dashboard/Sidebar/SidebarDashboard';
import { OnlineCreatorsSidebar } from '@/components/Common/OnlineCreators/OnlineCreatorsSidebar';
import { FloatingChatModal } from '@/features/chat/components/FloatingChat/FloatingChatModal';
import { useDashboard } from '../../shared/hooks/useDashboard';
import { Creator, OnlineCreator } from '@/shared/types/creator.types';

interface OnlineCreatorExtended extends OnlineCreator {
  edad?: number;
}

const DashboardEspectadorPageContent = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'descubrir' | 'en-vivo'>('descubrir');
  
  // 🔥 NUEVO: Estado para el chat
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatRecipient, setChatRecipient] = useState<{
    id: string;
    name: string;
    avatar: string;
  } | null>(null);

  const { creators, loading } = useDashboard();

  // Creadoras online para el sidebar
  const onlineCreators: OnlineCreatorExtended[] = [
    { id: 1, slug: 'maria-rodriguez-a7k3', nombre: 'Chelsea', edad: 24, avatar: 'https://i.pravatar.cc/150?img=1', isLive: true, isFavorite: true },
    { id: 2, slug: 'amanda-garcia-b9d2', nombre: 'Amanda', edad: 26, avatar: 'https://i.pravatar.cc/150?img=2', isLive: false, isFavorite: false },
    { id: 3, slug: 'chloe-martin-c4f7', nombre: 'Chloe', edad: 22, avatar: 'https://i.pravatar.cc/150?img=3', isLive: true, isFavorite: false },
    { id: 4, slug: 'leslie-hall-e8k1', nombre: 'Leslie', edad: 28, avatar: 'https://i.pravatar.cc/150?img=4', isLive: false, isFavorite: true },
    { id: 5, slug: 'maria-lopez-d3j9', nombre: 'María', edad: 25, avatar: 'https://i.pravatar.cc/150?img=5', isLive: false, isFavorite: false },
    { id: 6, slug: 'ana-martinez-f6l4', nombre: 'Ana', edad: 27, avatar: 'https://i.pravatar.cc/150?img=6', isLive: true, isFavorite: true },
  ];

  const tabs = [
    { id: 'descubrir' as const, label: 'Descubrir', icon: Heart },
    { id: 'en-vivo' as const, label: 'En Vivo', icon: Video },
  ];

  // Función para abrir perfil
  const handleVerPerfil = (creator: Creator) => {
    if (creator.slug) {
      navigate(`/perfil/${creator.slug}`);
    }
  };

  // 🔥 NUEVO: Función para abrir chat
  const handleOpenChat = (creatorId: string, creatorName: string, creatorAvatar: string) => {
    console.log('💬 Abriendo chat con:', creatorName);
    setActiveChatId(creatorId);
    setChatRecipient({
      id: creatorId,
      name: creatorName,
      avatar: creatorAvatar,
    });
  };

  // 🔥 NUEVO: Función para cerrar chat
  const handleCloseChat = () => {
    console.log('❌ Cerrando chat');
    setActiveChatId(null);
    setChatRecipient(null);
  };

  return (
    <>
      <NavbarDashboard
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        notificationsCount={5}
        messagesCount={3}
      />

      <SidebarDashboard
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* 🔥 NUEVO: Sidebar de creadoras online con función de chat */}
      <OnlineCreatorsSidebar 
        creators={onlineCreators}
        onOpenChat={handleOpenChat}
      />
      
      <main className="fixed top-16 left-0 right-0 bottom-0 lg:left-64 pr-0 lg:pr-24 overflow-hidden flex flex-col">
        {/* Header con Tabs */}
        <div className="flex-shrink-0 bg-white border-b border-slate-200">
          <div className="flex border-b border-slate-200 px-6">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors whitespace-nowrap
                    ${isActive ? 'text-pink-600' : 'text-slate-600 hover:text-slate-900'}
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto bg-slate-50">
          <div className="p-6">
            {activeTab === 'descubrir' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {creators.map((creator) => (
                  <div
                    key={creator.id}
                    className="bg-white rounded-2xl border-2 border-slate-200 hover:border-pink-300 transition-all overflow-hidden group shadow-sm hover:shadow-md"
                  >
                    {/* Avatar */}
                    <div 
                      className="relative aspect-[3/4] bg-slate-100 cursor-pointer"
                      onClick={() => handleVerPerfil(creator)}
                    >
                      <img
                        src={creator.avatar}
                        alt={creator.nombre}
                        className="w-full h-full object-cover"
                      />

                      {/* Badges */}
                      {creator.isLive && (
                        <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded-lg flex items-center gap-1 shadow-lg animate-pulse">
                          <div className="w-1.5 h-1.5 bg-white rounded-full" />
                          EN VIVO
                        </div>
                      )}

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Info */}
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h3 className="text-white font-bold text-lg mb-0.5">
                          {creator.nombre}
                        </h3>
                        <div className="flex items-center gap-1.5 text-white/90 text-xs">
                          <MapPin className="w-3 h-3" />
                          <span>{creator.ubicacion || 'Lima, Perú'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="p-3 space-y-2">
                      {/* 🔥 NUEVO: Botón de Chat */}
                      <button
                        onClick={() => handleOpenChat(
                          creator.id.toString(),
                          creator.nombre,
                          creator.avatar
                        )}
                        className="w-full px-4 py-2 bg-gradient-to-r from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 text-violet-600 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 border border-violet-200"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Chatear
                      </button>

                      <button
                        onClick={() => handleVerPerfil(creator)}
                        className="w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Perfil
                      </button>
                      
                      <button
                        className="w-full px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        <UserPlus className="w-4 h-4" />
                        Invitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 🔥 NUEVO: Modal de Chat Flotante */}
      {activeChatId && chatRecipient && (
        <FloatingChatModal
          recipientId={chatRecipient.id}
          recipientName={chatRecipient.name}
          recipientAvatar={chatRecipient.avatar}
          isOnline={true}
          onClose={handleCloseChat}
        />
      )}
    </>
  );
};

export const DashboardEspectadorPage = () => (
  <div className="min-h-screen bg-slate-50">
    <DashboardEspectadorPageContent />
  </div>
);
