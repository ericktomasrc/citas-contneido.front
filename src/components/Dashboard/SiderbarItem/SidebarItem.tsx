import { LucideIcon } from 'lucide-react';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  active?: boolean;
  badge?: number;
}

export const SidebarItem = ({ icon: Icon, label, href, active, badge }: SidebarItemProps) => {
  return (
    <a
      href={href}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-lg transition group
        ${active 
          ? 'bg-gradient-to-r from-pink-50 to-purple-50 text-pink-600' 
          : 'text-gray-700 hover:bg-gray-50'
        }
      `}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-pink-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
      <span className="flex-1 font-medium text-sm">{label}</span>
      {badge && badge > 0 && (
        <span className="px-2 py-0.5 bg-pink-500 text-white text-xs rounded-full">
          {badge}
        </span>
      )}
    </a>
  );
};