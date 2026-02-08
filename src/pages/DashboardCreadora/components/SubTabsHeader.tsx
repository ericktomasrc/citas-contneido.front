import { LucideIcon } from 'lucide-react';

export interface SubTab {
  id: string;
  label: string;
  icon: LucideIcon;
  count?: number;
}

interface SubTabsHeaderProps {
  tabs: SubTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const SubTabsHeader = ({ tabs, activeTab, onTabChange }: SubTabsHeaderProps) => {
  return (
    <div className="flex-shrink-0 bg-white border-b border-stone-200/60">
      <div className="flex px-4 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative flex items-center gap-2 px-5 py-4 text-sm font-medium transition-all duration-200 whitespace-nowrap
                ${isActive 
                  ? 'text-rose-600' 
                  : 'text-stone-500 hover:text-stone-700'
                }
              `}
            >
              <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-rose-500' : ''}`} />
              <span>{tab.label}</span>
              
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`
                  ml-1.5 px-2 py-0.5 text-[10px] font-semibold rounded-full transition-colors
                  ${isActive 
                    ? 'bg-rose-100 text-rose-600' 
                    : 'bg-stone-100 text-stone-500'
                  }
                `}>
                  {tab.count}
                </span>
              )}
              
              {/* Active indicator - elegant gold/rose gradient line */}
              <div className={`
                absolute bottom-0 left-2 right-2 h-0.5 rounded-full transition-all duration-300
                ${isActive 
                  ? 'bg-gradient-to-r from-rose-400 to-amber-400 opacity-100' 
                  : 'opacity-0'
                }
              `} />
            </button>
          );
        })}
      </div>
    </div>
  );
};
