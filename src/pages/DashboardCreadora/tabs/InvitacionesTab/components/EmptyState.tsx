// src/pages/DashboardCreadora/tabs/InvitacionesTab/components/EmptyState.tsx

import { Sparkles } from 'lucide-react';

export const EmptyState = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center py-20 px-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-100 to-pink-100 rounded-2xl mb-5 border border-violet-200 shadow-sm">
          <Sparkles className="w-9 h-9 text-violet-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2 tracking-wide">
          Sin invitaciones aún
        </h3>
        <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
          Cuando alguien quiera conectar contigo, sus invitaciones aparecerán aquí
        </p>
      </div>
    </div>
  );
};
