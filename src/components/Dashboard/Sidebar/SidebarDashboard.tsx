import { Home, Star, CreditCard, MessageCircle, Activity, Settings, X, Wifi } from 'lucide-react';
import { SidebarItem } from './SidebarItem';

interface SidebarDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SidebarDashboard = ({ isOpen, onClose }: SidebarDashboardProps) => {
  const menuItems = [
    { icon: Home, label: 'Inicio', href: '/dashboard', active: true },
    { icon: Star, label: 'Favoritas', href: '/favoritas', badge: 12 },
    { icon: CreditCard, label: 'Mis Suscripciones', href: '/suscripciones', badge: 3 },
    { icon: MessageCircle, label: 'Chats', href: '/chats', badge: 5 },
    { icon: Activity, label: 'Mi Actividad', href: '/actividad' },
    { icon: Settings, label: 'Configuración', href: '/configuracion' },
  ];

  // Mock data - En línea
const onlineCreators = [
  { id: 1, nombre: 'Chelsea', avatar: 'https://i.pravatar.cc/150?img=1', isLive: true },  // ✅ En vivo
  { id: 2, nombre: 'Amanda', avatar: 'https://i.pravatar.cc/150?img=2', isLive: false }, // Solo en línea
  { id: 3, nombre: 'Chloe', avatar: 'https://i.pravatar.cc/150?img=3', isLive: true },   // ✅ En vivo
  { id: 4, nombre: 'Leslie', avatar: 'https://i.pravatar.cc/150?img=4', isLive: false }, // Solo en línea
];
  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header - Solo móvil */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
          <span className="font-semibold text-gray-900">Menú</span>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-full">
          {/* PRINCIPAL */}
          <div className="mb-4">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Principal
            </h3>
            {menuItems.map((item) => (
              <SidebarItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                href={item.href}
                active={item.active}
                badge={item.badge}
              />
            ))}
          </div>

          {/* EN LÍNEA */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between px-3 mb-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Wifi className="w-3.5 h-3.5 text-green-500" />
                EN LÍNEA
              </h3>
              <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                {onlineCreators.length}
              </span>
            </div>
            <div className="space-y-1">
            {onlineCreators.map((creator) => (
              <button
                key={creator.id}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg transition group"
              >
                <div className="relative">
                  <img
                    src={creator.avatar}
                    alt={creator.nombre}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  
                  {/* Live Badge */}
                  {creator.isLive && (
                    <div className="absolute -top-1 -left-1 flex items-center gap-1 px-1.5 py-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full shadow-lg">
                      <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                      LIVE
                    </div>
                  )}
                  
                  {/* Online indicator */}
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                </div>
                
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-pink-600 transition">
                    {creator.nombre}
                  </p>
                  <p className={`text-xs flex items-center gap-1 ${creator.isLive ? 'text-red-600' : 'text-green-600'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${creator.isLive ? 'bg-red-500' : 'bg-green-500'}`} />
                    {creator.isLive ? 'En vivo ahora' : 'En línea ahora'}
                  </p>
                </div>
              </button>
            ))}
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
};