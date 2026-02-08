import { Sparkles } from 'lucide-react';

export const InvitacionesEmpty = () => {
  return (
    <div className="text-center py-20 px-6">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-stone-100 to-stone-50 rounded-2xl mb-5 border border-stone-200/60 shadow-sm">
        <Sparkles className="w-9 h-9 text-amber-400" />
      </div>
      <h3 className="text-xl font-semibold text-stone-800 mb-2 tracking-wide">
        Sin invitaciones aún
      </h3>
      <p className="text-sm text-stone-500 max-w-xs mx-auto leading-relaxed">
        Cuando alguien quiera conectar contigo, sus invitaciones aparecerán aquí
      </p>
    </div>
  );
};
