import { useState } from 'react';
import { Phone, Send, Instagram, Clock, Check, X, MessageCircle, ShoppingBag, Mail } from 'lucide-react';
import { NavbarDashboard } from '../../../components/Dashboard/Navbar/NavbarDashboard';
import { SidebarDashboard } from '../../../components/Dashboard/Sidebar/SidebarDashboard';

interface Invitation {
  id: number;
  userId: number;
  userName: string;
  userAvatar: string;
  whatsapp: string;
  telegram: string;
  instagram: string;
  tiktok?: string;
  status: 'aceptada' | 'pendiente' | 'rechazada';
  fechaEstado: string;
  isOnline: boolean;
  isLive: boolean;
  isRecommended: boolean;
  mensajesEnviados: number;
}

export const InvitationsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null);
  const [messageText, setMessageText] = useState('');
  const [saldoUsuario] = useState(150);
  const [filterStatus, setFilterStatus] = useState<'aceptada' | 'pendiente' | 'rechazada'>('aceptada');

  const [invitations, setInvitations] = useState<Invitation[]>([
    { id: 1, userId: 1,tiktok: '@carlos_mendez', userName: 'Carlos Mendez', userAvatar: 'https://i.pravatar.cc/150?img=12', whatsapp: '954874568', telegram: '@carlosmendez', instagram: '@carlos_m', status: 'aceptada', fechaEstado: '2025-01-15', isOnline: true, isLive: false, isRecommended: true, mensajesEnviados: 0 },
    { id: 2, userId: 2, tiktok: '@carlos_mendez',userName: 'Jorge Silva', userAvatar: 'https://i.pravatar.cc/150?img=13', whatsapp: '987654321', telegram: '@jorgesilva', instagram: '@jorge_s', status: 'aceptada', fechaEstado: '2025-01-14', isOnline: false, isLive: false, isRecommended: false, mensajesEnviados: 2 },
    { id: 3, userId: 3, tiktok: '@carlos_mendez',userName: 'Miguel Torres', userAvatar: 'https://i.pravatar.cc/150?img=14', whatsapp: '912345678', telegram: '@miguelt', instagram: '@miguel_torres', status: 'aceptada', fechaEstado: '2025-01-13', isOnline: true, isLive: true, isRecommended: false, mensajesEnviados: 1 },
    { id: 4, userId: 4, tiktok: '@carlos_mendez',userName: 'Luis Ramirez', userAvatar: 'https://i.pravatar.cc/150?img=15', whatsapp: '923456789', telegram: '@luisr', instagram: '@luis_ram', status: 'pendiente', fechaEstado: '2025-01-10', isOnline: false, isLive: false, isRecommended: false, mensajesEnviados: 0 },
    { id: 5, userId: 5, tiktok: '@carlos_mendez',userName: 'Pedro Castro', userAvatar: 'https://i.pravatar.cc/150?img=16', whatsapp: '934567890', telegram: '@pedroc', instagram: '@pedro_castro', status: 'pendiente', fechaEstado: '2025-01-09', isOnline: true, isLive: false, isRecommended: true, mensajesEnviados: 1 },
    { id: 6, userId: 6, tiktok: '@carlos_mendez',userName: 'Juan Perez', userAvatar: 'https://i.pravatar.cc/150?img=17', whatsapp: '945678901', telegram: '@juanp', instagram: '@juan_perez', status: 'rechazada', fechaEstado: '2025-01-08', isOnline: false, isLive: false, isRecommended: false, mensajesEnviados: 0 },
  ]);

  const tabs = [
    { 
      id: 'aceptada' as const,
      label: 'Aceptadas',
      icon: Check,
      gradient: 'from-green-500 to-emerald-600',
      bgActive: 'bg-green-50',
      borderActive: 'border-green-500',
      count: invitations.filter(i => i.status === 'aceptada').length
    },
    { 
      id: 'pendiente' as const,
      label: 'Pendientes',
      icon: Clock,
      gradient: 'from-yellow-500 to-orange-600',
      bgActive: 'bg-yellow-50',
      borderActive: 'border-yellow-500',
      count: invitations.filter(i => i.status === 'pendiente').length
    },
    { 
      id: 'rechazada' as const,
      label: 'Rechazadas',
      icon: X,
      gradient: 'from-red-500 to-rose-600',
      bgActive: 'bg-red-50',
      borderActive: 'border-red-500',
      count: invitations.filter(i => i.status === 'rechazada').length
    },
  ];

  const getDaysTranscurred = (fechaEstado: string) => {
    const fecha = new Date(fechaEstado);
    const hoy = new Date();
    const diff = Math.floor((hoy.getTime() - fecha.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  const handleOpenMessageModal = (inv: Invitation) => {
    setSelectedInvitation(inv);
    setShowMessageModal(true);
    setMessageText('');
  };

  const handleSendMessage = () => {
    if (!selectedInvitation) return;
    
    const costoPorMensaje = 10;
    const esPrimerMensaje = selectedInvitation.mensajesEnviados === 0;

    if (!esPrimerMensaje && saldoUsuario < costoPorMensaje) {
      alert('Saldo insuficiente. Por favor recarga tu saldo.');
      return;
    }

    console.log('Enviando mensaje:', messageText);
    
    setInvitations(invitations.map(inv => 
      inv.id === selectedInvitation.id 
        ? { ...inv, mensajesEnviados: inv.mensajesEnviados + 1 }
        : inv
    ));

    setShowMessageModal(false);
    setMessageText('');
  };

  const filteredInvitations = invitations.filter(inv => inv.status === filterStatus);

  const getStatusConfig = (status: string) => {
    const configs = {
      aceptada: {
        bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
        border: 'border-green-200',
        badge: 'bg-green-500',
        badgeText: 'text-white',
        text: 'text-green-700',
        icon: Check,
      },
      pendiente: {
        bg: 'bg-gradient-to-r from-yellow-50 to-orange-50',
        border: 'border-yellow-200',
        badge: 'bg-yellow-500',
        badgeText: 'text-white',
        text: 'text-yellow-700',
        icon: Clock,
      },
      rechazada: {
        bg: 'bg-gradient-to-r from-red-50 to-rose-50',
        border: 'border-red-200',
        badge: 'bg-red-500',
        badgeText: 'text-white',
        text: 'text-red-700',
        icon: X,
      },
    };
    return configs[status as keyof typeof configs];
  };

  const costoPorMensaje = 10;

  return (
    <div className="min-h-screen bg-white">
      <NavbarDashboard
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        notificationsCount={5}
        messagesCount={3}
      />

      <SidebarDashboard isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="pt-16 lg:pl-64 min-h-screen">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Mail className="w-7 h-7 text-pink-500" />
              Mis Invitaciones
            </h1>
            <p className="text-gray-600">Administra las invitaciones que has enviado a las creadoras</p>
          </div>

          {/* Tabs Premium - Igual que SubscriptionsPage */}
          <div className="mb-8">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {tabs.map((tab) => {
                const isActive = filterStatus === tab.id;
                const Icon = tab.icon;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setFilterStatus(tab.id)}
                    className={`
                      group relative flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all whitespace-nowrap
                      ${isActive 
                        ? `${tab.bgActive} ring-1 ${tab.borderActive.replace('border-', 'ring-')}` 
                        : 'bg-white border border-gray-200 hover:bg-gray-50'
                      }
                    `}
                  >
                    {/* Icono */}
                    <div className={`
                      flex items-center justify-center w-7 h-7 rounded-md transition-all
                      ${isActive 
                        ? `bg-gradient-to-r ${tab.gradient}` 
                        : 'bg-gray-100'
                      }
                    `}>
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                    </div>

                    {/* Label */}
                    <span className={`
                      font-semibold text-sm transition-colors
                      ${isActive 
                        ? `bg-gradient-to-r ${tab.gradient} bg-clip-text text-transparent` 
                        : 'text-gray-700'
                      }
                    `}>
                      {tab.label}
                    </span>

                    {/* Badge Count */}
                    {tab.count > 0 && (
                      <span className={`
                        px-2 py-0.5 rounded-full text-xs font-bold
                        ${isActive 
                          ? 'bg-white/30 text-gray-700' 
                          : 'bg-gray-200 text-gray-600'
                        }
                      `}>
                        {tab.count}
                      </span>
                    )}

                    {/* Indicator activo */}
                    {isActive && (
                      <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-gradient-to-r ${tab.gradient}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid de Cards Premium - 5 COLUMNAS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredInvitations.map((inv) => {
              const config = getStatusConfig(inv.status);
              const StatusIcon = config.icon;
              const daysTranscurred = getDaysTranscurred(inv.fechaEstado);

              return (
                <div
                  key={inv.id}
                  className={`
                    ${config.bg} border-2 ${config.border} rounded-2xl p-4 shadow-lg hover:shadow-xl transition relative
                  `}
                >
                  {/* Badge de Estado - Superior Izquierda */}
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 ${config.badge} ${config.badgeText} text-xs font-bold rounded-full shadow-md`}>
                      <StatusIcon className="w-3 h-3" />
                      {inv.status === 'aceptada' && 'Aceptada'}
                      {inv.status === 'pendiente' && 'Pendiente'}
                      {inv.status === 'rechazada' && 'Rechazada'}
                    </span>
                  </div>

                  {/* Botón Mensaje (Pendientes) - Superior Derecha */}
                  {inv.status === 'pendiente' && (
                    <button
                      onClick={() => handleOpenMessageModal(inv)}
                      className="absolute top-3 right-3 w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition flex items-center justify-center shadow-lg z-10"
                      title="Enviar mensaje"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  )}

                  {/* Botón X (Pendientes) - Inferior para rechazar */}
                  {inv.status === 'pendiente' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Rechazar invitación:', inv.id);
                      }}
                      className="absolute bottom-3 right-3 w-10 h-10 bg-white border-2 border-red-500 hover:bg-red-500 text-red-500 hover:text-white rounded-full transition flex items-center justify-center shadow-lg z-10"
                      title="Rechazar invitación"
                    >
                      <X className="w-5 h-5" strokeWidth={3} />
                    </button>
                  )}

                  {/* Header del Card */}
                  <div className="flex flex-col items-center mt-8 mb-3">
                    {/* Avatar con indicadores */}
                    <button className="relative mb-3 cursor-pointer group">
                      <div className="w-20 h-20 rounded-full p-0.5 bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500 group-hover:scale-105 transition">
                        <div className="w-full h-full bg-white rounded-full p-0.5">
                          <img
                            src={inv.userAvatar}
                            alt={inv.userName}
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Online */}
                      {inv.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                      )}

                      {/* Live */}
                      {inv.isLive && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 border-2 border-white rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                      )}

                      {/* Recomendada */}
                      {inv.isRecommended && (
                        <div className="absolute -top-1 -left-1 w-6 h-6 bg-yellow-400 border-2 border-white rounded-full flex items-center justify-center">
                          <span className="text-xs">⭐</span>
                        </div>
                      )}
                    </button>

                    {/* Nombre */}
                    <h3 className="text-base font-bold text-gray-900 mb-2 text-center truncate w-full px-2">
                      {inv.userName}
                    </h3>

                    {/* Días transcurridos */}
                    {(inv.status === 'pendiente' || inv.status === 'rechazada') && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/70 text-gray-600 text-xs rounded-full mb-2">
                        <Clock className="w-3 h-3" />
                        {daysTranscurred}d
                      </span>
                    )}
                  </div>

                  {/* Contactos o Estado */}
                  {inv.status === 'aceptada' ? (
                    <div className="space-y-2">
                      {/* WhatsApp */}
                      <a
                        href={`https://wa.me/${inv.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 bg-white hover:bg-gray-50 rounded-lg transition group"
                      >
                        <Phone className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-xs font-medium text-gray-900 truncate">{inv.whatsapp}</span>
                      </a>

                      {/* Redes sociales */}
                      <div className="flex items-center justify-center gap-2">
                        <a
                          href={`https://t.me/${inv.telegram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 flex items-center justify-center bg-white hover:bg-gray-50 rounded-lg transition group"
                          title={inv.telegram}
                        >
                          <Send className="w-4 h-4 text-blue-600" />
                        </a>

                        <a
                          href={`https://instagram.com/${inv.instagram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 flex items-center justify-center bg-white hover:bg-gray-50 rounded-lg transition group"
                          title={inv.instagram}
                        >
                          <Instagram className="w-4 h-4 text-pink-600" />
                        </a>

                        {inv.tiktok && (
                          <a
                            href={`https://tiktok.com/@${inv.tiktok.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 flex items-center justify-center bg-white hover:bg-gray-50 rounded-lg transition group"
                            title={inv.tiktok}
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/50 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500">
                        {inv.status === 'pendiente' && '⏳ Ocultos hasta aceptar'}
                        {inv.status === 'rechazada' && '❌ No disponibles'}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredInvitations.length === 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-gray-200">
              <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No hay invitaciones</h3>
              <p className="text-gray-600">
                {filterStatus === 'aceptada' && 'No tienes invitaciones aceptadas'}
                {filterStatus === 'pendiente' && 'No tienes invitaciones pendientes'}
                {filterStatus === 'rechazada' && 'No tienes invitaciones rechazadas'}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* MODAL ENVIAR MENSAJE */}
      {showMessageModal && selectedInvitation && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowMessageModal(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-lg w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <img
                  src={selectedInvitation.userAvatar}
                  alt={selectedInvitation.userName}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-200"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedInvitation.userName}</h3>
                  <p className="text-sm text-gray-600">Enviar mensaje</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className={`p-4 rounded-lg border ${
                selectedInvitation.mensajesEnviados === 0 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedInvitation.mensajesEnviados === 0 ? '🎁 Primer mensaje GRATIS' : '💬 Mensaje adicional'}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {selectedInvitation.mensajesEnviados === 0 
                        ? 'Aprovecha tu primer mensaje sin costo' 
                        : `Costo: ${costoPorMensaje} coins`}
                    </p>
                  </div>
                  {selectedInvitation.mensajesEnviados > 0 && (
                    <div className="text-right">
                      <p className="text-xs text-gray-600">Tu saldo</p>
                      <p className="text-lg font-bold text-gray-900">{saldoUsuario} coins</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Escribe tu mensaje aquí..."
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <p className="text-xs text-gray-500 mt-1 text-right">{messageText.length}/500</p>
              </div>

              {selectedInvitation.mensajesEnviados > 0 && saldoUsuario < costoPorMensaje && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-700 font-medium">
                    ⚠️ Saldo insuficiente. Necesitas recargar {costoPorMensaje - saldoUsuario} coins más.
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 p-6 flex gap-3">
              <button
                onClick={() => setShowMessageModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
              >
                Cancelar
              </button>
              
              {selectedInvitation.mensajesEnviados > 0 && saldoUsuario < costoPorMensaje ? (
                <button className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white rounded-lg font-medium transition flex items-center justify-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Recargar Saldo
                </button>
              ) : (
                <button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Enviar {selectedInvitation.mensajesEnviados === 0 ? 'Gratis' : `(${costoPorMensaje} coins)`}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};