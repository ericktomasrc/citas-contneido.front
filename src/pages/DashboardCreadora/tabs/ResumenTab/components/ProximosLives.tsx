interface LiveProgramado {
  titulo: string;
  fecha: string;
}

const livesProgramados: LiveProgramado[] = [
  {
    titulo: 'Yoga Matutina',
    fecha: 'Hoy a las 10:00 AM',
  },
];

export const ProximosLives = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200">
      <h3 className="text-base font-bold text-slate-800 mb-4">
        Próximos Lives
      </h3>
      <div className="space-y-3">
        {livesProgramados.length > 0 ? (
          <>
            {livesProgramados.map((live, index) => (
              <div 
                key={index}
                className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  <span className="text-xs font-bold text-red-600">PROGRAMADO</span>
                </div>
                <p className="font-semibold text-slate-900 text-sm">{live.titulo}</p>
                <p className="text-xs text-slate-600 mt-0.5">{live.fecha}</p>
              </div>
            ))}
            
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 text-center">
                No tienes más lives programados
              </p>
            </div>
          </>
        ) : (
          <div className="p-4 bg-slate-50 rounded-xl">
            <p className="text-xs text-slate-500 text-center">
              No tienes lives programados
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
