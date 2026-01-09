// src/components/Dev/RoleSwitcher.tsx
// ⚠️ SOLO PARA DESARROLLO

import { useState } from 'react';
import { Crown, User, X, ChevronDown } from 'lucide-react';
import { useDevStore, DevRole } from '@/stores/dev.store';

export const RoleSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentRole, setRole, getCurrentUser } = useDevStore();
  
  const currentUser = getCurrentUser();

  const handleRoleChange = (role: DevRole) => {
    setRole(role);
    setIsOpen(false);
    // Recargar página para aplicar cambios
    window.location.reload();
  };

  return (
    <>
      {/* Botón flotante */}
      <div className="fixed bottom-4 left-4 z-[100]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-2xl font-semibold text-sm transition-all"
        >
          {currentRole === 'creadora' ? (
            <Crown className="w-4 h-4" />
          ) : (
            <User className="w-4 h-4" />
          )}
          <span>
            {currentRole === 'creadora' ? 'Creadora' : 'Espectador'}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Menú desplegable */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-[99]"
              onClick={() => setIsOpen(false)}
            />

            {/* Menú */}
            <div className="absolute bottom-full left-0 mb-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-[100]">
              {/* Header */}
              <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 text-sm">Modo de Desarrollo</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-6 h-6 rounded-lg hover:bg-white/50 flex items-center justify-center transition"
                  >
                    <X className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Cambia entre roles para probar el chat
                </p>
              </div>

              {/* Usuario actual */}
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                <p className="text-xs font-semibold text-slate-600 mb-2">Vista actual:</p>
                <div className="flex items-center gap-3">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-xs text-slate-500">@{currentUser.username}</p>
                  </div>
                </div>
              </div>

              {/* Opciones de rol */}
              <div className="p-2">
                {/* Creadora */}
                <button
                  onClick={() => handleRoleChange('creadora')}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                    currentRole === 'creadora'
                      ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300'
                      : 'hover:bg-slate-50 border-2 border-transparent'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    currentRole === 'creadora'
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                      : 'bg-gradient-to-br from-purple-100 to-pink-100'
                  }`}>
                    <Crown className={`w-5 h-5 ${
                      currentRole === 'creadora' ? 'text-white' : 'text-purple-600'
                    }`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-semibold text-sm ${
                      currentRole === 'creadora' ? 'text-purple-700' : 'text-slate-700'
                    }`}>
                      Vista de Creadora
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Recibe regalos, configura chat
                    </p>
                  </div>
                  {currentRole === 'creadora' && (
                    <div className="w-2 h-2 bg-purple-600 rounded-full" />
                  )}
                </button>

                {/* Espectador */}
                <button
                  onClick={() => handleRoleChange('espectador')}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all mt-2 ${
                    currentRole === 'espectador'
                      ? 'bg-gradient-to-r from-blue-100 to-cyan-100 border-2 border-blue-300'
                      : 'hover:bg-slate-50 border-2 border-transparent'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    currentRole === 'espectador'
                      ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                      : 'bg-gradient-to-br from-blue-100 to-cyan-100'
                  }`}>
                    <User className={`w-5 h-5 ${
                      currentRole === 'espectador' ? 'text-white' : 'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-semibold text-sm ${
                      currentRole === 'espectador' ? 'text-blue-700' : 'text-slate-700'
                    }`}>
                      Vista de Espectador
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Envía regalos, propinas
                    </p>
                  </div>
                  {currentRole === 'espectador' && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  )}
                </button>
              </div>

              {/* Warning */}
              <div className="px-4 py-3 bg-amber-50 border-t border-amber-200">
                <p className="text-xs text-amber-800">
                  ⚠️ Al cambiar el rol se recargará la página
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
