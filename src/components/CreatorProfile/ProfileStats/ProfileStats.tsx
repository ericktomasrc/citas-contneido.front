import { MessageCircle, Users, Heart } from 'lucide-react';
import { CreatorProfile } from '../../../shared/types/creator-profile.types';

interface ProfileStatsProps {
  profile: CreatorProfile;
}

export const ProfileStats = ({ profile }: ProfileStatsProps) => {
  const stats = [
    {
      icon: MessageCircle,
      label: 'Recomendaciones',
      value: profile.recomendaciones,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Users,
      label: 'Suscriptores',
      value: profile.suscriptores >= 1000 
        ? `${(profile.suscriptores / 1000).toFixed(1)}k` 
        : profile.suscriptores,
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Heart,
      label: 'Likes',
      value: profile.likes >= 1000 
        ? `${(profile.likes / 1000).toFixed(1)}k` 
        : profile.likes,
      color: 'from-pink-500 to-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 px-6 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="relative overflow-hidden bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition group"
        >
          {/* Gradient Background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition`} />
          
          <div className="relative">
            <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-2`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-xs text-gray-600">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};