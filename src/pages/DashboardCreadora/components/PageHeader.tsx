import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  count?: number;
}

export const PageHeader = ({ icon: Icon, title, subtitle, count }: PageHeaderProps) => {
  return (
    <div className="flex-shrink-0 bg-white border-b border-stone-200/60 px-6 py-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-rose-50 to-amber-50 rounded-xl border border-rose-100/50">
            <Icon className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-stone-800 tracking-wide">{title}</h1>
            {subtitle && (
              <p className="text-xs text-stone-500 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        
        {count !== undefined && count > 0 && (
          <div className="px-3 py-1.5 bg-gradient-to-r from-rose-500 to-amber-400 rounded-full">
            <span className="text-xs font-semibold text-white">{count} nuevas</span>
          </div>
        )}
      </div>
    </div>
  );
};
