import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  iconColor?: string;
}

export const PageHeader = ({ icon: Icon, title, iconColor = 'text-pink-500' }: PageHeaderProps) => {
  return (
    <div className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center gap-2">
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <h1 className="text-xl font-bold text-slate-800">{title}</h1>
      </div>
    </div>
  );
};
