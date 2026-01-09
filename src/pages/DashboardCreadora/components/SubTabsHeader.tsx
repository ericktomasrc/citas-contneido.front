import { LucideIcon } from 'lucide-react';

export interface SubTab {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface SubTabsHeaderProps {
  tabs: SubTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const SubTabsHeader = ({ tabs, activeTab, onTabChange }: SubTabsHeaderProps) => {
  return (
    <div className="flex-shrink-0 bg-white border-b border-slate-200">
      <div className="flex border-b border-slate-200 px-6 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors whitespace-nowrap
                ${isActive 
                  ? 'text-pink-600' 
                  : 'text-slate-600 hover:text-slate-900'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
