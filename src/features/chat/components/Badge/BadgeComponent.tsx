// src/features/chat/components/Badge/BadgeComponent.tsx
// ✅ COMPONENTE PARA MOSTRAR INSIGNIAS DE SOLVENCIA

import { Badge } from '../../types/user.types';

interface BadgeComponentProps {
  badge: Badge;
  size?: 'sm' | 'md' | 'lg';
  position?: 'avatar' | 'message'; // Debajo del avatar o al lado del mensaje
}

export const BadgeComponent = ({ badge, size = 'md', position = 'avatar' }: BadgeComponentProps) => {
  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-2.5 py-1',
  };

  const iconSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  if (position === 'avatar') {
    // Debajo del avatar (vertical)
    return (
      <div 
        className={`${sizeClasses[size]} rounded-full font-bold text-white shadow-md flex items-center justify-center gap-1 whitespace-nowrap`}
        style={{ backgroundColor: badge.color }}
      >
        <span className={iconSizes[size]}>{badge.icon}</span>
        <span>{badge.name}</span>
      </div>
    );
  }

  // Al lado del mensaje (horizontal, más compacto)
  return (
    <div 
      className={`${sizeClasses[size]} rounded-lg font-semibold text-white shadow-sm inline-flex items-center gap-1`}
      style={{ backgroundColor: badge.color }}
    >
      <span className={iconSizes[size]}>{badge.icon}</span>
      <span>{badge.name}</span>
    </div>
  );
};
