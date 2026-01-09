import { Heart } from 'lucide-react';

export const InvitacionesEmpty = () => {
  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl mb-4">
        <Heart className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-700 mb-2">
        No tienes invitaciones
      </h3>
      <p className="text-sm text-slate-500">
        Cuando alguien se interese en ti, aparecerá aquí
      </p>
    </div>
  );
};
