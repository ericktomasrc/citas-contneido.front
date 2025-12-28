import { Home, Star, CreditCard, MessageCircle, Activity, Settings, X } from 'lucide-react';
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
        <nav className="p-4 space-y-1">
          <div>
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
        </nav>
      </aside>
    </>
  );
};