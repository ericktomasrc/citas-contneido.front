import { Flame, Video, Sparkles, Star } from 'lucide-react';
import { TabType } from '../../../shared/types/creator.types';

interface TabsNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  activeQuickFilter?: 'nuevas' | 'destacadas' | null;
  onQuickFilterChange?: (filter: 'nuevas' | 'destacadas' | null) => void;
}

export const TabsNavigation = ({ 
  activeTab, 
  onTabChange,
  activeQuickFilter,
  onQuickFilterChange 
}: TabsNavigationProps) => {
  const tabs = [
    { id: 'descubrir' as TabType, label: 'Descubrir', icon: Flame },
    { id: 'en-vivo' as TabType, label: 'En Vivo', icon: Video },
  ];

  return (
    <div className="flex items-center justify-between border-b border-gray-200">
      {/* Tabs */}
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

      {/* Quick Filters */}
      <div className="flex gap-2 pr-4">
        <button
          onClick={() => onQuickFilterChange?.(activeQuickFilter === 'nuevas' ? null : 'nuevas')}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
            ${activeQuickFilter === 'nuevas'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
              : 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 hover:from-blue-100 hover:to-cyan-100'
            }
          `}
        >
          <Sparkles className="w-4 h-4" />
          <span>Nuevas</span>
        </button>

        <button
          onClick={() => onQuickFilterChange?.(activeQuickFilter === 'destacadas' ? null : 'destacadas')}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
            ${activeQuickFilter === 'destacadas'
              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
              : 'bg-gradient-to-r from-yellow-50 to-orange-50 text-yellow-600 hover:from-yellow-100 hover:to-orange-100'
            }
          `}
        >
          <Star className="w-4 h-4" />
          <span>Destacadas</span>
        </button>
      </div>
    </div>
  );
};