import { useState } from 'react';
import { Phone, Send, Instagram, Clock, Check, X, MessageCircle, ShoppingBag } from 'lucide-react';
import { NavbarDashboard } from '../../components/Dashboard/Navbar/NavbarDashboard';
import { SidebarDashboard } from '../../components/Dashboard/Sidebar/SidebarDashboard';

interface Invitation {
  id: number;
  userId: number;
  userName: string;
  userAvatar: string;
  whatsapp: string;
  telegram: string;
  instagram: string;
  status: 'aceptada' | 'pendiente' | 'rechazada';
  fechaEstado: string;
  isOnline: boolean;
  isLive: boolean;
  isRecommended: boolean;
  mensajesEnviados: number; // 0 = primer mensaje gratis
}

export const InvitationsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null);
  const [messageText, setMessageText] = useState('');
  const [saldoUsuario] = useState(150); // Saldo actual del usuario en coins

  const [invitations, setInvitations] = useState<Invitation[]>([
    // Aceptadas
    { id: 1, userId: 1, userName: 'Carlos Mendez', userAvatar: 'https://i.pravatar.cc/150?img=12', whatsapp: '954874568', telegram: '@carlosmendez', instagram: '@carlos_m', status: 'aceptada', fechaEstado: '2025-01-15', isOnline: true, isLive: false, isRecommended: true, mensajesEnviados: 0 },
    { id: 2, userId: 2, userName: 'Jorge Silva', userAvatar: 'https://i.pravatar.cc/150?img=13', whatsapp: '987654321', telegram: '@jorgesilva', instagram: '@jorge_s', status: 'aceptada', fechaEstado: '2025-01-14', isOnline: false, isLive: false, isRecommended: false, mensajesEnviados: 2 },
    { id: 3, userId: 3, userName: 'Miguel Torres', userAvatar: 'https://i.pravatar.cc/150?img=14', whatsapp: '912345678', telegram: '@miguelt', instagram: '@miguel_torres', status: 'aceptada', fechaEstado: '2025-01-13', isOnline: true, isLive: true, isRecommended: false, mensajesEnviados: 1 },
    
    // Pendientes
    { id: 4, userId: 4, userName: 'Luis Ramirez', userAvatar: 'https://i.pravatar.cc/150?img=15', whatsapp: '923456789', telegram: '@luisr', instagram: '@luis_ram', status: 'pendiente', fechaEstado: '2025-01-10', isOnline: false, isLive: false, isRecommended: false, mensajesEnviados: 0 },
    { id: 5, userId: 5, userName: 'Pedro Castro', userAvatar: 'https://i.pravatar.cc/150?img=16', whatsapp: '934567890', telegram: '@pedroc', instagram: '@pedro_castro', status: 'pendiente', fechaEstado: '2025-01-09', isOnline: true, isLive: false, isRecommended: true, mensajesEnviados: 1 },
    
    // Rechazadas
    { id: 6, userId: 6, userName: 'Juan Perez', userAvatar: 'https://i.pravatar.cc/150?img=17', whatsapp: '945678901', telegram: '@juanp', instagram: '@juan_perez', status: 'rechazada', fechaEstado: '2025-01-08', isOnline: false, isLive: false, isRecommended: false, mensajesEnviados: 0 },
  ]);

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
    
    const costoPorMensaje = 10; // 10 coins por mensaje
    const esPrimerMensaje = selectedInvitation.mensajesEnviados === 0;

    if (!esPrimerMensaje && saldoUsuario < costoPorMensaje) {
      alert('Saldo insuficiente. Por favor recarga tu saldo.');
      return;
    }

    // TODO: Enviar mensaje al backend
    console.log('Enviando mensaje:', messageText);
    
    // Actualizar contador de mensajes
    setInvitations(invitations.map(inv => 
      inv.id === selectedInvitation.id 
        ? { ...inv, mensajesEnviados: inv.mensajesEnviados + 1 }
        : inv
    ));

    setShowMessageModal(false);
    setMessageText('');
  };

  const aceptadas = invitations.filter(inv => inv.status === 'aceptada');
  const pendientes = invitations.filter(inv => inv.status === 'pendiente');
  const rechazadas = invitations.filter(inv => inv.status === 'rechazada');

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
          <div className="mb-8 pb-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Mis Invitaciones</h1>
            <p className="text-gray-600">Administra las invitaciones que has enviado a las creadoras</p>
          </div>

          {/* Grid de 3 columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ACEPTADAS */}
            <div>
              <div className="bg-green-50 border-b-2 border-green-500 rounded-t-lg px-4 py-3">
                <h2 className="text-lg font-bold text-green-900 flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  Aceptadas {aceptadas.length}
                </h2>
                <p className="text-sm text-green-600 mt-1">Contacto aprobado</p>
              </div>
              <div className="border border-gray-200 rounded-b-lg divide-y divide-gray-200">
                {aceptadas.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <Check className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">No hay invitaciones aceptadas</p>
                  </div>
                ) : (
                  aceptadas.map((inv) => {
                    const daysTranscurred = getDaysTranscurred(inv.fechaEstado);
                    return (
                      <div key={inv.id} className="p-4 bg-white hover:bg-gray-50 transition">
                        <div className="flex items-start gap-3 mb-4">
                          {/* Avatar con indicadores */}
                          <div className="relative flex-shrink-0">
                            <img
                              src={inv.userAvatar}
                              alt={inv.userName}
                              className="w-12 h-12 rounded-full object-cover ring-2 ring-green-200"
                            />
                            {/* Indicador en línea */}
                            {inv.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                            {/* Indicador en vivo */}
                            {inv.isLive && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                              </div>
                            )}
                            {/* Indicador recomendada */}
                            {inv.isRecommended && (
                              <div className="absolute -top-1 -left-1 w-5 h-5 bg-yellow-400 border-2 border-white rounded-full flex items-center justify-center">
                                <span className="text-xs">⭐</span>
                              </div>
                            )}
                          </div>

                          {/* Info + Días */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">{inv.userName}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-green-600">Contacto disponible</p>
                              <span className="text-gray-300">•</span>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span>{daysTranscurred} días transcurridos</span>
                              </div>
                            </div>
                          </div>

                          {/* Botón Mensaje */}
                          {/* <button
                            onClick={() => handleOpenMessageModal(inv)}
                            className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition flex-shrink-0"
                            title="Enviar mensaje"
                          >
                            <MessageCircle className="w-5 h-5" />
                          </button> */}
                        </div>

                        <div className="space-y-2">
                           <a
                            href={`https://wa.me/${inv.whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm transition group"
                          >
                            <Phone className="w-4 h-4 text-gray-600 group-hover:text-green-600" />
                            <span className="font-medium text-gray-900">{inv.whatsapp}</span>
                          </a>

                           <a
                            href={`https://t.me/${inv.telegram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm transition group"
                          >
                            <Send className="w-4 h-4 text-gray-600 group-hover:text-blue-500" />
                            <span className="text-gray-700">{inv.telegram}</span>
                          </a>

                          <a
                            href={`https://instagram.com/${inv.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm transition group"
                          >
                            <Instagram className="w-4 h-4 text-gray-600 group-hover:text-pink-600" />
                            <span className="text-gray-700">{inv.instagram}</span>
                          </a>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* PENDIENTES */}
            <div>
              <div className="bg-yellow-50 border-b-2 border-yellow-500 rounded-t-lg px-4 py-3">
                <h2 className="text-lg font-bold text-yellow-900 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Pendientes {pendientes.length}
                </h2>
                <p className="text-sm text-yellow-600 mt-1">Esperando respuesta</p>
              </div>
              <div className="border border-gray-200 rounded-b-lg divide-y divide-gray-200">
                {pendientes.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">No hay invitaciones pendientes</p>
                  </div>
                ) : (
                  pendientes.map((inv) => {
                    const daysTranscurred = getDaysTranscurred(inv.fechaEstado);
                    return (
                      <div key={inv.id} className="p-4 bg-white hover:bg-gray-50 transition">
                        <div className="flex items-start gap-3 mb-3">
                          {/* Avatar con indicadores */}
                          <div className="relative flex-shrink-0">
                            <img
                              src={inv.userAvatar}
                              alt={inv.userName}
                              className="w-12 h-12 rounded-full object-cover ring-2 ring-yellow-200"
                            />
                            {inv.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                            {inv.isLive && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                              </div>
                            )}
                            {inv.isRecommended && (
                              <div className="absolute -top-1 -left-1 w-5 h-5 bg-yellow-400 border-2 border-white rounded-full flex items-center justify-center">
                                <span className="text-xs">⭐</span>
                              </div>
                            )}
                          </div>

                          {/* Info + Días */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">{inv.userName}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-yellow-600">Esperando respuesta</p>
                              <span className="text-gray-300">•</span>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span>{daysTranscurred} días transcurridos</span>
                              </div>
                            </div>
                          </div>

                          {/* Botón Mensaje */}
                          <button
                            onClick={() => handleOpenMessageModal(inv)}
                            className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition flex-shrink-0"
                            title="Enviar mensaje"
                          >
                            <MessageCircle className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="space-y-2 text-sm text-gray-400">
                          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                            <Phone className="w-4 h-4" />
                            <span>Oculto hasta aceptar</span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                            <Send className="w-4 h-4" />
                            <span>Oculto hasta aceptar</span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                            <Instagram className="w-4 h-4" />
                            <span>Oculto hasta aceptar</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* RECHAZADAS */}
            <div>
              <div className="bg-red-50 border-b-2 border-red-500 rounded-t-lg px-4 py-3">
                <h2 className="text-lg font-bold text-red-900 flex items-center gap-2">
                  <X className="w-5 h-5" />
                  Rechazadas {rechazadas.length}
                </h2>
                <p className="text-sm text-red-600 mt-1">No aceptaron la invitación</p>
              </div>
              <div className="border border-gray-200 rounded-b-lg divide-y divide-gray-200">
                {rechazadas.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <X className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">No hay invitaciones rechazadas</p>
                  </div>
                ) : (
                  rechazadas.map((inv) => {
                    const daysTranscurred = getDaysTranscurred(inv.fechaEstado);
                    return (
                      <div key={inv.id} className="p-4 bg-white hover:bg-gray-50 transition">
                        <div className="flex items-start gap-3 mb-3">
                          {/* Avatar con indicadores */}
                          <div className="relative flex-shrink-0">
                            <img
                              src={inv.userAvatar}
                              alt={inv.userName}
                              className="w-12 h-12 rounded-full object-cover ring-2 ring-red-200"
                            />
                            {inv.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                            {inv.isLive && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                              </div>
                            )}
                            {inv.isRecommended && (
                              <div className="absolute -top-1 -left-1 w-5 h-5 bg-yellow-400 border-2 border-white rounded-full flex items-center justify-center">
                                <span className="text-xs">⭐</span>
                              </div>
                            )}
                          </div>

                          {/* Info + Días */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">{inv.userName}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-red-600">Rechazada</p>
                              <span className="text-gray-300">•</span>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span>{daysTranscurred} días transcurridos</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-400">
                          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                            <Phone className="w-4 h-4" />
                            <span>No disponible</span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                            <Send className="w-4 h-4" />
                            <span>No disponible</span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                            <Instagram className="w-4 h-4" />
                            <span>No disponible</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
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
            {/* Header */}
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

            {/* Body */}
            <div className="p-6 space-y-4">
              {/* Info de costo */}
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

              {/* Textarea */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje
                </label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Escribe tu mensaje aquí..."
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {messageText.length}/500 caracteres
                </p>
              </div>

              {/* Warning si no tiene saldo */}
              {selectedInvitation.mensajesEnviados > 0 && saldoUsuario < costoPorMensaje && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-700 font-medium">
                    ⚠️ Saldo insuficiente. Necesitas recargar {costoPorMensaje - saldoUsuario} coins más.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-6 flex gap-3">
              <button
                onClick={() => setShowMessageModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
              >
                Cancelar
              </button>
              
              {selectedInvitation.mensajesEnviados > 0 && saldoUsuario < costoPorMensaje ? (
                <button
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
                >
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