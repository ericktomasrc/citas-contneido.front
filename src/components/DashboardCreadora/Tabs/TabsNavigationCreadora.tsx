import { Mail, BarChart3 } from 'lucide-react';

type TabTypeCreadora = 'invitaciones' | 'resumen'; // ✅ CAMBIO DE ORDEN

interface TabsNavigationCreadoraProps {
  activeTab: TabTypeCreadora;
  onTabChange: (tab: TabTypeCreadora) => void;
}

export const TabsNavigationCreadora = ({ 
  activeTab, 
  onTabChange 
}: TabsNavigationCreadoraProps) => {
  const tabs = [
    { id: 'invitaciones' as TabTypeCreadora, label: 'Invitaciones', icon: Mail }, // ✅ PRIMERO
    { id: 'resumen' as TabTypeCreadora, label: 'Resumen', icon: BarChart3 }, // ✅ SEGUNDO
  ];

  return (
    <div className="border-b border-gray-200 mb-6">
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center gap-2 px-6 py-3 font-medium transition relative
              ${activeTab === tab.id
                ? 'text-pink-600'
                : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            <tab.icon className="w-5 h-5" />
            <span>{tab.label}</span>
            
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};