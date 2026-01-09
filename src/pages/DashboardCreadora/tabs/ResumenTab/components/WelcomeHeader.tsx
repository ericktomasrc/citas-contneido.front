import { TrendingUp } from 'lucide-react';

interface WelcomeHeaderProps {
  nombreUsuario: string;
  gananciasMes: number;
}

export const WelcomeHeader = ({ nombreUsuario, gananciasMes }: WelcomeHeaderProps) => {
  return (
    <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-1">
          ¡Hola {nombreUsuario}! 👋
        </h2>
        <p className="text-sm text-slate-600">
          Aquí tienes un resumen de tu actividad
        </p>
      </div>

      <div className="hidden md:block">
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl px-5 py-3 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-emerald-700 font-medium">Ganancias este mes</p>
            <p className="text-xl font-bold text-emerald-900">
              S/. {gananciasMes.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
